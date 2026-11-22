"""Build the redesign's index page and the switcher list from redesign.json.

    python3 tools/build_index.py [redesign_dir]

Writes <dir>/index.html and <dir>/assets/variants.js. Run it again after
every change to redesign.json (new variant, red-team verdict, recommendation),
so the switcher on old pages links to new ones too. Thumbnails come from
shots/<size>/<variant path>.png: copy out/shots/ into the redesign root first.
Stdlib only, so it runs on the bot worker.

redesign.json (fields marked ? are optional):
{
  "title": "Project list redesign", "app": "Acme", "date": "2026-11-01",
  "confidential"?: true,                      # adds the 3-line footer
  "complaint": "the user's words",
  "ia": "list of things I made + visibility + review status + favourite + per-item menu",
  "spec": [{"metric": "Grid starts at (1440×900)", "before": "287px", "after": "104px"}],
  "principles": ["One primary module per page", ...],
  "references": [{"service": "YouTube Studio", "how": "...", "kind": "captured|doc",
                  "evidence": "refs/youtube.png or https://doc", "quote"?: "...",
                  "used_by": "list B", "counter"?: true}],
  "findings"?: ["a state our product hides that every comparable product shows (checked in code: ...)"],
  "pages": [{"id": "list", "name": "Project list", "current": "current/list.png", "size"?: "390x844",
             "variants": [{"file": "pages/list/a-youtube.html", "name": "A · Content table",
                           "reference": "YouTube Studio", "idea": "...", "tradeoff": "...",
                           "verdict"?: "...", "recommended"?: true, "reason"?: "...",
                           "states"?: ["menu-open"]}]}],
  "stories"?: [{"who": "...", "task": "...", "gap": "...", "fixed": "list D"}],
  "build_order"?: ["tokens + shell PR", ...],
  "limits"?: ["mock data", ...],
  "redteam_pending"?: true
}
"""

import html
import json
import sys
from pathlib import Path

SHOT_SIZE = "1440x900"
FOOTER = (
    "본 문서는 비밀 정보를 포함하고 있으며, 내부 검토용으로만 작성되었습니다.<br>"
    "This page is confidential and for internal review only.<br>"
    "Mock data. People are placeholders."
)

CSS = """
:root{--bg:#fff;--fg:#18181b;--fg2:#52525b;--fg3:#a1a1aa;--line:#e4e4e7;--soft:#f7f7f8;--ok:#16a34a;--act:#dc2626}
*{box-sizing:border-box}body{margin:0;font:14px/1.55 Pretendard,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",sans-serif;color:var(--fg);background:var(--bg);word-break:keep-all}
main{max-width:1280px;margin:0 auto;padding:48px 32px 96px}
h1{font-size:28px;margin:0 0 8px;letter-spacing:-.01em}h2{font-size:20px;margin:56px 0 16px;padding-top:24px;border-top:1px solid var(--line)}h3{font-size:16px;margin:32px 0 12px}
.sub{color:var(--fg2);margin:0 0 4px}.quote{border-left:3px solid var(--line);padding:4px 12px;color:var(--fg2);margin:16px 0}
table{width:100%;border-collapse:collapse;font-size:13px;margin:8px 0 16px}th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--line)}th{color:var(--fg2);font-weight:500;background:var(--soft)}
td.num{font-variant-numeric:tabular-nums;white-space:nowrap}
.tag{display:inline-block;font-size:11px;padding:1px 7px;border-radius:999px;border:1px solid var(--line);color:var(--fg2);white-space:nowrap}
.tag.cap{border-color:#bbf7d0;background:#f0fdf4;color:#166534}.tag.doc{border-color:#fde68a;background:#fefce8;color:#854d0e}.tag.counter{border-color:#fecaca;background:#fef2f2;color:#991b1b}
.refs{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.refs figure{margin:0}.refs img,.current img,.card img{width:100%;display:block;border:1px solid var(--line);border-radius:8px;background:var(--soft)}
figcaption{font-size:12px;color:var(--fg2);margin-top:6px}
.current{max-width:720px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:20px}
.card{border:1px solid var(--line);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:8px}
.card.rec{outline:2px solid var(--fg);outline-offset:-1px}
.card h4{margin:4px 0 0;font-size:15px;display:flex;gap:8px;align-items:center}
.card p{margin:0;font-size:13px;color:var(--fg2)}.card p b{color:var(--fg);font-weight:600}
.card .verdict{background:var(--soft);border-radius:8px;padding:8px 10px;color:var(--fg)}
.card .states{display:flex;gap:6px;flex-wrap:wrap}.card .states a{font-size:12px}
a{color:inherit}a.open{font-size:13px;font-weight:600}
ul{padding-left:18px}li{margin:2px 0}
.pending{border:1px dashed var(--fg3);border-radius:8px;padding:10px 14px;color:var(--fg2);margin:16px 0}
footer{margin-top:64px;padding-top:16px;border-top:1px solid var(--line);font-size:12px;color:var(--fg3)}
"""


