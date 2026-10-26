# seanpark.page

Sean Park's site. Astro, static, deployed to GitHub Pages by `.github/workflows/deploy.yml`
on every push to `main` (the build runs in CI).

## Under construction

`UNDER_CONSTRUCTION` in `src/data/site.ts` puts every page behind a preview gate:
visitors are sent to `/under-construction/`. Open any page once with `?preview=<key>`
and the browser remembers it; `?preview=off` forgets. Only the key's SHA-256 is in the
repo (`PREVIEW_HASH`). It's a curtain, not a lock: the built HTML is public.

To publish: set `UNDER_CONSTRUCTION = false`.

## Where things are

- `DESIGN.md`: rules for what goes where (start with the rail)
- `src/data/site.ts`: email, links, experience table, the Baze case-study copy, sola's sample day
- `src/content/writing/*.md`: the writing. Frontmatter: title (the claim), dek, lens, status, order, tldr, project, specimen
- `src/components/LivingTitles.astro` + `src/scripts/living.ts`: titles that act out their claim
- `src/components/BazeMock.astro`: the Baze schematic (the rename, performed)
- `src/components/{SparkleDoors,AgentDay,SiteSystem}.astro`: live demos inside pieces
- `src/scripts/site.ts`: theme, the moon, the rail's section line, hover cards
- `src/styles/global.css`: one stylesheet; motion tokens at the top
- `public/v6-preview/`: the old v6 design, kept for reference

## Search and AI answers (SEO / AEO / GEO)

- `src/lib/seo.ts`: who's indexable, and the JSON-LD graph (Person, WebSite, Mindlogic, Baze,
  ProfilePage / Article / BlogPosting, breadcrumbs). Facts about Sean live in `PERSON` in `src/data/site.ts`.
- `src/lib/llms.ts`: `/llms.txt`, `/llms-full.txt` and `/writing/<slug>.md`, the site in plain text for AI engines.
- `/robots.txt` (all crawlers welcome, AI bots named), `/sitemap.xml`, `/rss.xml`: generated in `src/pages/`.
- A piece goes public when it gets `published: YYYY-MM-DD` in its frontmatter. Until then it's a
  draft: listed on the home page, but noindex and left out of the sitemap, feed and llms.txt.
- While `UNDER_CONSTRUCTION` is true every page is noindex except `/under-construction/`, which carries
  the Person entity so a search for Sean already finds the right one. At launch it flips to noindex.
- `public/og.png` (1200×630 share image) is a Chrome screenshot of `scripts/og.html`.
- Each piece has its own share card, `public/og/<slug>.jpg` and `public/og/ko/<slug>.jpg`: its title and dek on the
  paper, made by `node scripts/og.mjs` (template `scripts/og-post.html`; run it on CI). Rerun it when a title or dek
  changes or a piece is added; the e2e suite fails if a piece has no card.
- `public/work/baze/`: real Baze screens, captured from baze.co's own app stills (Oct 2026).
