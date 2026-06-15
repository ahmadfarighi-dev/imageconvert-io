import json
from pathlib import Path
import parse


def _load(name):
    return json.loads(Path(f"tests/fixtures/{name}").read_text(encoding="utf-8"))


def test_parse_search_volume_maps_each_keyword():
    metrics = parse.parse_search_volume(_load("search_volume.json"))
    by_kw = {m.keyword: m for m in metrics}
    assert by_kw["heic to jpg"].search_volume == 90500
    assert by_kw["heic to jpg"].competition_index == 12
    assert by_kw["heic to jpg"].cpc == 0.41
    assert by_kw["obscure term"].search_volume is None


def test_parse_difficulty_returns_keyword_to_score_map():
    diff = parse.parse_keyword_difficulty(_load("keyword_difficulty.json"))
    assert diff == {"heic to jpg": 28, "webp to png": 19}


def test_parsers_tolerate_empty_tasks():
    assert parse.parse_search_volume({"tasks": []}) == []
    assert parse.parse_keyword_difficulty({"tasks": []}) == {}
