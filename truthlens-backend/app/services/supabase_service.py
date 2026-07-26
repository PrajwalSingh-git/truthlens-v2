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
    try:
        _increment_search_counts(client, user_id)
    except Exception:
        # Stats tracking is best-effort — never let it break a real save.
        pass
    return row


def _increment_search_counts(client: Client, user_id: str) -> None:
    """Admin panel stats: incremented here directly (not derived from a
    COUNT(*) query later) — one row per user, plus a global total."""
    from datetime import datetime, timezone

    now = datetime.now(timezone.utc).isoformat()

    existing = (
        client.table("user_search_counts").select("search_count").eq("user_id", user_id).execute()
    )
    if existing.data:
        current = existing.data[0]["search_count"] or 0
        client.table("user_search_counts").update(
            {"search_count": current + 1, "last_search_at": now}
        ).eq("user_id", user_id).execute()
    else:
        client.table("user_search_counts").insert(
            {"user_id": user_id, "search_count": 1, "last_search_at": now}
        ).execute()

    stats = client.table("usage_stats").select("total_searches").eq("id", 1).execute()
    current_total = stats.data[0]["total_searches"] if stats.data else 0
    client.table("usage_stats").update(
        {"total_searches": current_total + 1, "updated_at": now}
    ).eq("id", 1).execute()


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


def join_waitlist(email: str) -> dict:
    """Insert an email into the waitlist. Uses upsert semantics (on the
    unique email constraint) so re-submitting the same email is a no-op
    rather than an error."""
    import uuid
    from datetime import datetime, timezone

    client = get_supabase()
    row = {
        "id": str(uuid.uuid4()),
        "email": email.lower().strip(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    client.table("waitlist_signups").upsert(row, on_conflict="email").execute()
    return {"email": row["email"]}


def delete_account(user_id: str) -> dict:
    """Soft-deletes a user: archives their profile info + activity totals
    into deleted_users, then permanently deletes the actual auth user
    (which cascades to profiles/analyses/saved_reports via FK constraints).
    """
    client = get_supabase()

    # Gather what we can before deleting anything.
    try:
        auth_user = client.auth.admin.get_user_by_id(user_id)
        email = auth_user.user.email if auth_user and auth_user.user else None
        created_at = auth_user.user.created_at if auth_user and auth_user.user else None
    except Exception:
        email, created_at = None, None

    profile_res = client.table("profiles").select("full_name").eq("id", user_id).execute()
    full_name = profile_res.data[0]["full_name"] if profile_res.data else None

    analyses_res = client.table("analyses").select("id", count="exact").eq("user_id", user_id).execute()
    total_analyses = analyses_res.count or 0

    reports_res = client.table("saved_reports").select("id", count="exact").eq("user_id", user_id).execute()
    total_reports = reports_res.count or 0

    archive_row = {
        "original_user_id": user_id,
        "email": email,
        "full_name": full_name,
        "total_analyses": total_analyses,
        "total_reports": total_reports,
        "account_created_at": created_at,
    }
    client.table("deleted_users").insert(archive_row).execute()

    # Deleting the auth user cascades to profiles/analyses/saved_reports
    # (all reference auth.users with ON DELETE CASCADE).
    client.auth.admin.delete_user(user_id)

    return {"deleted": True}


def get_admin_stats() -> dict:
    """Reads the stored aggregate counters directly — NOT computed via
    COUNT(*) queries against the live tables, per design."""
    client = get_supabase()
    res = client.table("usage_stats").select("*").eq("id", 1).execute()
    if not res.data:
        return {"total_users": 0, "total_searches": 0}
    row = res.data[0]
    return {"total_users": row.get("total_users", 0), "total_searches": row.get("total_searches", 0)}


def list_all_users() -> list[dict]:
    """Combines Supabase auth users (for email/created_at) with the
    stored per-user search counts and profile names."""
    client = get_supabase()

    auth_users_res = client.auth.admin.list_users()
    profiles_res = client.table("profiles").select("id, full_name").execute()
    counts_res = client.table("user_search_counts").select("user_id, search_count, last_search_at").execute()

    profiles_by_id = {p["id"]: p for p in (profiles_res.data or [])}
    counts_by_id = {c["user_id"]: c for c in (counts_res.data or [])}

    users = []
    for u in auth_users_res:
        profile = profiles_by_id.get(u.id, {})
        counts = counts_by_id.get(u.id, {})
        users.append({
            "id": u.id,
            "email": u.email,
            "full_name": profile.get("full_name"),
            "created_at": u.created_at.isoformat() if hasattr(u.created_at, "isoformat") else str(u.created_at),
            "search_count": counts.get("search_count", 0),
            "last_search_at": counts.get("last_search_at"),
        })

    users.sort(key=lambda u: u["created_at"], reverse=True)
    return users
