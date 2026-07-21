"""
Fetches a URL and extracts the main article text, so URL analysis works
on actual article content instead of just the URL string.
"""
import httpx
import trafilatura


def extract_article_text(url: str, timeout: float = 10.0) -> str:
    """
    Returns extracted article text, or raises ValueError with a
    user-facing message if the page couldn't be fetched or no readable
    article content was found.
    """
    try:
        resp = httpx.get(
            url,
            timeout=timeout,
            follow_redirects=True,
            headers={"User-Agent": "Mozilla/5.0 (compatible; TruthLensBot/1.0)"},
        )
        resp.raise_for_status()
    except httpx.HTTPError as e:
        raise ValueError(f"Couldn't fetch that URL: {e}")

    extracted = trafilatura.extract(
        resp.text,
        include_comments=False,
        include_tables=False,
        favor_precision=True,
    )

    if not extracted or len(extracted.strip()) < 40:
        raise ValueError(
            "Couldn't extract readable article text from that page — it may be "
            "paywalled, JavaScript-rendered, or not an article page."
        )

    return extracted.strip()
