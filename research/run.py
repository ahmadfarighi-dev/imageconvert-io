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
BASE = Path(__file__).resolve().parent
SEEDS_FILE = BASE / "data" / "seeds.json"
RESULTS_DIR = BASE / "results"
CANDIDATES_FILE = RESULTS_DIR / "candidates.json"
PULL_FILE = RESULTS_DIR / "pull.json"
DECISION_FILE = RESULTS_DIR / "decision-data.json"
REPORT_FILE = BASE / "keyword-research.md"


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
    seeds = load_seeds(str(SEEDS_FILE))
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
          [{**base, "keywords": [kw]}]))[:2500])
    print("difficulty:", json.dumps(c.post("/v3/dataforseo_labs/google/bulk_keyword_difficulty/live",
          [{**base, "keywords": [kw]}]))[:2500])
    print("serp:", json.dumps(c.post("/v3/serp/google/organic/live/advanced",
          [{**base, "keyword": kw, "depth": 10}]))[:2500])
    print("ranks:", json.dumps(c.post("/v3/backlinks/bulk_ranks/live",
          [{"targets": ["cloudconvert.com"], "rank_scale": "one_hundred"}]))[:2500])
    print("\nIf any shape differs from the fixtures, update parse.py + fixtures BEFORE running `pull`.")


def cmd_pull(args):
    c = DataForSeoClient()
    candidates = json.loads(CANDIDATES_FILE.read_text(encoding="utf-8"))
    base = {"location_code": US, "language_code": LANG}

    metrics = []
    for chunk in _chunks(candidates, 700):
        body = c.post("/v3/keywords_data/google_ads/search_volume/live", [{**base, "keywords": chunk}])
        metrics.extend(parse.parse_search_volume(body))
    if metrics and all(m.search_volume is None for m in metrics):
        print("WARNING: every keyword came back with search_volume=None — the search_volume "
              "response shape may not match the parser. Inspect `probe` output before trusting results.")
    difficulty = {}
    for chunk in _chunks(candidates, 700):
        body = c.post("/v3/dataforseo_labs/google/bulk_keyword_difficulty/live", [{**base, "keywords": chunk}])
        difficulty.update(parse.parse_keyword_difficulty(body))
    if candidates and not difficulty:
        print("WARNING: keyword_difficulty parse returned nothing — the difficulty response shape "
              "may not match the parser. All verdicts will be capped at 'maybe'.")
    for m in metrics:
        m.keyword_difficulty = difficulty.get(m.keyword)

    serp_keywords = select_serp_candidates(metrics, args.max_serps)
    serps = []
    for kw in serp_keywords:
        body = c.post("/v3/serp/google/organic/live/advanced", [{**base, "keyword": kw, "depth": 10}])
        serp = parse.parse_serp(body)
        if not serp.keyword or not serp.organic:
            print(f"WARNING: empty/invalid SERP for '{kw}' — skipping (possible quota limit or shape mismatch).")
            continue
        if serp.keyword != kw.lower().strip():
            print(f"WARNING: SERP keyword echo '{serp.keyword}' != requested '{kw}'.")
        serps.append(serp)

    # NOTE: beatability is driven by keyword_difficulty (accessible on the deposit). Per-domain
    # backlink authority (bulk_ranks) needs a separate DataForSEO Backlinks subscription, so it is
    # intentionally not pulled. The SERP domains are kept only to surface who ranks for human review.
    RESULTS_DIR.mkdir(exist_ok=True)
    serp_by_kw = {s.keyword: [o.domain for o in s.organic[:10]] for s in serps}
    PULL_FILE.write_text(json.dumps({
        "metrics": [m.__dict__ for m in metrics],
        "serp_domains": serp_by_kw,
    }, indent=2), encoding="utf-8")
    print(f"Pulled volume/difficulty for {len(metrics)} kw, SERPs for {len(serps)} -> {PULL_FILE.name}")


def cmd_report(args):
    from models import KeywordMetrics, SerpResult, OrganicResult
    data = json.loads(PULL_FILE.read_text(encoding="utf-8"))
    metrics = [KeywordMetrics(**m) for m in data["metrics"]]
    serp_domains = data["serp_domains"]

    scored = []
    for m in metrics:
        domains = serp_domains.get(m.keyword)
        if not domains:
            continue
        serp = SerpResult(m.keyword, [OrganicResult(i + 1, d, "") for i, d in enumerate(domains)])
        scored.append(score_mod.score_keyword(m, serp))

    gate = score_mod.evaluate_gate(scored)
    REPORT_FILE.write_text(report.render_markdown(scored, gate), encoding="utf-8")
    DECISION_FILE.write_text(
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
