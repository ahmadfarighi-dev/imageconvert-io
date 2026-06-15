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
