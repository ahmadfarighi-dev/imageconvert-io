import json
import report
from models import ScoredKeyword, GateResult


def sample():
    return [
        ScoredKeyword("heic to jpg", 90500, 28, ["cloudconvert.com", "freeconvert.com"],
                      ["freeconvert.com"], 71, True, 9.1, "build"),
        ScoredKeyword("pdf to word", 400000, 70, ["ilovepdf.com"], [], 83, False, 2.0, "skip"),
    ]


def test_markdown_table_has_header_and_one_row_per_keyword():
    md = report.render_markdown(sample(), GateResult(True, 8, 160000, []))
    assert "| keyword |" in md.lower()
    assert "heic to jpg" in md
    assert "pdf to word" in md
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
