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

- `src/data/site.ts`: email, links, experience table, the Baze case-study copy, sola's sample day
- `src/content/writing/*.md`: the writing. Frontmatter: title (the claim), dek, lens, status, order, tldr, project, specimen
- `src/components/LivingTitles.astro` + `src/scripts/living.ts`: titles that act out their claim
- `src/components/BazeMock.astro`: the Baze schematic (the rename, performed)
- `src/components/{SparkleDoors,AgentDay,SiteSystem}.astro`: live demos inside pieces
- `src/scripts/site.ts`: theme, the moon, the rail's section line, hover cards
- `src/styles/global.css`: one stylesheet; motion tokens at the top
- `public/v6-preview/`: the old v6 design, kept for reference
