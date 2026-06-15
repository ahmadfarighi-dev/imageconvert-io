# Stage 0 Keyword Research Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an auditable Python pipeline that discovers image-tool keywords, pulls decision-grade data from DataForSEO (search volume, difficulty, SERP, and ranking-domain authority), and produces a transparent, human-reviewable decision table that says which 8–12 pages Plan 2 should build — or whether to pivot.

**Architecture:** Three stages with a strict firewall between *discovery* (free, Google Autocomplete) and *decision* (paid, DataForSEO). All judgment logic (parsing, the "beatable SERP" classifier, scoring, and the proceed-gate) is pure and unit-tested against committed fixture JSON; the network layer is thin and caches every response so re-runs never re-pay. The pipeline *recommends*; a human reviews the raw SERP/authority data before committing. Nothing here is decision-grade until DataForSEO data is present — the free pass only proposes candidates.

**Tech Stack:** Python 3.11+ · `requests` · `python-dotenv` · `pytest`. DataForSEO REST API (HTTP Basic auth). No `pytrends` (deliberately excluded: flaky scraper, relative-only data, not decision-grade).

**This is Plan 3 of 3.** Plan 1 (engine) is merged. Plan 2 (UI/pages) is unwritten. This plan's output (`research/keyword-research.md` + `research/results/decision-data.json`) feeds Plan 2's page list.

---

## CRITICAL: Honesty & care constraints (the whole point of this plan)

These are non-negotiable because real money and the launch decision ride on the output:

1. **Discovery ≠ decision.** Google Autocomplete finds candidate keywords but gives ZERO volume. The go/no-go uses only DataForSEO numbers + human SERP review. No verdict may be emitted from free data alone.
2. **Beatability > volume.** For a DR-0 domain, a high-volume keyword owned by giants (iLovePDF, calculator.net, TinyPNG, remove.bg) is worthless; a modest keyword where indie sites (domain authority < 40) rank is the prize. The classifier centers on this.
3. **No false precision.** The numeric `score` is a transparent, documented SORT key — never the verdict. Verdicts come from explicit, tunable thresholds, and the report always shows the RAW top-10 domains + authority so a human can override.
4. **Reproducible & auditable.** Every API response is cached (keyed by endpoint+payload hash). The consolidated `decision-data.json` is committed as the single audit artifact. Re-runs read cache and cost nothing.
5. **Verify response shapes against reality before the big paid run.** DataForSEO's nested JSON can differ subtly from docs. Task 8 includes a one-cheap-call-per-endpoint `--probe` step to confirm parsers match live data and update fixtures if needed, BEFORE spending the bulk budget.
6. **Cost staging.** Pull cheap batched volume+difficulty for ALL candidates first; pull expensive per-keyword SERP only for candidates above a volume floor; pull authority once for the unique domains. Budget target ~$15–25.

---

## File Structure

| File | Responsibility |
|---|---|
| `research/requirements.txt` | Python deps |
| `research/.env.example` | Documents required `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD` (real `.env` is gitignored) |
| `research/pytest.ini` | pytest config (testpaths) |
| `research/models.py` | Dataclasses: `KeywordMetrics`, `OrganicResult`, `SerpResult`, `ScoredKeyword`, `GateResult` |
| `research/data/seeds.json` | Curated seed keywords (image format-pairs + function/spec terms) |
| `research/seeds.py` | Load + validate seeds |
| `research/discover.py` | Google Autocomplete expansion (free); pure parse + thin fetch + dedupe |
| `research/client.py` | DataForSEO HTTP client: auth, POST, response caching, `--probe` |
| `research/parse.py` | Pure parsers: response JSON → models (volume, difficulty, SERP, ranks) |
| `research/score.py` | Pure: beatability classifier, scoring, verdict, proceed-gate |
| `research/report.py` | Build `keyword-research.md` + `results/decision-data.json` |
| `research/run.py` | Orchestrator CLI (staged phases, cost controls, flags) |
| `research/tests/` | pytest unit tests |
| `research/tests/fixtures/` | Committed sample API JSON for tests |
| `research/cache/` | Per-call HTTP cache (gitignored) |
| `research/results/decision-data.json` | Committed consolidated audit artifact |
| `research/keyword-research.md` | Committed final decision table + gate evaluation + human-review checklist |
| `research/README.md` | How to run, cost notes, methodology, caveats |

**Constants (defined once in `score.py`, referenced everywhere):**
- `INDIE_RANK_MAX = 40` — domain authority (0–100 scale) below which a ranking site is "beatable indie."
- `MIN_INDIE_FOR_BEATABLE = 2` — a SERP is "beatable" if ≥2 of the top-10 are indie.
- `VOLUME_FLOOR_BUILD = 500` — minimum US monthly volume to consider "build."
- `VOLUME_FLOOR_SERP = 200` — minimum volume to bother pulling a (paid) SERP.
- `DIFFICULTY_MAX_BUILD = 50` — keyword_difficulty at/above which we downgrade from "build."
- `GATE_MIN_BUILD_KEYWORDS = 8`, `GATE_MIN_TOTAL_VOLUME = 100_000`.

---

## Task 0: Python project setup

**Files:**
- Create: `research/requirements.txt`, `research/.env.example`, `research/pytest.ini`, `research/README.md`
- Modify: `.gitignore`

- [ ] **Step 1: Create `research/requirements.txt`**
```
requests==2.32.3
python-dotenv==1.0.1
pytest==8.3.3
```

- [ ] **Step 2: Create `research/.env.example`**
```
# Copy to research/.env and fill in. research/.env is gitignored — NEVER commit real credentials.
# Get these from https://app.dataforseo.com/api-access (the API login/password, NOT your dashboard password).
DATAFORSEO_LOGIN=your_login_email
DATAFORSEO_PASSWORD=your_api_password
```

- [ ] **Step 3: Create `research/pytest.ini`**
```ini
[pytest]
testpaths = tests
python_files = test_*.py
```

- [ ] **Step 4: Append to `.gitignore`** (add these lines):
```
# Research pipeline
/research/cache/
/research/.venv/
research/.env
```

