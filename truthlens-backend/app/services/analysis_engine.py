"""
Rule-based credibility analysis engine.

This is a genuine heuristic analyzer (lexicon + pattern matching), not a
mock. It runs entirely offline with no external API calls, so the app
works out of the box. If ANTHROPIC_API_KEY is configured, an LLM-backed
engine can be swapped in later without changing the API contract — see
the `analyze()` function signature.
"""
import re
import statistics
import uuid
from datetime import datetime, timezone

CLICKBAIT_PATTERNS = [
    r"\byou won'?t believe\b",
    r"\bwhat happens next\b",
    r"\bshocking\b",
    r"\bstunned\b",
    r"\bmind[- ]?blowing\b",
    r"\bthis is why\b",
    r"\bnumber \d+ will\b",
    r"\b\d+ (things|reasons|ways|facts) (you|that)\b",
    r"\bsecret(s)? (they|nobody|no one) (want|wants)\b",
    r"\bgone wrong\b",
    r"\bslams\b",
    r"\bdestroys\b",
    r"\bepic\b",
]

PROPAGANDA_TERMS = [
    "always", "never", "everyone knows", "no one denies", "obviously",
    "clearly", "undeniable", "the truth is", "wake up", "mainstream media won't tell you",
    "they don't want you to know", "real patriots", "traitor", "enemy of the people",
    "radical", "extremist agenda", "puppet", "regime", "so-called experts",
]

EMOTIONAL_WORDS = [
    "outrageous", "terrifying", "heartbreaking", "furious", "disgusting",
    "devastating", "explosive", "horrifying", "unbelievable", "tragic",
    "alarming", "chilling", "sickening", "enraged", "panic", "crisis",
]

BIAS_MARKERS = [
    "radical left", "radical right", "fake news", "deep state", "woke",
    "globalist", "elites", "sheeple", "libtard", "conservatard",
    "mainstream narrative", "cover-up", "agenda",
]

HEDGE_WORDS = [
    "according to", "reportedly", "sources say", "study finds", "data suggests",
    "researchers found", "evidence indicates",
]

# --- Political-lean lexicons (rough heuristic only — not a claim of accuracy) ---
LEFT_LEANING_TERMS = [
    "corporate greed", "billionaires", "systemic racism", "climate crisis",
    "gun violence epidemic", "reproductive rights", "living wage", "big oil",
]
RIGHT_LEANING_TERMS = [
    "radical left", "big government", "illegal aliens", "cancel culture",
    "woke agenda", "defund the police", "socialist", "deep state",
]

# --- Propaganda-characteristics radar categories ---
FEAR_TERMS = ["terrifying", "crisis", "danger", "threat", "catastrophe", "panic", "alarming", "chilling"]
URGENCY_TERMS = ["now", "immediately", "urgent", "before it's too late", "act now", "breaking", "hurry"]
US_VS_THEM_TERMS = ["they don't want you to know", "mainstream media", "the elites", "real patriots",
                     "enemy of the people", "sheeple", "wake up"]
EVIDENCE_GAP_TERMS = ["sources say", "some say", "many believe", "it is said", "reportedly", "rumor has it"]
AUTHORITY_ATTACK_TERMS = ["so-called experts", "fake news", "corrupt officials", "biased scientists",
                           "puppet", "regime", "cover-up"]
# Repetition is measured structurally (repeated words), not via a lexicon.


def _find_matches(text: str, terms: list[str]) -> list[tuple[int, int, str]]:
    matches = []
    lower = text.lower()
    for term in terms:
        for m in re.finditer(re.escape(term), lower):
            matches.append((m.start(), m.end(), term))
    return matches


def _score_from_hits(hit_count: float, word_count: int, weight: float = 900.0) -> float:
    """Convert raw hit density into a 0-100 'concern' score."""
    if word_count == 0:
        return 0.0
    density = hit_count / word_count
    score = min(100.0, density * weight)
    return round(score, 1)


def _repetition_score(text: str) -> float:
    """Heuristic: how often the same content word repeats — a common
    propaganda technique ('repetition as truth')."""
    words = [w.lower() for w in re.findall(r"[a-zA-Z']{4,}", text)]
    if len(words) < 6:
        return 0.0
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    repeats = sum(c - 1 for c in counts.values() if c > 1)
    return round(min(100.0, (repeats / len(words)) * 300), 1)


def _extract_claims(text: str, flagged_spans: list[tuple[int, int]]) -> list[str]:
    """Pick the most claim-like sentences — prioritizing ones that contain
    a flagged phrase, since those are the sentences most worth verifying."""
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    sentences = [s.strip() for s in sentences if len(s.strip()) > 12]
    if not sentences:
        return []

    scored = []
    cursor = 0
    for s in sentences:
        start = text.find(s, cursor)
        end = start + len(s) if start != -1 else cursor + len(s)
        cursor = max(cursor, end)
        overlaps = sum(1 for fs, fe in flagged_spans if fs < end and fe > start)
        scored.append((overlaps, s))

    scored.sort(key=lambda x: x[0], reverse=True)
    top = [s for overlaps, s in scored if overlaps > 0][:3]
    if not top:
        top = sentences[:2]
    return top


