---
name: ui-redesign-variants
description: Redesign an existing web app, admin tool or site screen by screen. Capture the current screens and measure the problem in pixels, research comparable products by information architecture (including ones outside the domain), write shared tokens, a shell and principles, then build three or more clickable HTML variants per page, each modelled on a researched reference. Red-team them against real user stories at a smaller viewport, and recommend one per page on a single index page. Use when someone asks to redesign, rework the UX of, clean up, or see options for a screen or an app ("make this page better", "show me variants", "red team these").
---

# UI redesign: research → variants → red team → recommendation

The deliverable is **one index page**. For every screen it shows the current screenshot, a reference section (captured comparable products plus doc-cited patterns) and three or more variants. Each variant card names its reference, the idea, the trade-off and a red-team verdict; the recommended one is outlined. Every variant is a clickable standalone HTML prototype, and a switcher flips between them (`[` / `]`).

Written up at https://seanpark.page/writing/redesign-skill/. Every rule below exists because it was missed once.

## Non-negotiables

1. **A redesign request means prototypes, not a PR.** Don't edit the product repo until someone picks a variant and asks for implementation.
2. **Run every step, even for one page or one component.** Scale the counts down (fewer pages, fewer agents), never the steps. If a step is skipped, say so in the first line of the reply.
3. **References come from research, not memory.** Step 2 runs before any variant. Each variant's reference must point at something captured or cited there.
4. **Take the pattern, not the look.** A variant borrows a reference's IA, status model or density, in the app's own visual language.
5. **Variants differ on a named axis** (layout, the unit of the list, density, interaction model). Two variants that differ only in colour or copy are one variant.
6. **Say what you didn't do.** Mock data is labelled as mock, doc-sourced references as doc-sourced, and anything that needs backend work is marked.

## Setup

Copy `kit/` into a working folder, e.g. `redesign/<slug>/`:
- `assets/`: `tokens.css`, `shell.js`, `shell-config.js`, `data.js`, and `variants.js` (generated).
- `tools/`: `capture.mjs`, `shot.mjs`, `probe.mjs` (Node + Playwright, see `run.sh`) and `build_index.py` (Python, stdlib only).
- `PRINCIPLES.md` and `REDTEAM.md` templates.

Variants live at `pages/<page>/<letter>-<name>.html` and load `../../assets/*`. On later rounds, edit the same folder in place.

## Discover

1. **Capture the real app.** Public pages: list them in `refs.json` as `current-<page>` and run `capture.mjs` at 1440×900. A repo: build it, run its preview server, capture the localhost routes (reuse its e2e login helper if pages need a session). Logged-in screens you can't reach: ask for screenshots.
   **Measure the problem in pixels**: "the grid starts at 287px", "8 cards above the fold". Those numbers are the before/after line.
2. **Reference research.** Write the page's IA in one line ("a list of things you made + a visibility setting + a review status + favourite and ⋯ menus"). Find 6–8 products with the *same IA*, **including ones outside the domain**: dev tools, app stores, creator studios, commerce admin, file managers. Capture the public ones (`refs.json`, 1920×1080) and look at every PNG; drop error, login and bot-wall pages. For logged-in admin screens, cite the official docs, quote the rule, and label it *doc-sourced, not seen*. Include at least one **counter-example**. Note anything the research reveals about your own product (a state you hide that everyone else shows), and check it in the code before claiming it.
3. **User stories and roles.** Take personas, the end-to-end flow and role permissions from the product's own docs. If there are none, write 3–5 from the data model and mark them as assumed. Restricted roles matter most: what must they not see?
4. **Read the data model**: the types per entity, the actions in each page header, the strings. Mock data and labels must match the real fields. Relationships hint at views the current UI lacks.

## Define

5. **Write the foundation before any variant:**
   - `tokens.css`: the app's palette as-is, plus a fixed scale (spacing 4/8/12/16/24/32/48; type 12/13/14/16/20; 32px controls; 44px rows; radius 6/8; a 56px header and one 48px toolbar).
   - `shell-config.js`: **every** control the real shell has (logout, theme, font size, collapse, password change, role-based nav). Lost shell controls are the most common miss. `?role=<role>` previews a restricted role.
   - `data.js`: mock data shaped like the real types.
   - `PRINCIPLES.md`: the IA line, the measured problem, the target numbers, plus the standing rules (one `data-primary` module per page, chrome above it ≤ 104px, the module fills the viewport and scrolls inside, one filled button per page, no explanatory sentences under titles, counts in toolbar chips, colour only for meaning).
   - `redesign.json`: title, the complaint in the requester's words, IA, spec, principles, references, findings. The schema is at the top of `tools/build_index.py`.

## Develop

6. **Fan out parallel sub-agents** (three for a multi-page app, grouped by related pages; two or three for one page). Each prompt gets: the files to read first (PRINCIPLES.md, tokens, shell config, data, current PNGs, reference PNGs), the complaint in the requester's words, the user stories, and per page ≥ 3 variants, each with a reference **from step 2**, a named axis, a concrete layout and the interactions that must work. Rules for agents: don't edit `assets/`; put a header comment (reference / idea / trade-off) at the top of each file; every control works or calls `toast()`; key interactions render on load with `?state=<name>`.
   **The one-look test:** the improvement must be obvious from one glance at the screenshot.
7. **Verify.** `shot.mjs --sizes 1440x900,1280x800 pages/*/*.html`, the `#state` shots, and `probe.mjs --sizes 1280x800 pages/*/*.html`. Look at every screenshot yourself. Fix errors, copy, clipped text, CJK mid-word breaks and missing `data-primary`, then re-shoot.

## Deliver: the red team

8. **Write `REDTEAM.md`**, one line per gap (who / wants to / which variant fails / why), from the stories, the 1280×800 probe numbers, and the recurring gaps:
   - no "what needs doing next" signal (missing fields, rejected or blocked states hidden);
   - day-of or on-site use (laptop, touch, QR, presenting);
   - hover-only actions hiding the most-used action;
   - the wrong unit in a list (per organisation when the work happens per event or per month);
   - a missing start path (copy a past item, templates);
   - restricted roles seeing too much, including other people's personal reasons;
   - lost shell controls.
   Check the premise too, not only the pixels: does real usage match what every variant assumes?
9. **Build "D" variants only where a gap needs a new layout**, usually a synthesis (A's frame + C as a view + the fixes).
10. **Check privacy and role rules** with `?role=<restricted>` shots.
11. **Recommend.** In `redesign.json`: a `verdict` on every variant, `recommended` + a one-line `reason` per page, the `stories` table, a `build_order` (tokens + shell first) and `limits`. Copy the shots into `shots/`, run `python3 tools/build_index.py <dir>`, fix every `MISSING IMAGE`, and look at the index once, full page.

## Reply

Lead with the link to the index page. Then, short: which steps ran (name any skipped one), the before/after numbers, the references (captured or doc-sourced), one recommendation per page, the limits, and one closing question. The detail lives on the index page.

## Gotchas

- `assets/variants.js` is generated: add variants to `redesign.json` and rebuild, so old pages link to new ones.
- The switcher sits top centre so it never covers sticky footers. `?shot=1` hides it (the tools add it).
- Some symbol glyphs don't exist on Linux Chrome. Check icons in the shots.
- `probe.mjs`'s filled-button count is a heuristic: treat ≠ 1 as "look", not "fail".
- Full-page captures can leave lazy images blank below the fold; that's the capture, not the page.
- A multi-page app took about 35 minutes and $22 for both turns; single pages 8–22 minutes.
