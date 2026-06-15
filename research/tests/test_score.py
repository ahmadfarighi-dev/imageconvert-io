import score
from models import KeywordMetrics, OrganicResult, SerpResult


def serp(*domains):
    return SerpResult(keyword="k", organic=[OrganicResult(rank=i + 1, domain=d, url="") for i, d in enumerate(domains)])


def kw(volume, difficulty):
    return KeywordMetrics("k", search_volume=volume, competition_index=5, cpc=0.2, keyword_difficulty=difficulty)


def test_is_beatable_low_and_mid_difficulty():
    assert score.is_beatable(20) is True
    assert score.is_beatable(55) is True       # boundary inclusive
    assert score.is_beatable(56) is False      # giant territory
    assert score.is_beatable(90) is False


def test_is_beatable_unknown_difficulty_is_not_beatable():
    # Missing KD must NOT be assumed winnable (careful default).
    assert score.is_beatable(None) is False


def test_verdict_build_low_kd_high_volume():
    sk = score.score_keyword(kw(90500, 28), serp("heictojpg.com", "cloudconvert.com"))
    assert sk.verdict == "build"
    assert sk.beatable is True
    assert sk.top_domains == ["heictojpg.com", "cloudconvert.com"]
    assert sk.score > 0


def test_verdict_maybe_mid_kd():
    # KD between build (40) and beatable (55) -> "maybe"
    sk = score.score_keyword(kw(90500, 48), serp("a.com"))
    assert sk.verdict == "maybe"


def test_verdict_skip_high_kd_giants():
    sk = score.score_keyword(kw(400000, 78), serp("ilovepdf.com", "adobe.com"))
    assert sk.verdict == "skip"
    assert sk.beatable is False


def test_verdict_skip_unknown_difficulty():
    sk = score.score_keyword(kw(5000, None), serp("a.com"))
    assert sk.verdict == "skip"


def test_verdict_skip_below_volume_floor():
    sk = score.score_keyword(kw(80, 20), serp("a.com"))
    assert sk.verdict == "skip"


def test_verdict_maybe_between_volume_floors():
    sk = score.score_keyword(kw(300, 20), serp("a.com"))
    assert sk.verdict == "maybe"


def test_kd_build_boundary_inclusive():
    assert score.score_keyword(kw(5000, 40), serp("a.com")).verdict == "build"   # KD 40 -> build
    assert score.score_keyword(kw(5000, 41), serp("a.com")).verdict == "maybe"   # KD 41 -> maybe


def test_gate_passes_with_enough_build_keywords_and_volume():
    builds = [score.ScoredKeyword(f"kw{i}", 20000, 20, ["b.com"], True, 5.0, "build") for i in range(8)]
    gate = score.evaluate_gate(builds)
    assert gate.passed is True
    assert gate.build_keyword_count == 8
    assert gate.total_build_volume == 160000


def test_gate_fails_with_too_few_build_keywords():
    builds = [score.ScoredKeyword(f"kw{i}", 50000, 20, ["b.com"], True, 5.0, "build") for i in range(3)]
    gate = score.evaluate_gate(builds)
    assert gate.passed is False
    assert any("keyword" in r for r in gate.reasons)
