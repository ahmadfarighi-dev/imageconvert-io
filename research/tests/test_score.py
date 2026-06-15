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


def test_rank_zero_is_not_a_beatable_indie():
    # DataForSEO returns 0 for "no backlinks detected"/unknown — must NOT count as an indie,
    # otherwise missing authority data manufactures false "build" verdicts.
    beatable, indies = score.classify_beatable(serp("x.com", "y.com"), {"x.com": 0, "y.com": 0})
    assert beatable is False
    assert indies == []


def test_giants_in_top5_block_beatability_even_with_late_indies():
    # Giants occupy positions 1-5; the two indies are stranded at 6-7 (outside the top 5).
    domains = ["g1.com", "g2.com", "g3.com", "g4.com", "g5.com", "i1.com", "i2.com"]
    ranks = {"g1.com": 80, "g2.com": 78, "g3.com": 85, "g4.com": 90, "g5.com": 75,
             "i1.com": 20, "i2.com": 15}
    beatable, indies = score.classify_beatable(serp(*domains), ranks)
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


def test_unknown_difficulty_downgrades_to_maybe_not_build():
    # Missing difficulty must NOT sail through to "build" — conservative default is "maybe".
    m = KeywordMetrics("k", search_volume=5000, competition_index=5, cpc=0.2, keyword_difficulty=None)
    sk = score.score_keyword(m, serp("b.com", "c.com"), {"b.com": 20, "c.com": 25})
    assert sk.verdict == "maybe"


def test_high_difficulty_downgrades_to_maybe():
    m = KeywordMetrics("k", search_volume=5000, competition_index=5, cpc=0.2, keyword_difficulty=65)
    sk = score.score_keyword(m, serp("b.com", "c.com"), {"b.com": 20, "c.com": 25})
    assert sk.verdict == "maybe"


def test_strongest_rank_is_the_toughest_competitor():
    # The reported rank must be the STRONGEST competitor (max), not the weakest — and rank 0 (unknown)
    # must be excluded so the field isn't structurally pinned near zero.
    m = KeywordMetrics("k", search_volume=5000, competition_index=5, cpc=0.2, keyword_difficulty=20)
    sk = score.score_keyword(m, serp("big.com", "b.com", "c.com", "d.com"),
                             {"big.com": 88, "b.com": 20, "c.com": 0, "d.com": 15})
    assert sk.strongest_rank_top10 == 88            # max known authority (rank 0 excluded)
    assert sk.beatable is True                      # b.com (20) and d.com (15) are real top-5 indies


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
