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
    top_domains: list[str]            # who currently ranks (from SERP) — surfaced for human review
    beatable: bool                    # keyword_difficulty indicates a new domain can realistically rank
    score: float
    verdict: str  # "build" | "maybe" | "skip"


@dataclass
class GateResult:
    passed: bool
    build_keyword_count: int
    total_build_volume: int
    reasons: list[str] = field(default_factory=list)
