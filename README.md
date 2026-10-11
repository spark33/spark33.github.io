# spark33.github.io

Sean Park's personal site. Built with [Astro](https://astro.build), deployed to
GitHub Pages by the workflow in `.github/workflows/deploy.yml` — the build runs
**in CI**, never locally on a memory-constrained host.

## Status
`/` currently redirects to `/under-construction` (a holding page). The shipped
v6 design is preserved at `/v6-preview/` as the starting point for the real
build. To go live: replace `src/pages/index.astro` with the real homepage and
remove the under-construction page (see the comments in those files).

## Develop
```
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```
