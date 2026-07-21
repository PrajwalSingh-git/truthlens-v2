"""
Thin wrapper around the Supabase Python client for the three tables
defined in the PRD: profiles, analyses, saved_reports.

Uses the service role key (server-side only) so RLS can stay strict for
the anon/frontend key while the backend still has full access, scoped
manually to the requesting user's id in every query below.
"""
from supabase import create_client, Client

from app.core.config import get_settings

_client: Client | None = None


def _json_safe(value: dict) -> dict:
    """Recursively converts datetime objects (and anything else non-JSON-
    native) to strings, so the whole result dict can be embedded as a
    JSONB column. Without this, `analysis_json: result` still carries a
    raw Python datetime nested inside it (result["created_at"]) even
    though the top-level "created_at" column is separately isoformat()'d
    — that nested datetime is what breaks httpx's JSON encoder."""
    import json
    return json.loads(json.dumps(value, default=str))


def get_supabase() -> Client:
    global _client
    if _client is None:
        settings = get_settings()
        if not settings.supabase_url or not settings.supabase_service_role_key:
            raise RuntimeError(
                "Supabase is not configured. Set SUPABASE_URL and "
                "SUPABASE_SERVICE_ROLE_KEY in your backend .env file."
            )
        _client = create_client(settings.supabase_url, settings.supabase_service_role_key)
    return _client


def save_analysis(user_id: str, result: dict) -> dict:
    client = get_supabase()
    row = {
        "id": result["id"],
        "user_id": user_id,
        "input_type": result["input_type"],
        "input": result["highlighted_text"],
        "credibility": result["credibility"],
        "confidence": result["confidence"],
        "analysis_json": _json_safe(result),
        "created_at": result["created_at"].isoformat(),
    }
    client.table("analyses").insert(row).execute()
    return row


def list_history(user_id: str) -> list[dict]:
    client = get_supabase()
    res = (
        client.table("analyses")
        .select("id, input, credibility, created_at, analysis_json")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    items = []
    for row in res.data:
        title = row.get("analysis_json", {}).get("title") if row.get("analysis_json") else row["input"][:70]
        items.append({
            "id": row["id"],
            "title": title,
            "input": row["input"],
            "credibility": row["credibility"],
            "created_at": row["created_at"],
        })
    return items


def get_analysis(user_id: str, analysis_id: str) -> dict | None:
    client = get_supabase()
    res = (
        client.table("analyses")
        .select("analysis_json")
        .eq("user_id", user_id)
        .eq("id", analysis_id)
        .single()
        .execute()
    )
    return res.data["analysis_json"] if res.data else None


def delete_analysis(user_id: str, analysis_id: str) -> None:
    client = get_supabase()
    client.table("analyses").delete().eq("user_id", user_id).eq("id", analysis_id).execute()


def save_report(user_id: str, analysis_id: str, title: str) -> dict:
    import uuid
    from datetime import datetime, timezone

    client = get_supabase()
    row = {
        "id": str(uuid.uuid4()),
        "analysis_id": analysis_id,
        "user_id": user_id,
        "title": title,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    client.table("saved_reports").insert(row).execute()
    return row


def list_reports(user_id: str) -> list[dict]:
    client = get_supabase()
    res = (
        client.table("saved_reports")
        .select("id, analysis_id, title, created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return res.data
