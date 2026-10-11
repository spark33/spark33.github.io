// @ts-check
import { defineConfig } from 'astro/config';

// User site → served at the root domain, so `site` is the bare origin and
// there is NO `base`. Static output (the default) is all GitHub Pages serves.
//
// Routing note: `/` currently redirects to `/under-construction` (see
// src/pages/index.astro). To "turn it off later" and go live with the real
// site, replace index.astro's body with the homepage and delete the
// under-construction page.
export default defineConfig({
  site: 'https://spark33.github.io',
});
