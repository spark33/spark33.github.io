// @ts-check
import { defineConfig } from 'astro/config';

// This is the USER site — repo `spark33/spark33.github.io` — served at the root
// domain https://seanpark.page/ (custom domain; public/CNAME), so there is NO `base`. Internal links use
// import.meta.env.BASE_URL ('/'), so they're correct either way.
//
// Routing note: `/` redirects to `/under-construction` (see src/pages/index.astro).
// To go live later, replace index.astro's body with the homepage and delete the
// under-construction page.
export default defineConfig({
  site: 'https://seanpark.page',
});
