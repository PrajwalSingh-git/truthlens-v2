"""
Simple in-memory sliding-window rate limiter, scoped per client IP.

This is intentionally lightweight (no Redis dependency) since it's meant
for a single-instance Render free-tier deployment. If you scale to
multiple instances, swap this for a shared store (Redis) — in-memory
state won't be consistent across instances otherwise.
"""
import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request, status

_WINDOW_SECONDS = 3600  # 1 hour
_MAX_REQUESTS = 30      # per IP per window

_hits: dict[str, deque] = defaultdict(deque)


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def rate_limit(request: Request) -> None:
    ip = _client_ip(request)
    now = time.time()
    window = _hits[ip]

    while window and now - window[0] > _WINDOW_SECONDS:
        window.popleft()

    if len(window) >= _MAX_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit reached ({_MAX_REQUESTS} analyses/hour). Please try again later.",
        )

    window.append(now)
