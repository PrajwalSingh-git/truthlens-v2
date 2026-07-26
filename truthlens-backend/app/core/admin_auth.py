"""
Admin panel authentication.

This is deliberately NOT tied to Supabase user accounts — the admin
panel is a single shared password (set via ADMIN_PASSWORD_HASH), and
issues its own JWTs signed with a separate ADMIN_JWT_SECRET. This keeps
"can view the admin panel" completely decoupled from "is a registered
TruthLens user."

Two token types are issued from here:
  - "admin"         — full admin panel access (login, stats, user list, delete)
  - "impersonation" — short-lived, scoped to a single user_id, lets the
                       admin view the normal app (history/reports/dashboard)
                       exactly as that user would see it, without ever
                       needing that user's real password or a real
                       Supabase session.
"""
import hashlib
import hmac
import time

import jwt
from fastapi import Header, HTTPException, status

from app.core.config import get_settings

ADMIN_TOKEN_TTL_SECONDS = 8 * 60 * 60       # 8 hours
IMPERSONATION_TOKEN_TTL_SECONDS = 30 * 60   # 30 minutes — deliberately short


def verify_admin_password(password: str) -> bool:
    settings = get_settings()
    if not settings.admin_password_hash:
        return False
    candidate_hash = hashlib.sha256(password.encode()).hexdigest()
    return hmac.compare_digest(candidate_hash, settings.admin_password_hash)


def create_admin_token() -> str:
    settings = get_settings()
    now = int(time.time())
    payload = {"type": "admin", "iat": now, "exp": now + ADMIN_TOKEN_TTL_SECONDS}
    return jwt.encode(payload, settings.admin_jwt_secret, algorithm="HS256")


def create_impersonation_token(user_id: str, email: str | None) -> str:
    settings = get_settings()
    now = int(time.time())
    payload = {
        "type": "impersonation",
        "sub": user_id,
        "email": email,
        "iat": now,
        "exp": now + IMPERSONATION_TOKEN_TTL_SECONDS,
    }
    return jwt.encode(payload, settings.admin_jwt_secret, algorithm="HS256")


def decode_admin_jwt(token: str) -> dict | None:
    """Returns the decoded payload for a valid admin-signed token (either
    "admin" or "impersonation" type), or None if invalid/expired/wrong
    secret. Never raises — callers decide what None means for them."""
    settings = get_settings()
    if not settings.admin_jwt_secret:
        return None
    try:
        return jwt.decode(token, settings.admin_jwt_secret, algorithms=["HS256"])
    except jwt.PyJWTError:
        return None


async def get_current_admin(authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin login required.")

    token = authorization.split(" ", 1)[1]
    payload = decode_admin_jwt(token)

    if not payload or payload.get("type") != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired admin session.")

    return payload
