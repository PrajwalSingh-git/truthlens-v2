"""
Simple in-memory sliding-window rate limiter, scoped per client IP.

This is intentionally lightweight (no Redis dependency) since it's meant
for a single-instance Render free-tier deployment. If you scale to
multiple instances, swap this for a shared store (Redis) — in-memory
state won't be consistent across instances otherwise.

Different routes get different, independently-tracked budgets via
make_rate_limiter() — a shared bucket across every route would mean an
admin-login brute-force attempt gets the same generous allowance as
"how many times can I analyze text," which is far too permissive for a
password-guessing endpoint protecting a single shared secret.
"""
import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request, status


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def make_rate_limiter(*, max_requests: int, window_seconds: int, message: str, bucket_name: str):
    """Returns a FastAPI dependency enforcing its own independent budget,
    keyed by (bucket_name, client_ip) so different routes never share
    each other's allowance."""
    hits: dict[str, deque] = defaultdict(deque)

    async def limiter(request: Request) -> None:
        key = f"{bucket_name}:{_client_ip(request)}"
        now = time.time()
        window = hits[key]

        while window and now - window[0] > window_seconds:
            window.popleft()

        if len(window) >= max_requests:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=message)

        window.append(now)

    return limiter


# General API usage (analyze, waitlist) — generous, meant to stop abuse,
# not to slow down normal use.
rate_limit = make_rate_limiter(
    max_requests=30,
    window_seconds=3600,
    message="Rate limit reached (30 requests/hour). Please try again later.",
    bucket_name="general",
)

# Admin login — deliberately tight. This protects a single shared
# password, so "how many guesses can an attacker make" matters a lot
# more here than API-abuse prevention does elsewhere.
admin_login_rate_limit = make_rate_limiter(
    max_requests=5,
    window_seconds=900,  # 15 minutes
    message="Too many login attempts. Please wait 15 minutes before trying again.",
    bucket_name="admin_login",
)
