import math
from models import KeywordMetrics, SerpResult, ScoredKeyword, GateResult

# --- Beatability is driven by keyword_difficulty (KD, 0-100) ---
# DataForSEO computes KD from the current top-10's link profiles and ranking factors, so it
# already encodes how authoritative the incumbents are — exactly what a brand-new domain needs
# to know. We use KD (accessible on the pay-as-you-go deposit) rather than per-domain backlink
# authority (DataForSEO Backlinks API = separate subscription). The raw ranking domains are still
# surfaced in the report for human SERP review. Thresholds are judgment calls; a human may override.
KD_MAX_BUILD = 40        # KD <= this: realistically winnable for a brand-new domain
KD_MAX_BEATABLE = 55     # KD above this: giant-dominated SERP, not winnable for a new site
VOLUME_FLOOR_BUILD = 500 # min US monthly volume to consider "build"
VOLUME_FLOOR_SERP = 200  # min volume to bother pulling a (paid) SERP
GATE_MIN_BUILD_KEYWORDS = 8
GATE_MIN_TOTAL_VOLUME = 100_000


def is_beatable(difficulty: int | None) -> bool:
    """A SERP is realistically winnable for a new domain when keyword difficulty is not in giant
    territory. UNKNOWN difficulty is conservatively treated as NOT beatable (careful default:
    never assume winnable on missing data)."""
    return difficulty is not None and difficulty <= KD_MAX_BEATABLE


def _score_value(search_volume: int, difficulty: int | None) -> float:
    """Transparent SORT key (NOT a verdict): rewards volume and low difficulty."""
    volume_score = math.log10(search_volume + 1)                       # ~0..6
    ease = max(0.05, 1 - (difficulty if difficulty is not None else 60) / 100)
    return round(volume_score * ease, 3)


def score_keyword(metrics: KeywordMetrics, serp: SerpResult) -> ScoredKeyword:
    volume = metrics.search_volume or 0
    diff = metrics.keyword_difficulty
    top_domains = [o.domain for o in serp.organic[:10]]
    beatable = is_beatable(diff)

    if not beatable or volume < VOLUME_FLOOR_BUILD:
        verdict = "skip"
    elif diff is not None and diff <= KD_MAX_BUILD:
        verdict = "build"
    else:
        verdict = "maybe"

    # A beatable, mid-volume term that just misses the build floor is "maybe", not "skip".
    if verdict == "skip" and beatable and VOLUME_FLOOR_SERP <= volume < VOLUME_FLOOR_BUILD:
        verdict = "maybe"

    return ScoredKeyword(
        keyword=metrics.keyword,
        search_volume=volume,
        keyword_difficulty=diff,
        top_domains=top_domains,
        beatable=beatable,
        score=_score_value(volume, diff),
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
