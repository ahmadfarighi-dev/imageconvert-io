import math
from models import KeywordMetrics, SerpResult, ScoredKeyword, GateResult

# --- Tunable thresholds (documented in README + report). Judgment calls; a human may override. ---
INDIE_RANK_MAX = 40            # domain authority (0-100) below which a ranking site is "beatable indie"
INDIE_RANK_MIN = 1            # ranks below this (i.e. 0 = "no backlinks detected"/unknown to DataForSEO)
                              # are NOT treated as authority-zero indies — missing data must never
                              # manufacture beatability (the careful default).
MIN_INDIE_FOR_BEATABLE = 2    # a SERP is beatable if >= this many indies sit within the TOP positions
TOP_POSITIONS = 5            # only the visible top-5 count toward beatability — giants up top (1-8) with
                             # indies stranded at 9-10 is NOT realistically winnable for a new domain.
VOLUME_FLOOR_BUILD = 500      # min US monthly volume to consider "build"
VOLUME_FLOOR_SERP = 200       # min volume to bother pulling a (paid) SERP
DIFFICULTY_MAX_BUILD = 50     # difficulty at/above which we downgrade from "build"
GATE_MIN_BUILD_KEYWORDS = 8
GATE_MIN_TOTAL_VOLUME = 100_000


def classify_beatable(serp: SerpResult, ranks: dict[str, int]) -> tuple[bool, list[str]]:
    """A SERP is beatable if >= MIN_INDIE_FOR_BEATABLE of its TOP-`TOP_POSITIONS` organic domains
    have authority in [INDIE_RANK_MIN, INDIE_RANK_MAX). Two careful defaults guard against
    manufacturing beatability from bad data:
      - UNKNOWN authority (domain absent from `ranks`) is NOT counted as indie.
      - rank 0 ("no backlinks detected" / unknown to DataForSEO) is NOT counted as indie.
    Counting only the top positions prevents giant-dominated SERPs (giants 1-8, indies 9-10)
    from being mislabeled winnable for a brand-new domain."""
    indies = []
    for o in serp.organic[:TOP_POSITIONS]:
        rank = ranks.get(o.domain)
        if rank is not None and INDIE_RANK_MIN <= rank < INDIE_RANK_MAX:
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
    # Strongest competitor = highest KNOWN authority in the top 10 (rank 0 = unknown, excluded).
    known_ranks = [ranks[d] for d in top_domains if d in ranks and ranks[d] >= INDIE_RANK_MIN]
    strongest_rank = max(known_ranks) if known_ranks else None
    volume = metrics.search_volume or 0
    diff = metrics.keyword_difficulty

    if not beatable or volume < VOLUME_FLOOR_BUILD:
        verdict = "skip"
    elif diff is None or diff >= DIFFICULTY_MAX_BUILD:
        # Unknown difficulty is conservative -> "maybe", never an automatic "build".
        verdict = "maybe"
    else:
        verdict = "build"

    # A beatable, mid-volume term that just misses the build floor is "maybe", not "skip".
    if verdict == "skip" and beatable and VOLUME_FLOOR_SERP <= volume < VOLUME_FLOOR_BUILD:
        verdict = "maybe"

    return ScoredKeyword(
        keyword=metrics.keyword,
        search_volume=volume,
        keyword_difficulty=diff,
        top_domains=top_domains,
        indie_domains=indies,
        strongest_rank_top10=strongest_rank,
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
