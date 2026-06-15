import json
from pathlib import Path
import parse


def _load(name):
    return json.loads(Path(f"tests/fixtures/{name}").read_text(encoding="utf-8"))


def test_parse_serp_keeps_only_organic_in_rank_order():
    serp = parse.parse_serp(_load("serp.json"))
    assert serp.keyword == "heic to jpg"
    assert [o.domain for o in serp.organic] == ["cloudconvert.com", "freeconvert.com", "tinywow.com"]
    assert serp.organic[0].rank == 1
    assert serp.organic[1].url == "https://freeconvert.com/heic-to-jpg"


def test_parse_bulk_ranks_returns_domain_to_rank_map():
    ranks = parse.parse_bulk_ranks(_load("bulk_ranks.json"))
    assert ranks == {"cloudconvert.com": 71, "freeconvert.com": 33, "tinywow.com": 38}


def test_parse_serp_empty_is_safe():
    s = parse.parse_serp({"tasks": []})
    assert s.keyword == ""
    assert s.organic == []


def test_parse_serp_sorts_organic_by_rank_even_when_api_unordered():
    body = {
        "tasks": [{"result": [{"keyword": "k", "items": [
            {"type": "organic", "rank_group": 3, "domain": "c.com", "url": ""},
            {"type": "organic", "rank_group": 1, "domain": "a.com", "url": ""},
            {"type": "organic", "rank_group": 2, "domain": "b.com", "url": ""},
        ]}]}]
    }
    serp = parse.parse_serp(body)
    assert [o.domain for o in serp.organic] == ["a.com", "b.com", "c.com"]
