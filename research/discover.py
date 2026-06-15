import time
import requests

AUTOCOMPLETE_URL = "https://suggestqueries.google.com/complete/search"


def parse_autocomplete(raw: list) -> list[str]:
    """Google autocomplete returns [query, [suggestions], ...]. Return the suggestions."""
    if not isinstance(raw, list) or len(raw) < 2 or not isinstance(raw[1], list):
        return []
    return [s for s in raw[1] if isinstance(s, str) and s.strip()]


def fetch_autocomplete(query: str, timeout: float = 10.0) -> list[str]:
    """Fetch live autocomplete suggestions for one query (free, no key)."""
    resp = requests.get(
        AUTOCOMPLETE_URL,
        params={"client": "firefox", "q": query},
        timeout=timeout,
    )
    resp.raise_for_status()
    return parse_autocomplete(resp.json())


def merge_candidates(seeds: list[str], discovered) -> list[str]:
    """Combine seeds + discovered into a deduped, lowercased, trimmed list (order-stable)."""
    seen: dict[str, None] = {}
    for kw in list(seeds) + list(discovered):
        norm = kw.lower().strip()
        if norm:
            seen.setdefault(norm, None)
    return list(seen.keys())


def expand_seeds(seeds: list[str], sleep: float = 0.5) -> list[str]:
    """Expand every seed via autocomplete; polite delay between calls. Failures are skipped."""
    discovered: list[str] = []
    for seed in seeds:
        try:
            discovered.extend(fetch_autocomplete(seed))
        except requests.RequestException:
            pass  # discovery is best-effort; never block on a flaky suggestion call
        time.sleep(sleep)
    return merge_candidates(seeds, discovered)
