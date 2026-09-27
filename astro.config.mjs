// @ts-check
import { defineConfig } from 'astro/config';

// SITE and BASE are set by the GitHub Pages workflow (.github/workflows/deploy.yml).
// For shivaswarodaya.com later, remove BASE from the workflow (base becomes '/').
export default defineConfig({
  site: process.env.SITE || 'https://shivaswarodaya.com',
  base: process.env.BASE || '/',
  trailingSlash: 'ignore',
});