- [ ] **Step 5: Create `research/README.md`** with this content:
```markdown
# Stage 0 Keyword Research Pipeline

Decides which image-tool pages to build, using DataForSEO decision-grade data.

## Setup
```
cd research
python -m venv .venv
. .venv/Scripts/activate    # Windows; use .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env        # then edit .env with your DataForSEO API login/password
```

## Run
```
python run.py discover                # free: expand seeds via Google Autocomplete
python run.py probe                   # ~$0.02: one live call per endpoint to verify parsers
python run.py pull --max-serps 250    # paid: volume+difficulty (all) then SERP+authority (survivors)
python run.py report                  # writes keyword-research.md + results/decision-data.json
```

## What the output means
See `keyword-research.md`. The numeric score is a SORT KEY, not a verdict. Verdicts use explicit
thresholds (see `score.py` constants). ALWAYS eyeball the raw top-10 domains before committing.

## Caveats
Third-party volume estimates are order-of-magnitude. Beatability (ranking-domain authority) matters
more than raw volume for a new domain. Re-runs read `cache/` and cost nothing.
```

- [ ] **Step 6: Verify pytest runs (no tests yet)**

Run:
```bash
cd research && python -m venv .venv && . .venv/Scripts/activate && pip install -r requirements.txt && python -m pytest
```
Expected: pytest collects 0 items and exits (exit code 5 "no tests ran" is fine — confirms install + config work). On macOS/Linux use `. .venv/bin/activate`.

- [ ] **Step 7: Commit**
```bash
git add research/requirements.txt research/.env.example research/pytest.ini research/README.md .gitignore
git commit -m "chore(research): scaffold Stage 0 keyword research pipeline"
```

---

## Task 1: Data models

**Files:**
- Create: `research/models.py`

- [ ] **Step 1: Create `research/models.py`**
```python
from __future__ import annotations
from dataclasses import dataclass, field


@dataclass
class KeywordMetrics:
    keyword: str
    search_volume: int | None
    competition_index: int | None
    cpc: float | None
    keyword_difficulty: int | None = None


@dataclass
class OrganicResult:
    rank: int
    domain: str
    url: str


@dataclass
class SerpResult:
    keyword: str
    organic: list[OrganicResult]


@dataclass
class ScoredKeyword:
    keyword: str
    search_volume: int
    keyword_difficulty: int | None
    top_domains: list[str]
    indie_domains: list[str]
    min_rank_top10: int | None
    beatable: bool
    score: float
    verdict: str  # "build" | "maybe" | "skip"


@dataclass
class GateResult:
    passed: bool
    build_keyword_count: int
    total_build_volume: int
    reasons: list[str] = field(default_factory=list)
```

- [ ] **Step 2: Verify it imports**

Run: `cd research && . .venv/Scripts/activate && python -c "import models; print('ok')"`
Expected: prints `ok`.

- [ ] **Step 3: Commit**
```bash
git add research/models.py
git commit -m "feat(research): add data models"
```

---

## Task 2: Seed keyword list + loader

**Files:**
- Create: `research/data/seeds.json`, `research/seeds.py`
- Test: `research/tests/test_seeds.py`

- [ ] **Step 1: Create `research/data/seeds.json`** (curated; these are SEEDS, autocomplete expands them)
```json
{
  "format_pairs": [
    "heic to jpg", "heic to png", "webp to png", "webp to jpg", "png to jpg",
    "jpg to png", "avif to jpg", "avif to png", "png to webp", "jpg to webp",
    "svg to png", "png to svg", "bmp to jpg", "tiff to jpg", "gif to png"
  ],
  "function": [
    "image compressor", "compress image", "compress jpeg", "compress png",
    "resize image", "image resizer", "reduce image size", "shrink image"
  ],
  "spec": [
    "compress image to 20kb", "compress image to 50kb", "compress image to 100kb",
    "compress image to 200kb", "resize image to 1920x1080", "compress jpeg to 100kb"
  ]
}
```

- [ ] **Step 2: Write the failing test** — Create `research/tests/test_seeds.py`
```python
import seeds


def test_load_seeds_returns_flat_deduped_lowercase_list():
    result = seeds.load_seeds("data/seeds.json")
    assert isinstance(result, list)
    assert "heic to jpg" in result
    assert "image compressor" in result
    assert "compress image to 20kb" in result
    # flattened across all categories, deduped, all lowercase, no empties
    assert len(result) == len(set(result))
    assert all(k == k.lower().strip() for k in result)
    assert all(k for k in result)


def test_load_seeds_missing_file_raises():
    import pytest
    with pytest.raises(FileNotFoundError):
        seeds.load_seeds("data/does_not_exist.json")
```

- [ ] **Step 3: Run to verify it fails**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_seeds.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'seeds'`.

- [ ] **Step 4: Create `research/seeds.py`**
```python
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
```

- [ ] **Step 5: Run to verify it passes**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_seeds.py -v`
Expected: PASS (2 tests). (pytest runs from `research/` so `import seeds` and the relative `data/seeds.json` path resolve.)

- [ ] **Step 6: Commit**
```bash
git add research/data/seeds.json research/seeds.py research/tests/test_seeds.py
git commit -m "feat(research): curated seed keywords + loader"
```

---

## Task 3: Google Autocomplete discovery (free)

**Files:**
- Create: `research/discover.py`
- Test: `research/tests/test_discover.py`, `research/tests/fixtures/autocomplete.json`