def _sentiment_arc(text: str) -> dict:
    """Splits text into thirds and measures emotional-language intensity
    in each — approximates how a piece 'ramps up' emotionally."""
    words = text.split()
    if not words:
        return {"opening": 20, "middle": 20, "close": 20}

    third = max(1, len(words) // 3)
    parts = [words[:third], words[third:third * 2], words[third * 2:]]
    scores = []
    for part in parts:
        part_text = " ".join(part)
        hits = len(_find_matches(part_text, EMOTIONAL_WORDS)) + len(_find_matches(part_text, FEAR_TERMS))
        scores.append(_score_from_hits(hits, max(len(part), 1), weight=1200))

    return {"opening": scores[0], "middle": scores[1], "close": scores[2]}


def analyze(input_type: str, raw_input: str) -> dict:
    """
    Analyze text (or a URL's visible text, once fetched) and return a
    fully-formed result dict matching AnalyzeResponse.
    """
    text = raw_input.strip()
    word_count = max(len(text.split()), 1)

    clickbait_hits = []
    for pattern in CLICKBAIT_PATTERNS:
        clickbait_hits += [(m.start(), m.end(), pattern) for m in re.finditer(pattern, text, re.IGNORECASE)]

    propaganda_hits = _find_matches(text, PROPAGANDA_TERMS)
    emotional_hits = _find_matches(text, EMOTIONAL_WORDS)
    bias_hits = _find_matches(text, BIAS_MARKERS)
    hedge_hits = _find_matches(text, HEDGE_WORDS)
    left_hits = _find_matches(text, LEFT_LEANING_TERMS)
    right_hits = _find_matches(text, RIGHT_LEANING_TERMS)

    caps_words = re.findall(r"\b[A-Z]{4,}\b", text)
    exclamations = text.count("!")

    clickbait_score = _score_from_hits(len(clickbait_hits) + len(caps_words) * 0.5, word_count, weight=1400)
    propaganda_score = _score_from_hits(len(propaganda_hits), word_count, weight=1600)
    emotional_score = _score_from_hits(len(emotional_hits) + exclamations * 0.7, word_count, weight=1300)
    bias_score = _score_from_hits(len(bias_hits), word_count, weight=2000)

    # Political bias: position on a -100 (left) .. +100 (right) spectrum,
    # plus an overall "how ideologically loaded" strength score.
    lean_position = 0.0
    if left_hits or right_hits:
        lean_position = ((len(right_hits) - len(left_hits)) / max(len(left_hits) + len(right_hits), 1)) * 100
    political_bias_strength = _score_from_hits(len(left_hits) + len(right_hits), word_count, weight=1800)

    # Credibility is inversely related to the concern signals, with a
    # small boost for hedging/sourcing language which correlates with
    # more careful, attributable writing.
    concern_avg = statistics.mean([clickbait_score, propaganda_score, emotional_score, bias_score])
    hedge_bonus = min(15.0, len(hedge_hits) * 4.0)
    credibility = max(0.0, min(100.0, 100 - concern_avg * 0.85 + hedge_bonus))
    credibility = round(credibility, 1)

    confidence = round(min(96.0, 55 + min(word_count, 300) / 300 * 35 + len(hedge_hits) * 2), 1)

    # Propaganda-characteristics radar
    propaganda_characteristics = {
        "fear": _score_from_hits(len(_find_matches(text, FEAR_TERMS)), word_count, weight=1400),
        "urgency": _score_from_hits(len(_find_matches(text, URGENCY_TERMS)), word_count, weight=1400),
        "us_vs_them": _score_from_hits(len(_find_matches(text, US_VS_THEM_TERMS)), word_count, weight=1600),
        "evidence_gap": _score_from_hits(len(_find_matches(text, EVIDENCE_GAP_TERMS)), word_count, weight=1400),
        "authority_attack": _score_from_hits(len(_find_matches(text, AUTHORITY_ATTACK_TERMS)), word_count, weight=1600),
        "repetition": _repetition_score(text),
    }

    shareability_risk = round(
        min(100.0, clickbait_score * 0.35 + propaganda_score * 0.3 + emotional_score * 0.35), 1
    )

    explanations = []
    if clickbait_score > 30:
        explanations.append(
            f"Detected {len(clickbait_hits)} clickbait-style phrase(s) or headline patterns designed to provoke curiosity over information."
        )
    if propaganda_score > 30:
        explanations.append(
            f"Found {len(propaganda_hits)} instance(s) of absolutist or loaded language often used in persuasive/propagandistic framing."
        )
    if emotional_score > 30:
        explanations.append(
            f"Identified {len(emotional_hits)} emotionally charged word(s) and {exclamations} exclamation mark(s) that push a reaction rather than reflection."
        )
    if bias_score > 20:
        explanations.append(
            f"Contains {len(bias_hits)} politically polarizing term(s) associated with one-sided framing."
        )
    if hedge_hits:
        explanations.append(
            f"Uses {len(hedge_hits)} attribution/sourcing phrase(s) (e.g. 'according to', 'study finds'), which typically signals more careful reporting."
        )
    if not explanations:
        explanations.append(
            "No strong credibility-risk signals were detected in this text — that alone doesn't guarantee accuracy, but the language itself doesn't show common manipulation patterns."
        )

    if credibility >= 70:
        summary = "This content shows few signals typically associated with manipulation or misinformation. Language is comparatively measured."
    elif credibility >= 40:
        summary = "This content mixes some neutral language with signals worth a second look — check the flagged phrases below before sharing."
    else:
        summary = "This content shows multiple strong signals associated with manipulation, bias, or clickbait framing. Treat claims here with extra scrutiny."

    verification_guidance = [
        "Look for primary sources, named experts, and original documents.",
        "Compare the claim with multiple reputable outlets before sharing.",
        "Separate factual claims from emotional framing and opinion language.",
    ]

    # Build highlight flags with a "phrase type" + explanation + tip, so the
    # frontend can render a "Phrase Intelligence" breakdown per flag.
    def phrase_meta(kind: str):
        return {
            "clickbait": ("Sensational hook", "Creates curiosity or surprise before presenting verifiable evidence.",
                          "Search for the same claim in outlets that cite primary documents."),
            "propaganda": ("Loaded language", "Uses absolutist or emotionally loaded wording to shut down scrutiny.",
                           "Ask what evidence supports the claim, independent of the framing."),
            "emotional": ("Emotional trigger", "Designed to provoke a fast reaction rather than reflection.",
                          "Pause before reacting or sharing — check the underlying facts first."),
            "bias": ("Polarizing term", "Signals one-sided framing aimed at a specific political audience.",
                    "Read coverage from outlets across the spectrum before forming a view."),
            "hedge": ("Sourcing language", "Attributes the claim to a source, which is a good transparency sign.",
                     "Check whether the cited source is named and verifiable."),
        }[kind]

    flags = []
    flagged_spans = []
    for start, end, _ in clickbait_hits:
        label, desc, tip = phrase_meta("clickbait")
        flags.append({"start": start, "end": end, "reason": "Clickbait-style phrasing", "tone": "warning",
                       "label": label, "description": desc, "tip": tip})
        flagged_spans.append((start, end))
    for start, end, _ in propaganda_hits:
        label, desc, tip = phrase_meta("propaganda")
        flags.append({"start": start, "end": end, "reason": "Loaded/absolutist language", "tone": "danger",
                       "label": label, "description": desc, "tip": tip})
        flagged_spans.append((start, end))
    for start, end, _ in emotional_hits:
        label, desc, tip = phrase_meta("emotional")
        flags.append({"start": start, "end": end, "reason": "Emotionally charged word", "tone": "warning",
                       "label": label, "description": desc, "tip": tip})
        flagged_spans.append((start, end))
    for start, end, _ in bias_hits:
        label, desc, tip = phrase_meta("bias")
        flags.append({"start": start, "end": end, "reason": "Polarizing term", "tone": "danger",
                       "label": label, "description": desc, "tip": tip})
        flagged_spans.append((start, end))
    for start, end, _ in hedge_hits:
        label, desc, tip = phrase_meta("hedge")
        flags.append({"start": start, "end": end, "reason": "Sourcing/attribution language", "tone": "primary",
                       "label": label, "description": desc, "tip": tip})
        flagged_spans.append((start, end))

    title = (text[:70] + "…") if len(text) > 70 else text
    if input_type == "url":
        title = raw_input

    return {
        "id": str(uuid.uuid4()),
        "title": title,
        "input_type": input_type,
        "credibility": credibility,
        "confidence": confidence,
        "summary": summary,
        "signals": {
            "bias": bias_score,
            "propaganda": propaganda_score,
            "clickbait": clickbait_score,
            "emotional_manipulation": emotional_score,
            "political_bias": political_bias_strength,
        },
        "political_lean": round(lean_position, 1),
        "propaganda_characteristics": propaganda_characteristics,
        "sentiment_arc": _sentiment_arc(text),
        "shareability_risk": shareability_risk,
        "extracted_claims": _extract_claims(text, flagged_spans),
        "verification_guidance": verification_guidance,
        "explanations": explanations,
        "highlighted_text": text,
        "flags": flags,
        "created_at": datetime.now(timezone.utc),
    }
