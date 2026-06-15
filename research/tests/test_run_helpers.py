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
