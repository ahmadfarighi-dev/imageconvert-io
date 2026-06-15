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
    lines.append("> `score` is a SORT KEY, not a verdict. Verdicts use explicit volume + keyword-difficulty "
                 "thresholds (see `score.py`). `difficulty` (KD, 0-100) is the beatability signal — it encodes "
                 "the incumbents' authority. `top_domains` shows who currently ranks; ALWAYS eyeball it before "
                 "committing to a page.\n")
    lines.append("| keyword | verdict | volume | difficulty | beatable | score | top_domains |")
    lines.append("|---|---|---|---|---|---|---|")
    for s in ordered:
        lines.append(
            f"| {s.keyword} | **{s.verdict}** | {s.search_volume:,} | "
            f"{s.keyword_difficulty if s.keyword_difficulty is not None else '—'} | "
            f"{'yes' if s.beatable else 'no'} | {s.score} | "
            f"{', '.join(s.top_domains[:5])} |"
        )
    lines.append("\n## Human review checklist (do before committing page list)")
    lines.append("- [ ] For each `build` keyword, open the real Google SERP and confirm the ranking sites look beatable (indie tools with clean-UX gaps, caps/watermarks, dated design — not wall-to-wall giants).")
    lines.append("- [ ] Confirm no AI Overview already answers the query in-place (function tools should be safe; verify).")
    lines.append("- [ ] Sanity-check 2–3 volumes against a second source (free Keyword Surfer / Google Trends direction).")
    lines.append("- [ ] Pick the final 8–12 pages from `build` (and strong `maybe`) keywords.")
    return "\n".join(lines)
