"""
Simple in-memory cache for analysis results, keyed by a hash of the
input text. Re-analyzing the exact same text (a common thing to happen
in demos — the sample chips, "Load Demo", or someone just re-running
the same paste) skips the whole pipeline on a cache hit — including an
LLM call, if one is configured, which is the expensive part.

Like rate_limit.py, this is intentionally in-memory and per-instance —
fine for a single Render dyno, not consistent across multiple instances.
Swap for Redis if you ever scale horizontally.

Only the *analysis* itself is cached — id/title/created_at are always
freshly generated on every request, so cached and uncached results are
indistinguishable to the caller, and each hit still gets its own real
history entry when saved.
"""
import hashlib
import time
import uuid
from collections import OrderedDict
from datetime import datetime, timezone

_MAX_ENTRIES = 200
_TTL_SECONDS = 3600  # 1 hour — long enough to help repeated demo clicks,
                      # short enough that engine/prompt tweaks don't get
                      # stuck behind stale cached results for too long.

_cache: OrderedDict[str, tuple[float, dict]] = OrderedDict()


def _cache_key(input_type: str, text: str) -> str:
    normalized = text.strip().lower()
    return hashlib.sha256(f"{input_type}:{normalized}".encode()).hexdigest()


def get_cached(input_type: str, text: str) -> dict | None:
    key = _cache_key(input_type, text)
    entry = _cache.get(key)
    if entry is None:
        return None

    cached_at, result = entry
    if time.time() - cached_at > _TTL_SECONDS:
        del _cache[key]
        return None

    _cache.move_to_end(key)  # LRU touch

    # Fresh id/created_at on every hit — this is a cache of the *analysis*,
    # not of the "response to a specific request."
    fresh = dict(result)
    fresh["id"] = str(uuid.uuid4())
    fresh["created_at"] = datetime.now(timezone.utc)
    return fresh


def set_cached(input_type: str, text: str, result: dict) -> None:
    key = _cache_key(input_type, text)
    _cache[key] = (time.time(), result)
    _cache.move_to_end(key)
    while len(_cache) > _MAX_ENTRIES:
        _cache.popitem(last=False)  # evict oldest
