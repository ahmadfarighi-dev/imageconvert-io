from models import KeywordMetrics, OrganicResult, SerpResult


def _results(body: dict) -> list:
    """Flatten tasks[].result[] defensively."""
    out = []
    for task in body.get("tasks") or []:
        for res in task.get("result") or []:
            out.append(res)
    return out


def parse_search_volume(body: dict) -> list[KeywordMetrics]:
    metrics = []
    for res in _results(body):
        metrics.append(KeywordMetrics(
            keyword=res.get("keyword", "").lower().strip(),
            search_volume=res.get("search_volume"),
            competition_index=res.get("competition_index"),
            cpc=res.get("cpc"),
        ))
    return metrics


def parse_keyword_difficulty(body: dict) -> dict[str, int]:
    out: dict[str, int] = {}
    for res in _results(body):
        for item in res.get("items") or []:
            kw = item.get("keyword", "").lower().strip()
            if kw and item.get("keyword_difficulty") is not None:
                out[kw] = item["keyword_difficulty"]
    return out


def parse_serp(body: dict) -> SerpResult:
    results = _results(body)
    if not results:
        return SerpResult(keyword="", organic=[])
    res = results[0]
    organic = []
    for item in res.get("items") or []:
        if item.get("type") == "organic" and item.get("domain"):
            organic.append(OrganicResult(
                rank=item.get("rank_group", 0),
                domain=item["domain"].lower(),
                url=item.get("url", ""),
            ))
    organic.sort(key=lambda o: o.rank)
    return SerpResult(keyword=res.get("keyword", "").lower().strip(), organic=organic)


def parse_bulk_ranks(body: dict) -> dict[str, int]:
    out: dict[str, int] = {}
    for res in _results(body):
        for item in res.get("items") or []:
            target = (item.get("target") or "").lower()
            if target and item.get("rank") is not None:
                out[target] = item["rank"]
    return out