def e(s) -> str:
    return html.escape(str(s or ""))


def shot(file: str, state: str | None = None, size: str = SHOT_SIZE) -> str:
    stem = file.removesuffix(".html")
    return f"shots/{size}/{stem}{'--' + state if state else ''}.png"


def evidence(ref: dict) -> str:
    ev = ref.get("evidence", "")
    if ev.startswith("http"):
        return f'<a href="{e(ev)}" target="_blank" rel="noopener">source</a>'
    return f'<a href="{e(ev)}" target="_blank">capture</a>' if ev else ""


def build(root: Path) -> None:
    m = json.loads((root / "redesign.json").read_text(encoding="utf-8"))
    out = []
    a = out.append
    a(f"<!doctype html><html lang=ko><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'>"
      f"<meta name=robots content=noindex><title>{e(m['title'])}</title><style>{CSS}</style><main>")
    a(f"<h1>{e(m['title'])}</h1><p class=sub>{e(m.get('app'))} · {e(m.get('date'))}</p>")
    if m.get("complaint"):
        a(f"<p class=quote>{e(m['complaint'])}</p>")
    if m.get("redteam_pending"):
        a("<div class=pending>Red team pending: verdicts and the final recommendation come after it runs.</div>")

    # Final recommendation first: it's what the reader came for.
    recs = [(p, v) for p in m["pages"] for v in p["variants"] if v.get("recommended")]
    if recs:
        a("<h2>Recommendation</h2><table><tr><th>Page</th><th>Variant</th><th>Why</th></tr>")
        for p, v in recs:
            a(f"<tr><td>{e(p['name'])}</td><td><a href='{e(v['file'])}'>{e(v['name'])}</a></td><td>{e(v.get('reason') or v.get('idea'))}</td></tr>")
        a("</table>")
    if m.get("build_order"):
        a("<h3>Build order</h3><ol>" + "".join(f"<li>{e(s)}</li>" for s in m["build_order"]) + "</ol>")

    a("<h2>Spec</h2>")
    if m.get("ia"):
        a(f"<p><b>IA</b> · {e(m['ia'])}</p>")
    if m.get("spec"):
        a("<table><tr><th>Measure</th><th>Before</th><th>After</th></tr>")
        for s in m["spec"]:
            a(f"<tr><td>{e(s['metric'])}</td><td class=num>{e(s['before'])}</td><td class=num>{e(s['after'])}</td></tr>")
        a("</table>")
    if m.get("principles"):
        a("<h3>Principles</h3><ul>" + "".join(f"<li>{e(x)}</li>" for x in m["principles"]) + "</ul>")

    if m.get("references"):
        a("<h2>References</h2><table><tr><th>Service</th><th>How it handles this</th><th>Evidence</th><th>Used by</th></tr>")
        for r in m["references"]:
            kind = "cap" if r.get("kind") == "captured" else "doc"
            tags = f"<span class='tag {kind}'>{'captured' if kind == 'cap' else 'doc-sourced'}</span>"
            if r.get("counter"):
                tags += " <span class='tag counter'>counter-example</span>"
            quote = f"<br><i>“{e(r['quote'])}”</i>" if r.get("quote") else ""
            a(f"<tr><td>{e(r['service'])}<br>{tags}</td><td>{e(r.get('how'))}{quote}</td><td>{evidence(r)}</td><td>{e(r.get('used_by'))}</td></tr>")
        a("</table>")
        caps = [r for r in m["references"] if r.get("kind") == "captured" and r.get("evidence", "").endswith(".png")]
        if caps:
            a("<div class=refs>")
            for r in caps:
                a(f"<figure><a href='{e(r['evidence'])}' target=_blank><img loading=lazy src='{e(r['evidence'])}' alt=''></a><figcaption>{e(r['service'])}</figcaption></figure>")
            a("</div>")
    if m.get("findings"):
        a("<h3>What the research says about our product</h3><ul>" + "".join(f"<li>{e(x)}</li>" for x in m["findings"]) + "</ul>")

    for p in m["pages"]:
        a(f"<h2 id='{e(p['id'])}'>{e(p['name'])}</h2>")
        if p.get("current"):
            a(f"<div class=current><a href='{e(p['current'])}' target=_blank><img loading=lazy src='{e(p['current'])}' alt=''></a><figcaption>Current</figcaption></div><h3>Variants</h3>")
        a("<div class=cards>")
        for v in p["variants"]:
            rec = " rec" if v.get("recommended") else ""
            star = " <span class=tag>recommended</span>" if v.get("recommended") else ""
            size = p.get("size", SHOT_SIZE)
            states = "".join(f"<a href='{e(shot(v['file'], s, size))}' target=_blank>{e(s)}</a>" for s in v.get("states", []))
            a(f"<article class='card{rec}'><a href='{e(v['file'])}'><img loading=lazy src='{e(shot(v['file'], None, size))}' alt=''></a>"
              f"<h4>{e(v['name'])}{star}</h4>"
              f"<p><b>Reference</b> · {e(v.get('reference'))}</p><p><b>Idea</b> · {e(v.get('idea'))}</p><p><b>Trade-off</b> · {e(v.get('tradeoff'))}</p>")
            if v.get("verdict"):
                a(f"<p class=verdict><b>Red team</b> · {e(v['verdict'])}</p>")
            if states:
                a(f"<div class=states>States: {states}</div>")
            a(f"<a class=open href='{e(v['file'])}'>Open prototype →</a></article>")
        a("</div>")

    if m.get("stories"):
        a("<h2>User stories (red team)</h2><table><tr><th>Who</th><th>Task</th><th>Gap</th><th>Fixed in</th></tr>")
        for s in m["stories"]:
            a(f"<tr><td>{e(s.get('who'))}</td><td>{e(s.get('task'))}</td><td>{e(s.get('gap'))}</td><td>{e(s.get('fixed'))}</td></tr>")
        a("</table>")
    if m.get("limits"):
        a("<h3>Limits</h3><ul>" + "".join(f"<li>{e(x)}</li>" for x in m["limits"]) + "</ul>")
    if m.get("confidential"):
        a(f"<footer>{FOOTER}</footer>")
    a("</main></html>")
    (root / "index.html").write_text("".join(out), encoding="utf-8")

    variants = [
        {"page": p["name"], "label": v["name"], "href": v["file"], "recommended": bool(v.get("recommended"))}
        for p in m["pages"] for v in p["variants"]
    ]
    (root / "assets").mkdir(exist_ok=True)
    (root / "assets" / "variants.js").write_text(
        "// Generated by tools/build_index.py from redesign.json. Don't edit.\nwindow.VARIANTS = "
        + json.dumps(variants, ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8",
    )

    missing = [x for x in [shot(v["file"], None, p.get("size", SHOT_SIZE)) for p in m["pages"] for v in p["variants"]]
               + [p["current"] for p in m["pages"] if p.get("current")]
               + [r["evidence"] for r in m.get("references", []) if r.get("evidence", "").endswith(".png")]
               if not (root / x).exists()]
    print(f"index.html: {len(m['pages'])} pages, {len(variants)} variants, {len(m.get('references', []))} references")
    for x in missing:
        print(f"MISSING IMAGE {x}")


if __name__ == "__main__":
    build(Path(sys.argv[1] if len(sys.argv) > 1 else "."))
