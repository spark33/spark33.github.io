// @ts-check
import { defineConfig } from 'astro/config';
import sidenotes from './src/lib/sidenotes.mjs';

// This is the USER site — repo `spark33/spark33.github.io` — served at the root
// domain https://seanpark.page/ (custom domain; public/CNAME), so there is NO `base`. Internal links use
// import.meta.env.BASE_URL ('/'), so they're correct either way.
//
// Under construction: every page is behind a preview gate (src/data/site.ts,
// UNDER_CONSTRUCTION + PREVIEW_HASH; the check runs in src/layouts/Base.astro).
// To go live, set UNDER_CONSTRUCTION = false.
export default defineConfig({
  site: 'https://seanpark.page',
  // writing: footnotes become margin notes, outside links open in a new tab (see the file)
  markdown: { rehypePlugins: [sidenotes], shikiConfig: { themes: { light: 'min-light', dark: 'min-dark' } } },
});
