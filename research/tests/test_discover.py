import json
from pathlib import Path
import discover


def test_parse_autocomplete_extracts_suggestions():
    raw = json.loads(Path("tests/fixtures/autocomplete.json").read_text(encoding="utf-8"))
    out = discover.parse_autocomplete(raw)
    assert out == [
        "heic to jpg",
        "heic to jpg converter",
        "heic to jpg windows",
        "heic to jpg mac",
    ]


def test_parse_autocomplete_handles_empty():
    assert discover.parse_autocomplete(["x", [], [], {}]) == []
    assert discover.parse_autocomplete(["x"]) == []


def test_merge_candidates_dedupes_and_lowercases():
    seeds = ["heic to jpg", "webp to png"]
    discovered = {"HEIC to JPG converter", "heic to jpg", " webp to png "}
    out = discover.merge_candidates(seeds, discovered)
    assert "heic to jpg" in out
    assert "heic to jpg converter" in out
    assert "webp to png" in out
    assert len(out) == len(set(out))
    assert all(k == k.lower().strip() for k in out)
