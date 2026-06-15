from dataclasses import asdict
from models import ScoredKeyword, GateResult

VERDICT_ORDER = {"build": 0, "maybe": 1, "skip": 2}


def to_json_dict(scored: list[ScoredKeyword], gate: GateResult) -> dict:
    return {
        "gate": asdict(gate),
        "keywords": [asdict(s) for s in scored],
    }


def render_markdown(scored: list[ScoredKeyword], gate: GateResult) -> str:
    ordered = sorted(scored, key=lambda s: (VERDICT_ORDER.get(s.verdict, 9), -s.score))
    lines = []
    lines.append("# Keyword Research — Decision Table\n")
    status = "PASS" if gate.passed else "FAIL"
    lines.append(f"**Proceed gate: {status}** — {gate.build_keyword_count} build keywords, "
                 f"{gate.total_build_volume:,} combined monthly volume.")
    if gate.reasons:
        for r in gate.reasons:
            lines.append(f"- ⚠ {r}")
    lines.append("")
    lines.append("> The `score` column is a SORT KEY, not a verdict. Verdicts use explicit thresholds "
                 "(see `score.py`). `strongest_rank` is the toughest competitor's authority in the top 10. "
                 "ALWAYS eyeball `top_domains` before committing to a page.\n")
    lines.append("| keyword | verdict | volume | difficulty | beatable | indies | strongest_rank | score | top_domains |")
    lines.append("|---|---|---|---|---|---|---|---|---|")
    for s in ordered:
        lines.append(
            f"| {s.keyword} | **{s.verdict}** | {s.search_volume:,} | "
            f"{s.keyword_difficulty if s.keyword_difficulty is not None else '—'} | "
            f"{'yes' if s.beatable else 'no'} | {len(s.indie_domains)} | "
            f"{s.strongest_rank_top10 if s.strongest_rank_top10 is not None else '—'} | {s.score} | "
            f"{', '.join(s.top_domains[:5])} |"
        )
    lines.append("\n## Human review checklist (do before committing page list)")
    lines.append("- [ ] For each `build` keyword, open the real Google SERP and confirm the indie sites are genuinely beatable (clean UX gap, caps/watermarks, dated design).")
    lines.append("- [ ] Confirm no AI Overview already answers the query in-place (function tools should be safe; verify).")
    lines.append("- [ ] Sanity-check 2–3 volumes against a second source (free Keyword Surfer / Google Trends direction).")
    lines.append("- [ ] Pick the final 8–12 pages from `build` (and strong `maybe`) keywords.")
    return "\n".join(lines)
