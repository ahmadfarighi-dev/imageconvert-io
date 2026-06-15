import json
from pathlib import Path


def load_seeds(path: str) -> list[str]:
    """Load seeds.json and return a flat, deduped, lowercased list of keywords."""
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    seen: dict[str, None] = {}
    for category in data.values():
        for kw in category:
            norm = kw.lower().strip()
            if norm:
                seen.setdefault(norm, None)
    return list(seen.keys())
