// @ts-check
import { defineConfig } from 'astro/config';

// This deploys from the repo `spark33/website`, so it's a PROJECT site served
// under a sub-path: https://spark33.github.io/website/ . Hence `base: '/website'`.
// All internal links use import.meta.env.BASE_URL so they stay correct.
//
// TO MOVE TO THE ROOT DOMAIN (https://spark33.github.io): rename the repo to
// exactly `spark33.github.io`, then change `base` below to '/' (or remove it).
// That's the only change needed — a user site must live in a repo of that name.
//
// Routing note: `/` redirects to `/under-construction` (see src/pages/index.astro).
// To go live later, replace index.astro's body with the homepage and delete the
// under-construction page.
export default defineConfig({
  site: 'https://spark33.github.io',
  base: '/website',
});
