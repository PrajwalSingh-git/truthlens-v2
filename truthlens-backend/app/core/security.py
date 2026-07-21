"""
Verifies Supabase-issued JWTs sent by the frontend as a Bearer token.

Supabase has two ways of signing tokens, depending on when your project
was created / your JWT settings:

  1. Modern projects (JWT Signing Keys enabled, the current default for
     new projects): tokens are signed asymmetrically (ES256/RS256), and
     Supabase publishes the public keys at a JWKS endpoint. No shared
     secret is needed to verify these — we fetch and cache the public
     key automatically.
  2. Legacy projects (or "Legacy JWT Secret" explicitly enabled in
     Settings > API > JWT Settings): tokens are signed with a shared
     HS256 secret — SUPABASE_JWT_SECRET in your .env.

This module tries JWKS first (works out of the box for modern projects,
no config needed beyond SUPABASE_URL) and falls back to the static HS256
secret if JWKS verification isn't available or fails. If BOTH fail, the
actual underlying error is logged server-side (not sent to the client,
for security) so you can see exactly why in your terminal — e.g. "wrong
audience", "signature verification failed", "token expired", etc.

IMPORTANT: PyJWKClient's key fetch is a blocking (synchronous) HTTP call.
Every function that touches it is run via asyncio.to_thread() so it
never blocks the event loop — without that, a single JWT verification
would freeze the *entire server* (all requests, not just this one) for
the duration of the network round-trip to Supabase.
"""
import asyncio
import logging

from fastapi import Header, HTTPException, status
import jwt
from jwt import PyJWKClient

from app.core.config import get_settings

logger = logging.getLogger("truthlens.auth")

_jwks_client: PyJWKClient | None = None
_jwks_client_url: str | None = None


class CurrentUser:
    def __init__(self, user_id: str, email: str | None = None):
        self.user_id = user_id
        self.email = email


def _get_jwks_client(supabase_url: str) -> PyJWKClient:
    global _jwks_client, _jwks_client_url
    jwks_url = f"{supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json"
    if _jwks_client is None or _jwks_client_url != jwks_url:
        # A short timeout matters here: if Supabase's JWKS endpoint is
        # unreachable, we want to fail fast and fall back to the shared
        # secret rather than hang the request (and, since this runs in a
        # thread, hang a worker thread) for a long time.
        _jwks_client = PyJWKClient(jwks_url, cache_keys=True, timeout=5)
        _jwks_client_url = jwks_url
    return _jwks_client


def _decode_via_jwks_blocking(token: str, supabase_url: str) -> dict:
    """Blocking (sync) — must only ever be called via asyncio.to_thread."""
    if not supabase_url:
        raise RuntimeError("SUPABASE_URL not configured — can't fetch JWKS.")
    client = _get_jwks_client(supabase_url)
    signing_key = client.get_signing_key_from_jwt(token)
    return jwt.decode(
        token,
        signing_key.key,
        algorithms=["ES256", "RS256"],
        audience="authenticated",
        # A small leeway avoids spurious "not yet valid (iat)" / "expired"
        # failures caused by ordinary clock drift between this machine and
        # Supabase's servers — a few seconds of skew is normal and should
        # not fail verification.
        leeway=30,
    )


def _decode_via_shared_secret_blocking(token: str, secret: str) -> dict:
    """Not actually blocking on I/O, but kept sync + run via to_thread for
    consistency and so CPU-bound signature verification never contends
    with the event loop either."""
    if not secret:
        raise RuntimeError("SUPABASE_JWT_SECRET not configured.")
    return jwt.decode(token, secret, algorithms=["HS256"], audience="authenticated", leeway=30)


async def get_current_user(authorization: str | None = Header(default=None)) -> CurrentUser:
    settings = get_settings()

    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header.",
        )

    token = authorization.split(" ", 1)[1]

    payload = None
    errors = []

    try:
        payload = await asyncio.to_thread(_decode_via_jwks_blocking, token, settings.supabase_url)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired.")
    except Exception as e:
        errors.append(f"JWKS verification failed: {e}")

    if payload is None:
        try:
            payload = await asyncio.to_thread(
                _decode_via_shared_secret_blocking, token, settings.supabase_jwt_secret
            )
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired.")
        except Exception as e:
            errors.append(f"Shared-secret verification failed: {e}")

    if payload is None:
        # Log the real reasons server-side only — never expose internals
        # to the client, but this is exactly what you need in your
        # terminal to diagnose a misconfigured Supabase JWT setup.
        logger.warning(
            "JWT verification failed via both methods:\n  - %s\n  - %s\n"
            "Check: is SUPABASE_URL correct? Does your Supabase project use "
            "JWT Signing Keys (Settings > API > JWT Settings) — if so JWKS "
            "should just work. If it uses a Legacy JWT Secret instead, make "
            "sure SUPABASE_JWT_SECRET in your .env exactly matches the value "
            "shown there (no extra quotes/whitespace).",
            errors[0] if len(errors) > 0 else "n/a",
            errors[1] if len(errors) > 1 else "n/a",
        )
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session token.")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing subject.")

    return CurrentUser(user_id=user_id, email=payload.get("email"))


async def get_optional_user(authorization: str | None = Header(default=None)) -> CurrentUser | None:
    """Same as get_current_user, but returns None instead of raising —
    used on routes like /api/analyze that guests may call, but that
    behave differently (e.g. persist history) when a user is present."""
    if not authorization:
        return None
    try:
        return await get_current_user(authorization)
    except HTTPException:
        return None