- [ ] **Step 1: Create the fixture** — `research/tests/fixtures/autocomplete.json`
(Google's autocomplete endpoint returns `[query, [suggestions...], ...]`.)
```json
["heic to jpg", ["heic to jpg", "heic to jpg converter", "heic to jpg windows", "heic to jpg mac"], [], {}]
```

- [ ] **Step 2: Write the failing test** — `research/tests/test_discover.py`
```python
import json
from pathlib import Path
import discover


def test_parse_autocomplete_extracts_suggestions():
    raw = json.loads(Path("tests/fixtures/autocomplete.json").read_text(encoding="utf-8"))
    out = discover.parse_autocomplete(raw)
    assert out == [
        "heic to jpg",
        "heic to jpg converter",
        "heic to jpg windows",
        "heic to jpg mac",
    ]


def test_parse_autocomplete_handles_empty():
    assert discover.parse_autocomplete(["x", [], [], {}]) == []
    assert discover.parse_autocomplete(["x"]) == []


def test_merge_candidates_dedupes_and_lowercases():
    seeds = ["heic to jpg", "webp to png"]
    discovered = {"HEIC to JPG converter", "heic to jpg", " webp to png "}
    out = discover.merge_candidates(seeds, discovered)
    assert "heic to jpg" in out
    assert "heic to jpg converter" in out
    assert "webp to png" in out
    assert len(out) == len(set(out))
    assert all(k == k.lower().strip() for k in out)
```

- [ ] **Step 3: Run to verify it fails**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_discover.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'discover'`.

- [ ] **Step 4: Create `research/discover.py`**
```python
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
```

- [ ] **Step 5: Run to verify it passes**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_discover.py -v`
Expected: PASS (3 tests). (`parse_autocomplete` and `merge_candidates` are pure; `fetch_autocomplete`/`expand_seeds` hit the network and are exercised later, not unit-tested.)

- [ ] **Step 6: Commit**
```bash
git add research/discover.py research/tests/test_discover.py research/tests/fixtures/autocomplete.json
git commit -m "feat(research): free Google Autocomplete keyword discovery"
```

---

## Task 4: DataForSEO client (auth + cached POST)

**Files:**
- Create: `research/client.py`
- Test: `research/tests/test_client.py`

- [ ] **Step 1: Write the failing test** — `research/tests/test_client.py`
(We test the pure pieces: auth header construction and cache-key hashing. The network call itself is not unit-tested.)
```python
import base64
import client


def test_auth_header_is_basic_base64():
    header = client.build_auth_header("user@example.com", "secret")
    assert header.startswith("Basic ")
    decoded = base64.b64decode(header.split(" ", 1)[1]).decode()
    assert decoded == "user@example.com:secret"


def test_cache_key_is_stable_and_payload_sensitive():
    k1 = client.cache_key("/v3/serp/google/organic/live/advanced", [{"keyword": "heic to jpg"}])
    k2 = client.cache_key("/v3/serp/google/organic/live/advanced", [{"keyword": "heic to jpg"}])
    k3 = client.cache_key("/v3/serp/google/organic/live/advanced", [{"keyword": "webp to png"}])
    assert k1 == k2          # deterministic
    assert k1 != k3          # different payload → different key
    assert k1.endswith(".json")
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_client.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'client'`.

- [ ] **Step 3: Create `research/client.py`**
```python
import base64
import hashlib
import json
import os
from pathlib import Path

import requests
from dotenv import load_dotenv

API_BASE = "https://api.dataforseo.com"
CACHE_DIR = Path("cache")


def build_auth_header(login: str, password: str) -> str:
    token = base64.b64encode(f"{login}:{password}".encode()).decode()
    return f"Basic {token}"


def cache_key(endpoint: str, payload) -> str:
    raw = endpoint + json.dumps(payload, sort_keys=True)
    return hashlib.sha256(raw.encode()).hexdigest() + ".json"


class DataForSeoClient:
    def __init__(self, login: str | None = None, password: str | None = None):
        load_dotenv()
        self.login = login or os.environ["DATAFORSEO_LOGIN"]
        self.password = password or os.environ["DATAFORSEO_PASSWORD"]
        self.headers = {
            "Authorization": build_auth_header(self.login, self.password),
            "Content-Type": "application/json",
        }
        CACHE_DIR.mkdir(exist_ok=True)

    def post(self, endpoint: str, payload, use_cache: bool = True) -> dict:
        """POST to DataForSEO. Caches responses to avoid re-paying. Raises on HTTP/API error."""
        cache_path = CACHE_DIR / cache_key(endpoint, payload)
        if use_cache and cache_path.exists():
            return json.loads(cache_path.read_text(encoding="utf-8"))

        resp = requests.post(API_BASE + endpoint, headers=self.headers,
                             data=json.dumps(payload), timeout=120)
        resp.raise_for_status()
        body = resp.json()
        if body.get("status_code") != 20000:
            raise RuntimeError(f"DataForSEO error {body.get('status_code')}: {body.get('status_message')}")
        cache_path.write_text(json.dumps(body), encoding="utf-8")
        return body
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_client.py -v`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**
```bash
git add research/client.py research/tests/test_client.py
git commit -m "feat(research): DataForSEO client with auth and response caching"
```

---

## Task 5: Parse volume + difficulty responses

**Files:**
- Create: `research/parse.py`
- Test: `research/tests/test_parse_metrics.py`, fixtures `research/tests/fixtures/search_volume.json`, `research/tests/fixtures/keyword_difficulty.json`

- [ ] **Step 1: Create fixture** `research/tests/fixtures/search_volume.json`
(Shape per docs: `tasks[].result[]` is a list of keyword dicts.)
```json
{
  "status_code": 20000,
  "tasks": [
    {
      "result": [
        {"keyword": "heic to jpg", "search_volume": 90500, "competition_index": 12, "cpc": 0.41},
        {"keyword": "webp to png", "search_volume": 60500, "competition_index": 8, "cpc": 0.33},
        {"keyword": "obscure term", "search_volume": null, "competition_index": null, "cpc": null}
      ]
    }
  ]
}
```

- [ ] **Step 2: Create fixture** `research/tests/fixtures/keyword_difficulty.json`
(Shape per docs: `tasks[].result[].items[]`.)
```json
{
  "status_code": 20000,
  "tasks": [
    {
      "result": [
        {
          "items": [
            {"keyword": "heic to jpg", "keyword_difficulty": 28},
            {"keyword": "webp to png", "keyword_difficulty": 19}
          ]
        }
      ]
    }
  ]
}
```

- [ ] **Step 3: Write the failing test** — `research/tests/test_parse_metrics.py`
```python
import json
from pathlib import Path
import parse


def _load(name):
    return json.loads(Path(f"tests/fixtures/{name}").read_text(encoding="utf-8"))


def test_parse_search_volume_maps_each_keyword():
    metrics = parse.parse_search_volume(_load("search_volume.json"))
    by_kw = {m.keyword: m for m in metrics}
    assert by_kw["heic to jpg"].search_volume == 90500
    assert by_kw["heic to jpg"].competition_index == 12
    assert by_kw["heic to jpg"].cpc == 0.41
    assert by_kw["obscure term"].search_volume is None


def test_parse_difficulty_returns_keyword_to_score_map():
    diff = parse.parse_keyword_difficulty(_load("keyword_difficulty.json"))
    assert diff == {"heic to jpg": 28, "webp to png": 19}


def test_parsers_tolerate_empty_tasks():
    assert parse.parse_search_volume({"tasks": []}) == []
    assert parse.parse_keyword_difficulty({"tasks": []}) == {}
```

- [ ] **Step 4: Run to verify it fails**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_parse_metrics.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'parse'`.

- [ ] **Step 5: Create `research/parse.py`**
```python
from models import KeywordMetrics, OrganicResult, SerpResult


def _results(body: dict) -> list:
    """Flatten tasks[].result[] defensively."""
    out = []
    for task in body.get("tasks") or []:
        for res in task.get("result") or []:
            out.append(res)
    return out


def parse_search_volume(body: dict) -> list[KeywordMetrics]:
    metrics = []
    for res in _results(body):
        metrics.append(KeywordMetrics(
            keyword=res.get("keyword", "").lower().strip(),
            search_volume=res.get("search_volume"),
            competition_index=res.get("competition_index"),
            cpc=res.get("cpc"),
        ))
    return metrics


def parse_keyword_difficulty(body: dict) -> dict[str, int]:
    out: dict[str, int] = {}
    for res in _results(body):
        for item in res.get("items") or []:
            kw = item.get("keyword", "").lower().strip()
            if kw and item.get("keyword_difficulty") is not None:
                out[kw] = item["keyword_difficulty"]
    return out
```

- [ ] **Step 6: Run to verify it passes**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_parse_metrics.py -v`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**
```bash
git add research/parse.py research/tests/test_parse_metrics.py research/tests/fixtures/search_volume.json research/tests/fixtures/keyword_difficulty.json
git commit -m "feat(research): parse DataForSEO volume and difficulty responses"
```

---

## Task 6: Parse SERP + domain-rank responses

**Files:**
- Modify: `research/parse.py`
- Test: `research/tests/test_parse_serp.py`, fixtures `research/tests/fixtures/serp.json`, `research/tests/fixtures/bulk_ranks.json`

- [ ] **Step 1: Create fixture** `research/tests/fixtures/serp.json`
```json
{
  "status_code": 20000,
  "tasks": [
    {
      "result": [
        {
          "keyword": "heic to jpg",
          "items": [
            {"type": "organic", "rank_group": 1, "domain": "cloudconvert.com", "url": "https://cloudconvert.com/heic-to-jpg"},
            {"type": "people_also_ask", "rank_group": 2},
            {"type": "organic", "rank_group": 2, "domain": "freeconvert.com", "url": "https://freeconvert.com/heic-to-jpg"},
            {"type": "organic", "rank_group": 3, "domain": "tinywow.com", "url": "https://tinywow.com/x"}
          ]
        }
      ]
    }
  ]
}
```

- [ ] **Step 2: Create fixture** `research/tests/fixtures/bulk_ranks.json`
```json
{
  "status_code": 20000,
  "tasks": [
    {
      "result": [
        {
          "items": [
            {"type": "ranks", "target": "cloudconvert.com", "rank": 71},
            {"type": "ranks", "target": "freeconvert.com", "rank": 33},
            {"type": "ranks", "target": "tinywow.com", "rank": 38}
          ]
        }
      ]
    }
  ]
}
```

- [ ] **Step 3: Write the failing test** — `research/tests/test_parse_serp.py`
```python
import json
from pathlib import Path
import parse


def _load(name):
    return json.loads(Path(f"tests/fixtures/{name}").read_text(encoding="utf-8"))


def test_parse_serp_keeps_only_organic_in_rank_order():
    serp = parse.parse_serp(_load("serp.json"))
    assert serp.keyword == "heic to jpg"
    assert [o.domain for o in serp.organic] == ["cloudconvert.com", "freeconvert.com", "tinywow.com"]
    assert serp.organic[0].rank == 1
    assert serp.organic[1].url == "https://freeconvert.com/heic-to-jpg"


def test_parse_bulk_ranks_returns_domain_to_rank_map():
    ranks = parse.parse_bulk_ranks(_load("bulk_ranks.json"))
    assert ranks == {"cloudconvert.com": 71, "freeconvert.com": 33, "tinywow.com": 38}


def test_parse_serp_empty_is_safe():
    s = parse.parse_serp({"tasks": []})
    assert s.keyword == ""
    assert s.organic == []
```

- [ ] **Step 4: Run to verify it fails**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_parse_serp.py -v`
Expected: FAIL — `AttributeError: module 'parse' has no attribute 'parse_serp'`.

- [ ] **Step 5: Append to `research/parse.py`**
```python
def parse_serp(body: dict) -> SerpResult:
    results = _results(body)
    if not results:
        return SerpResult(keyword="", organic=[])
    res = results[0]
    organic = []
    for item in res.get("items") or []:
        if item.get("type") == "organic" and item.get("domain"):
            organic.append(OrganicResult(
                rank=item.get("rank_group", 0),
                domain=item["domain"].lower(),
                url=item.get("url", ""),
            ))
    return SerpResult(keyword=res.get("keyword", "").lower().strip(), organic=organic)


def parse_bulk_ranks(body: dict) -> dict[str, int]:
    out: dict[str, int] = {}
    for res in _results(body):
        for item in res.get("items") or []:
            target = (item.get("target") or "").lower()
            if target and item.get("rank") is not None:
                out[target] = item["rank"]
    return out
```

- [ ] **Step 6: Run to verify it passes**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_parse_serp.py -v`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**
```bash
git add research/parse.py research/tests/test_parse_serp.py research/tests/fixtures/serp.json research/tests/fixtures/bulk_ranks.json
git commit -m "feat(research): parse DataForSEO SERP and domain-rank responses"
```

---

## Task 7: Beatability classifier, scoring, and proceed-gate (the decision core)

**Files:**
- Create: `research/score.py`
- Test: `research/tests/test_score.py`

- [ ] **Step 1: Write the failing test** — `research/tests/test_score.py`
```python
import math
import score
from models import KeywordMetrics, OrganicResult, SerpResult


def serp(*domains):
    return SerpResult(keyword="k", organic=[OrganicResult(rank=i + 1, domain=d, url="") for i, d in enumerate(domains)])


def test_beatable_when_at_least_two_indies_in_top10():
    ranks = {"a.com": 71, "b.com": 33, "c.com": 38}  # b and c are indie (<40)
    beatable, indies = score.classify_beatable(serp("a.com", "b.com", "c.com"), ranks)
    assert beatable is True
    assert set(indies) == {"b.com", "c.com"}


def test_not_beatable_when_giants_dominate():
    ranks = {"ilovepdf.com": 83, "tinypng.com": 78, "adobe.com": 96}
    beatable, indies = score.classify_beatable(serp("ilovepdf.com", "tinypng.com", "adobe.com"), ranks)
    assert beatable is False
    assert indies == []


def test_unknown_domain_rank_treated_as_not_indie():
    # Missing authority data must NOT be assumed beatable (careful default).
    beatable, indies = score.classify_beatable(serp("x.com", "y.com"), ranks={})
    assert beatable is False
    assert indies == []


def test_verdict_build_when_beatable_high_volume_low_difficulty():
    m = KeywordMetrics("heic to jpg", search_volume=90500, competition_index=10, cpc=0.4, keyword_difficulty=28)
    sk = score.score_keyword(m, serp("a.com", "b.com", "c.com"), {"a.com": 71, "b.com": 33, "c.com": 20})
    assert sk.verdict == "build"
    assert sk.beatable is True
    assert sk.score > 0


def test_verdict_skip_when_not_beatable():
    m = KeywordMetrics("pdf to word", search_volume=400000, competition_index=10, cpc=0.4, keyword_difficulty=70)
    sk = score.score_keyword(m, serp("ilovepdf.com", "adobe.com"), {"ilovepdf.com": 83, "adobe.com": 96})
    assert sk.verdict == "skip"


def test_verdict_skip_when_volume_below_floor():
    m = KeywordMetrics("super niche thing", search_volume=80, competition_index=1, cpc=0.1, keyword_difficulty=5)
    sk = score.score_keyword(m, serp("b.com", "c.com"), {"b.com": 10, "c.com": 12})
    assert sk.verdict == "skip"


def test_verdict_maybe_between_floors():
    m = KeywordMetrics("midling term", search_volume=300, competition_index=5, cpc=0.2, keyword_difficulty=45)
    sk = score.score_keyword(m, serp("b.com", "c.com"), {"b.com": 30, "c.com": 25})
    assert sk.verdict == "maybe"


def test_gate_passes_with_enough_build_keywords_and_volume():
    builds = [
        score.ScoredKeyword(f"kw{i}", 20000, 20, ["b.com"], ["b.com"], 20, True, 5.0, "build")
        for i in range(8)
    ]
    gate = score.evaluate_gate(builds)
    assert gate.passed is True
    assert gate.build_keyword_count == 8
    assert gate.total_build_volume == 160000


def test_gate_fails_with_too_few_build_keywords():
    builds = [
        score.ScoredKeyword(f"kw{i}", 50000, 20, ["b.com"], ["b.com"], 20, True, 5.0, "build")
        for i in range(3)
    ]
    gate = score.evaluate_gate(builds)
    assert gate.passed is False
    assert any("keyword" in r for r in gate.reasons)
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_score.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'score'`.

- [ ] **Step 3: Create `research/score.py`**
```python
import math
from models import KeywordMetrics, SerpResult, ScoredKeyword, GateResult

# --- Tunable thresholds (documented in README + report). Judgment calls; a human may override. ---
INDIE_RANK_MAX = 40            # domain authority (0-100) below which a ranking site is "beatable indie"
MIN_INDIE_FOR_BEATABLE = 2     # a SERP is beatable if >= this many top-10 results are indie
VOLUME_FLOOR_BUILD = 500       # min US monthly volume to consider "build"
VOLUME_FLOOR_SERP = 200        # min volume to bother pulling a (paid) SERP
DIFFICULTY_MAX_BUILD = 50      # difficulty at/above which we downgrade from "build"
GATE_MIN_BUILD_KEYWORDS = 8
GATE_MIN_TOTAL_VOLUME = 100_000


def classify_beatable(serp: SerpResult, ranks: dict[str, int]) -> tuple[bool, list[str]]:
    """A SERP is beatable if >= MIN_INDIE_FOR_BEATABLE of its top-10 organic domains have
    authority < INDIE_RANK_MAX. Domains with UNKNOWN authority are treated as NOT indie
    (careful default: never assume a SERP is beatable on missing data)."""
    indies = []
    for o in serp.organic[:10]:
        rank = ranks.get(o.domain)
        if rank is not None and rank < INDIE_RANK_MAX:
            indies.append(o.domain)
    return (len(indies) >= MIN_INDIE_FOR_BEATABLE, indies)


def _score_value(search_volume: int, difficulty: int | None, indie_count: int) -> float:
    """Transparent SORT key (NOT a verdict): rewards volume, beatable indies, and low difficulty."""
    volume_score = math.log10(search_volume + 1)         # ~0..6
    ease = max(0.05, 1 - (difficulty if difficulty is not None else 50) / 100)
    return round(volume_score * (indie_count + 1) * ease, 3)


def score_keyword(metrics: KeywordMetrics, serp: SerpResult, ranks: dict[str, int]) -> ScoredKeyword:
    beatable, indies = classify_beatable(serp, ranks)
    top_domains = [o.domain for o in serp.organic[:10]]
    known_ranks = [ranks[d] for d in top_domains if d in ranks]
    min_rank = min(known_ranks) if known_ranks else None
    volume = metrics.search_volume or 0
    diff = metrics.keyword_difficulty

    if not beatable or volume < VOLUME_FLOOR_BUILD:
        verdict = "skip"
    elif diff is not None and diff >= DIFFICULTY_MAX_BUILD:
        verdict = "maybe"
    else:
        verdict = "build"

    # A beatable, mid-volume, mid-difficulty term that just misses "build" is "maybe", not "skip".
    if verdict == "skip" and beatable and volume >= VOLUME_FLOOR_SERP and volume < VOLUME_FLOOR_BUILD:
        verdict = "maybe"

    return ScoredKeyword(
        keyword=metrics.keyword,
        search_volume=volume,
        keyword_difficulty=diff,
        top_domains=top_domains,
        indie_domains=indies,
        min_rank_top10=min_rank,
        beatable=beatable,
        score=_score_value(volume, diff, len(indies)),
        verdict=verdict,
    )


def evaluate_gate(scored: list[ScoredKeyword]) -> GateResult:
    builds = [s for s in scored if s.verdict == "build"]
    total = sum(s.search_volume for s in builds)
    reasons = []
    if len(builds) < GATE_MIN_BUILD_KEYWORDS:
        reasons.append(f"only {len(builds)} build keywords (need >= {GATE_MIN_BUILD_KEYWORDS})")
    if total < GATE_MIN_TOTAL_VOLUME:
        reasons.append(f"combined build volume {total} (need >= {GATE_MIN_TOTAL_VOLUME})")
    return GateResult(passed=not reasons, build_keyword_count=len(builds),
                     total_build_volume=total, reasons=reasons)
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_score.py -v`
Expected: PASS (9 tests).

- [ ] **Step 5: Commit**
```bash
git add research/score.py research/tests/test_score.py
git commit -m "feat(research): beatability classifier, scoring, and proceed-gate"
```

---

## Task 8: Report generator

**Files:**
- Create: `research/report.py`
- Test: `research/tests/test_report.py`

- [ ] **Step 1: Write the failing test** — `research/tests/test_report.py`
```python
import json
import report
from models import ScoredKeyword, GateResult


def sample():
    return [
        ScoredKeyword("heic to jpg", 90500, 28, ["cloudconvert.com", "freeconvert.com"],
                      ["freeconvert.com"], 33, True, 9.1, "build"),
        ScoredKeyword("pdf to word", 400000, 70, ["ilovepdf.com"], [], 83, False, 2.0, "skip"),
    ]


def test_markdown_table_has_header_and_one_row_per_keyword():
    md = report.render_markdown(sample(), GateResult(True, 8, 160000, []))
    assert "| keyword |" in md.lower()
    assert "heic to jpg" in md
    assert "pdf to word" in md
    # verdict and raw top domains must appear so a human can audit
    assert "build" in md and "skip" in md
    assert "cloudconvert.com" in md


def test_markdown_shows_gate_result():
    md_pass = report.render_markdown(sample(), GateResult(True, 8, 160000, []))
    assert "PASS" in md_pass
    md_fail = report.render_markdown(sample(), GateResult(False, 3, 50000, ["only 3 build keywords (need >= 8)"]))
    assert "FAIL" in md_fail
    assert "only 3 build keywords" in md_fail


def test_decision_data_json_roundtrips():
    data = report.to_json_dict(sample(), GateResult(True, 8, 160000, []))
    parsed = json.loads(json.dumps(data))  # must be JSON-serializable
    assert parsed["gate"]["passed"] is True
    assert parsed["keywords"][0]["keyword"] == "heic to jpg"
    assert parsed["keywords"][0]["top_domains"] == ["cloudconvert.com", "freeconvert.com"]
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_report.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'report'`.

- [ ] **Step 3: Create `research/report.py`**
```python
from dataclasses import asdict
from models import ScoredKeyword, GateResult

VERDICT_ORDER = {"build": 0, "maybe": 1, "skip": 2}


def to_json_dict(scored: list[ScoredKeyword], gate: GateResult) -> dict:
    return {
        "gate": asdict(gate),
        "keywords": [asdict(s) for s in scored],
    }


def render_markdown(scored: list[ScoredKeyword], gate: GateResult) -> str:
    ordered = sorted(scored, key=lambda s: (VERDICT_ORDER.get(s.verdict, 9), -s.score))
    lines = []
    lines.append("# Keyword Research — Decision Table\n")
    status = "PASS" if gate.passed else "FAIL"
    lines.append(f"**Proceed gate: {status}** — {gate.build_keyword_count} build keywords, "
                 f"{gate.total_build_volume:,} combined monthly volume.")
    if gate.reasons:
        for r in gate.reasons:
            lines.append(f"- ⚠ {r}")
    lines.append("")
    lines.append("> The `score` column is a SORT KEY, not a verdict. Verdicts use explicit thresholds "
                 "(see `score.py`). ALWAYS eyeball `top_domains` before committing to a page.\n")
    lines.append("| keyword | verdict | volume | difficulty | beatable | indies | strongest_rank | score | top_domains |")
    lines.append("|---|---|---|---|---|---|---|---|---|")
    for s in ordered:
        lines.append(
            f"| {s.keyword} | **{s.verdict}** | {s.search_volume:,} | "
            f"{s.keyword_difficulty if s.keyword_difficulty is not None else '—'} | "
            f"{'yes' if s.beatable else 'no'} | {len(s.indie_domains)} | "
            f"{s.strongest_rank_top10 if s.strongest_rank_top10 is not None else '—'} | {s.score} | "
            f"{', '.join(s.top_domains[:5])} |"
        )
    lines.append("\n## Human review checklist (do before committing page list)")
    lines.append("- [ ] For each `build` keyword, open the real Google SERP and confirm the indie sites are genuinely beatable (clean UX gap, caps/watermarks, dated design).")
    lines.append("- [ ] Confirm no AI Overview already answers the query in-place (function tools should be safe; verify).")
    lines.append("- [ ] Sanity-check 2–3 volumes against a second source (free Keyword Surfer / Google Trends direction).")
    lines.append("- [ ] Pick the final 8–12 pages from `build` (and strong `maybe`) keywords.")
    return "\n".join(lines)
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_report.py -v`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**
```bash
git add research/report.py research/tests/test_report.py
git commit -m "feat(research): decision-table report generator with audit columns + gate"
```

---

## Task 9: Orchestrator CLI (`run.py`) with cost staging and `--probe`

**Files:**
- Create: `research/run.py`
- Test: `research/tests/test_run_helpers.py`

This wires the phases. The cost-control logic (which keywords get a paid SERP) is pure and unit-tested; the network orchestration is exercised manually with real credentials.

- [ ] **Step 1: Write the failing test** — `research/tests/test_run_helpers.py`
```python
import run
from models import KeywordMetrics


def test_select_serp_candidates_filters_by_volume_floor_and_caps():
    metrics = [
        KeywordMetrics("a", 50000, 10, 0.3),
        KeywordMetrics("b", 300, 10, 0.3),     # >= VOLUME_FLOOR_SERP (200) keeps
        KeywordMetrics("c", 50, 10, 0.3),      # below floor, dropped
        KeywordMetrics("d", None, 10, 0.3),    # no volume, dropped
    ]
    chosen = run.select_serp_candidates(metrics, max_serps=10)
    assert chosen == ["a", "b"]


def test_select_serp_candidates_respects_max_serps_taking_highest_volume():
    metrics = [
        KeywordMetrics("a", 1000, 1, 0.1),
        KeywordMetrics("b", 9000, 1, 0.1),
        KeywordMetrics("c", 5000, 1, 0.1),
    ]
    chosen = run.select_serp_candidates(metrics, max_serps=2)
    assert chosen == ["b", "c"]  # top 2 by volume


def test_unique_domains_collects_across_serps():
    from models import SerpResult, OrganicResult
    serps = [
        SerpResult("k1", [OrganicResult(1, "a.com", ""), OrganicResult(2, "b.com", "")]),
        SerpResult("k2", [OrganicResult(1, "b.com", ""), OrganicResult(2, "c.com", "")]),
    ]
    assert sorted(run.unique_domains(serps)) == ["a.com", "b.com", "c.com"]
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_run_helpers.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'run'`.

- [ ] **Step 3: Create `research/run.py`**
```python
import argparse
import json
from pathlib import Path

import score as score_mod
from client import DataForSeoClient
from discover import expand_seeds
from seeds import load_seeds
import parse
import report

US = 2840
LANG = "en"
RESULTS_DIR = Path("results")
CANDIDATES_FILE = Path("results/candidates.json")


def select_serp_candidates(metrics, max_serps: int) -> list[str]:
    """Keep keywords with volume >= VOLUME_FLOOR_SERP, highest-volume first, capped at max_serps."""
    eligible = [m for m in metrics if (m.search_volume or 0) >= score_mod.VOLUME_FLOOR_SERP]
    eligible.sort(key=lambda m: m.search_volume or 0, reverse=True)
    return [m.keyword for m in eligible[:max_serps]]


def unique_domains(serps) -> list[str]:
    seen = {}
    for s in serps:
        for o in s.organic[:10]:
            seen.setdefault(o.domain, None)
    return list(seen.keys())


def _chunks(items, n):
    for i in range(0, len(items), n):
        yield items[i:i + n]


def cmd_discover(args):
    seeds = load_seeds("data/seeds.json")
    candidates = expand_seeds(seeds)
    RESULTS_DIR.mkdir(exist_ok=True)
    CANDIDATES_FILE.write_text(json.dumps(candidates, indent=2), encoding="utf-8")
    print(f"Discovered {len(candidates)} candidate keywords -> {CANDIDATES_FILE}")


def cmd_probe(args):
    """One cheap live call per endpoint to confirm response shapes match parsers."""
    c = DataForSeoClient()
    kw = "heic to jpg"
    base = {"location_code": US, "language_code": LANG}
    print("search_volume:", json.dumps(c.post("/v3/keywords_data/google_ads/search_volume/live",
          [{**base, "keywords": [kw]}]))[:400])
    print("difficulty:", json.dumps(c.post("/v3/dataforseo_labs/google/bulk_keyword_difficulty/live",
          [{**base, "keywords": [kw]}]))[:400])
    print("serp:", json.dumps(c.post("/v3/serp/google/organic/live/advanced",
          [{**base, "keyword": kw, "depth": 10}]))[:400])
    print("ranks:", json.dumps(c.post("/v3/backlinks/bulk_ranks/live",
          [{"targets": ["cloudconvert.com"], "rank_scale": "one_hundred"}]))[:400])
    print("\nIf any shape differs from the fixtures, update parse.py + fixtures BEFORE running `pull`.")


def cmd_pull(args):
    c = DataForSeoClient()
    candidates = json.loads(CANDIDATES_FILE.read_text(encoding="utf-8"))
    base = {"location_code": US, "language_code": LANG}

    # 1) Volume (batched up to 1000) + difficulty (batched up to 1000) for ALL candidates — cheap.
    metrics = []
    for chunk in _chunks(candidates, 700):
        body = c.post("/v3/keywords_data/google_ads/search_volume/live", [{**base, "keywords": chunk}])
        metrics.extend(parse.parse_search_volume(body))
    difficulty = {}
    for chunk in _chunks(candidates, 700):
        body = c.post("/v3/dataforseo_labs/google/bulk_keyword_difficulty/live", [{**base, "keywords": chunk}])
        difficulty.update(parse.parse_keyword_difficulty(body))
    for m in metrics:
        m.keyword_difficulty = difficulty.get(m.keyword)

    # 2) SERP only for survivors above the volume floor — the cost driver.
    serp_keywords = select_serp_candidates(metrics, args.max_serps)
    serps = []
    for kw in serp_keywords:
        body = c.post("/v3/serp/google/organic/live/advanced", [{**base, "keyword": kw, "depth": 10}])
        serps.append(parse.parse_serp(body))

    # 3) Authority once for the unique ranking domains — cheap (one batched call up to 1000).
    domains = unique_domains(serps)
    ranks = {}
    for chunk in _chunks(domains, 900):
        body = c.post("/v3/backlinks/bulk_ranks/live", [{"targets": chunk, "rank_scale": "one_hundred"}])
        ranks.update(parse.parse_bulk_ranks(body))

    # Persist intermediate state so `report` is a pure re-run.
    RESULTS_DIR.mkdir(exist_ok=True)
    serp_by_kw = {s.keyword: [o.domain for o in s.organic[:10]] for s in serps}
    Path("results/pull.json").write_text(json.dumps({
        "metrics": [m.__dict__ for m in metrics],
        "serp_domains": serp_by_kw,
        "ranks": ranks,
    }, indent=2), encoding="utf-8")
    print(f"Pulled volume/difficulty for {len(metrics)} kw, SERPs for {len(serps)}, "
          f"authority for {len(ranks)} domains -> results/pull.json")


def cmd_report(args):
    from models import KeywordMetrics, SerpResult, OrganicResult
    data = json.loads(Path("results/pull.json").read_text(encoding="utf-8"))
    metrics = [KeywordMetrics(**m) for m in data["metrics"]]
    ranks = data["ranks"]
    serp_domains = data["serp_domains"]

    scored = []
    for m in metrics:
        domains = serp_domains.get(m.keyword)
        if not domains:
            continue  # only score keywords we actually pulled a SERP for
        serp = SerpResult(m.keyword, [OrganicResult(i + 1, d, "") for i, d in enumerate(domains)])
        scored.append(score_mod.score_keyword(m, serp, ranks))

    gate = score_mod.evaluate_gate(scored)
    Path("keyword-research.md").write_text(report.render_markdown(scored, gate), encoding="utf-8")
    Path("results/decision-data.json").write_text(
        json.dumps(report.to_json_dict(scored, gate), indent=2), encoding="utf-8")
    print(f"Report written. Gate: {'PASS' if gate.passed else 'FAIL'} "
          f"({gate.build_keyword_count} build kw, {gate.total_build_volume:,} volume)")


def main():
    p = argparse.ArgumentParser(description="Stage 0 keyword research pipeline")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("discover").set_defaults(func=cmd_discover)
    sub.add_parser("probe").set_defaults(func=cmd_probe)
    pull = sub.add_parser("pull"); pull.add_argument("--max-serps", type=int, default=250); pull.set_defaults(func=cmd_pull)
    sub.add_parser("report").set_defaults(func=cmd_report)
    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd research && . .venv/Scripts/activate && python -m pytest tests/test_run_helpers.py -v`
Expected: PASS (3 tests).

- [ ] **Step 5: Run the full unit suite (everything green, no network)**

Run: `cd research && . .venv/Scripts/activate && python -m pytest -v`
Expected: ALL tests pass (seeds 2, discover 3, client 2, parse_metrics 3, parse_serp 3, score 9, report 3, run_helpers 3 = 28).

- [ ] **Step 6: Commit**
```bash
git add research/run.py research/tests/test_run_helpers.py
git commit -m "feat(research): orchestrator CLI with staged cost controls and probe"
```

---

## Task 10: Live run (requires DataForSEO key) + committed results

> This task spends real money (~$15–25 budget). It REQUIRES `research/.env` with valid DataForSEO API credentials. If the key is not yet available, STOP after Task 9 and report that the pipeline is built and unit-tested but the live run is pending credentials. Do NOT fake results.

**Files:**
- Create (generated): `research/results/candidates.json`, `research/results/pull.json` (gitignored if large — see note), `research/results/decision-data.json`, `research/keyword-research.md`

- [ ] **Step 1: Confirm credentials present**

Run: `cd research && . .venv/Scripts/activate && python -c "from client import DataForSeoClient; DataForSeoClient(); print('creds ok')"`
Expected: prints `creds ok`. If it raises `KeyError`, `.env` is missing/incomplete — stop and request the key.

- [ ] **Step 2: Discover (free)**

Run: `cd research && . .venv/Scripts/activate && python run.py discover`
Expected: prints "Discovered N candidate keywords"; `results/candidates.json` exists with N ≥ 50.

- [ ] **Step 3: PROBE — verify response shapes match parsers BEFORE bulk spend (~$0.02)**

Run: `cd research && . .venv/Scripts/activate && python run.py probe`
Expected: prints a truncated JSON sample per endpoint. **Manually compare each against the fixtures** in `tests/fixtures/`. If any nesting differs (e.g. volume under `result[].items[]` instead of `result[]`), FIX `parse.py` + the fixture, re-run the affected parser tests, and only then continue. Document any change in the commit.

- [ ] **Step 4: Pull decision-grade data (paid, staged)**

Run: `cd research && . .venv/Scripts/activate && python run.py pull --max-serps 250`
Expected: prints counts; `results/pull.json` written. Cached calls mean re-runs are free. Watch the DataForSEO dashboard balance; the staged design keeps SERP (the cost driver) to ≤250 calls.

- [ ] **Step 5: Generate the report**

Run: `cd research && . .venv/Scripts/activate && python run.py report`
Expected: prints the gate result; `keyword-research.md` and `results/decision-data.json` written.

- [ ] **Step 6: Add a results .gitignore note and commit the AUDIT artifacts**

Decide on `pull.json` size: if < ~1 MB, commit it; else add `/research/results/pull.json` to `.gitignore`. Always commit the decision artifacts:
```bash
git add research/keyword-research.md research/results/decision-data.json research/results/candidates.json
# optionally: git add research/results/pull.json   (if small)
git commit -m "data(research): Stage 0 keyword research results and decision table"
```

- [ ] **Step 7: Hand off for human review**

Report to the user: the gate PASS/FAIL, the count of `build` keywords and combined volume, and the top 12 candidates with their raw `top_domains`. Explicitly walk the "Human review checklist" in `keyword-research.md` together before locking Plan 2's page list. Do NOT treat the gate as the final word — it's a filter; the human SERP eyeball is the decision.

---

## Self-Review Notes (author)

- **Spec coverage (spec §5 + the brainstorm decisions):** Free discovery pass ✓ Task 3; DataForSEO volume/difficulty/SERP/authority ✓ Tasks 4–6, 9; "beatable indie DR<40" centerpiece ✓ Task 7; proceed-gate (≥8–10 kw, ≥100K, beatable) ✓ Task 7/8; auditable consolidated artifact ✓ Tasks 8,10; cost staging + thorough depth (authority on ranking domains) ✓ Tasks 7,9; human-review-before-decision ✓ Tasks 8,10; image-niche-only scope ✓ Task 2 seeds. pytrends deliberately excluded (documented in header). DataForSEO-key dependency surfaced ✓ Task 10 guard.
- **Type consistency:** `KeywordMetrics`, `SerpResult`, `OrganicResult`, `ScoredKeyword`, `GateResult` used identically across parse/score/report/run. `classify_beatable`, `score_keyword`, `evaluate_gate`, `select_serp_candidates`, `unique_domains` signatures match their tests. Constants live only in `score.py` and are imported (`score_mod.VOLUME_FLOOR_SERP`).
- **Placeholder scan:** none — every step has runnable code/commands.
- **Care features baked in:** unknown-authority-domains-are-not-indie default (test in Task 7), probe-before-spend (Task 10 §3), cache-to-avoid-re-pay (Task 4), score-is-a-sort-key-not-a-verdict (everywhere), human-review checklist in the output (Task 8), no verdict from free data (architecture).
- **Known residual risk:** DataForSEO response nesting is verified from docs, not a live call — Task 10 §3 (`probe`) is the mandatory reality-check before bulk spend. This is the single most likely place reality diverges from the plan; it is explicitly gated.
```
