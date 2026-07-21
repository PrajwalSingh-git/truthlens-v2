"""
Optional LLM-backed analysis engine.

This is used INSTEAD of the pure heuristic engine when an API key is
configured. It calls out to Anthropic (Claude) or Groq (free tier,
OpenAI-compatible), asks the model to return structured JSON matching
our existing schema, and falls back to the heuristic engine on any
failure (missing key, network error, malformed response) so the app
never breaks because of this.

To enable:
  - Anthropic: set ANTHROPIC_API_KEY in your .env (console.anthropic.com)
  - Groq (free): set GROQ_API_KEY in your .env (console.groq.com)
If both are set, Anthropic is preferred. If neither is set, this module
is never called — app/api/analyze.py uses the heuristic engine directly.
"""
import json
import re
import uuid
from datetime import datetime, timezone

import httpx

from app.core.config import get_settings
from app.services.analysis_engine import analyze as heuristic_analyze

SYSTEM_PROMPT = """You are TruthLens AI's content credibility analyzer. Given a piece of \
text, analyze it for misinformation risk signals and respond with ONLY a JSON object \
(no markdown, no prose) matching this exact shape:

{
  "credibility": <0-100 float, higher = more credible>,
  "confidence": <0-100 float, how confident you are in this read>,
  "summary": "<1-2 sentence plain-language summary>",
  "signals": {
    "bias": <0-100>, "propaganda": <0-100>, "clickbait": <0-100>,
    "emotional_manipulation": <0-100>, "political_bias": <0-100>
  },
  "political_lean": <-100 (left) to 100 (right), 0 if apolitical>,
  "propaganda_characteristics": {
    "fear": <0-100>, "urgency": <0-100>, "us_vs_them": <0-100>,
    "evidence_gap": <0-100>, "authority_attack": <0-100>, "repetition": <0-100>
  },
  "sentiment_arc": {"opening": <0-100>, "middle": <0-100>, "close": <0-100>},
  "shareability_risk": <0-100, how risky to reshare without verification>,
  "extracted_claims": ["<key factual claim 1>", "<key factual claim 2>"],
  "verification_guidance": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "explanations": ["<why it scored this way, one sentence each>"],
  "flagged_phrases": [
    {"phrase": "<exact substring from the input>", "reason": "<short reason>",
     "tone": "danger|warning|primary", "label": "<short category label>",
     "description": "<1 sentence on why this is flagged>",
     "tip": "<1 sentence verification tip>"}
  ]
}

"flagged_phrases[].phrase" MUST be an exact, verbatim substring of the input text (for
highlighting). Keep flagged_phrases to the 3-8 most important. Respond with ONLY the JSON."""


def _build_flags_from_phrases(text: str, phrases: list[dict]) -> list[dict]:
    """Convert LLM-returned phrase strings into start/end offset flags by
    locating them in the original text."""
    flags = []
    cursor_by_phrase = {}
    for p in phrases:
        phrase = p.get("phrase", "")
        if not phrase:
            continue
        start_from = cursor_by_phrase.get(phrase, 0)
        idx = text.find(phrase, start_from)
        if idx == -1:
            idx = text.lower().find(phrase.lower(), 0)
        if idx == -1:
            continue
        cursor_by_phrase[phrase] = idx + 1
        flags.append({
            "start": idx,
            "end": idx + len(phrase),
            "reason": p.get("reason", "Flagged phrase"),
            "tone": p.get("tone", "warning"),
            "label": p.get("label", "Flagged"),
            "description": p.get("description", ""),
            "tip": p.get("tip", ""),
        })
    return flags


def _call_anthropic(api_key: str, text: str) -> dict:
    resp = httpx.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            # claude-haiku-4-5-20251001 is cheaper/faster if you want to cut costs
            "model": "claude-sonnet-5",
            "max_tokens": 1500,
            "system": SYSTEM_PROMPT,
            "messages": [{"role": "user", "content": text}],
        },
        timeout=30.0,
    )
    resp.raise_for_status()
    data = resp.json()
    raw = "".join(block.get("text", "") for block in data.get("content", []) if block.get("type") == "text")
    return _parse_json_response(raw)


