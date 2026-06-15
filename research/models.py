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
    strongest_rank_top10: int | None  # highest KNOWN authority in the top 10 (toughest competitor)
    beatable: bool
    score: float
    verdict: str  # "build" | "maybe" | "skip"


@dataclass
class GateResult:
    passed: bool
    build_keyword_count: int
    total_build_volume: int
    reasons: list[str] = field(default_factory=list)