def _call_groq(api_key: str, text: str) -> dict:
    resp = httpx.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Authorization": f"Bearer {api_key}", "content-type": "application/json"},
        json={
            "model": "llama-3.1-8b-instant",
            "max_tokens": 1500,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": text},
            ],
            "response_format": {"type": "json_object"},
        },
        timeout=30.0,
    )
    resp.raise_for_status()
    data = resp.json()
    raw = data["choices"][0]["message"]["content"]
    return _parse_json_response(raw)


def _parse_json_response(raw: str) -> dict:
    cleaned = re.sub(r"^```(?:json)?|```$", "", raw.strip(), flags=re.MULTILINE).strip()
    return json.loads(cleaned)


def analyze_with_llm(input_type: str, raw_input: str) -> dict:
    """
    Returns a fully-formed result dict (same shape as the heuristic
    engine's output) using an LLM, or raises on failure — callers should
    catch and fall back to the heuristic engine.
    """
    settings = get_settings()
    text = raw_input.strip()

    if settings.anthropic_api_key:
        parsed = _call_anthropic(settings.anthropic_api_key, text)
    elif settings.groq_api_key:
        parsed = _call_groq(settings.groq_api_key, text)
    else:
        raise RuntimeError("No LLM API key configured.")

    flags = _build_flags_from_phrases(text, parsed.get("flagged_phrases", []))

    title = (text[:70] + "…") if len(text) > 70 else text
    if input_type == "url":
        title = raw_input

    result = {
        "id": str(uuid.uuid4()),
        "title": title,
        "input_type": input_type,
        "credibility": float(parsed.get("credibility", 50)),
        "confidence": float(parsed.get("confidence", 50)),
        "summary": parsed.get("summary", ""),
        "signals": _normalize_keys(parsed.get("signals", {})),
        "political_lean": float(parsed.get("political_lean", 0)),
        "propaganda_characteristics": _normalize_keys(parsed.get("propaganda_characteristics", {})),
        "sentiment_arc": parsed.get("sentiment_arc", {"opening": 0, "middle": 0, "close": 0}),
        "shareability_risk": float(parsed.get("shareability_risk", 0)),
        "extracted_claims": parsed.get("extracted_claims", []),
        "verification_guidance": parsed.get("verification_guidance", []),
        "explanations": parsed.get("explanations", []),
        "highlighted_text": text,
        "flags": flags,
        "created_at": datetime.now(timezone.utc),
    }

    # Some smaller/faster models (e.g. Groq's llama-3.1-8b-instant) don't
    # always follow the exact key names in the prompt (e.g. "us-vs-them"
    # instead of "us_vs_them"). Rather than let a malformed shape crash at
    # the FastAPI response-serialization layer (a 500 the user actually
    # hit), validate against the real schema here — if it doesn't match,
    # raise so the caller falls back to the heuristic engine instead.
    from app.models.schemas import AnalyzeResponse
    AnalyzeResponse.model_validate(result)

    return result


def _normalize_keys(d: dict) -> dict:
    """LLMs sometimes use hyphens or different casing for JSON keys even
    when told exactly what key to use (e.g. "us-vs-them" instead of
    "us_vs_them"). Normalize common variants defensively before schema
    validation, so a near-correct response doesn't unnecessarily trigger
    the heuristic fallback."""
    if not isinstance(d, dict):
        return d
    return {k.replace("-", "_").replace(" ", "_").lower(): v for k, v in d.items()}


def analyze(input_type: str, raw_input: str) -> dict:
    """
    Tries the LLM engine first (if configured), falls back to the
    heuristic engine on any error. This is the function app/api/analyze.py
    should call — it never raises.
    """
    settings = get_settings()
    if settings.anthropic_api_key or settings.groq_api_key:
        try:
            return analyze_with_llm(input_type, raw_input)
        except Exception:
            # LLM call failed (bad key, network, malformed JSON, etc.) —
            # fall back silently to the always-available heuristic engine.
            pass
    return heuristic_analyze(input_type, raw_input)
