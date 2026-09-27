# shivaswarodaya.com

The website for Shiva Swarodaya and Swara Yoga with Ma Shakti Devpriya, built with [Astro](https://astro.build).

## Preview the site (no installation needed)

Double-click **Open Website Preview.html** in this folder. It opens the full site in your browser, and every menu link works.

The files it shows are in the `preview/` folder. Claude rebuilds that folder after each round of changes, so the preview is always the latest version. An internet connection is needed for the fonts.

### Optional: live preview while editing

If Node.js (LTS, from https://nodejs.org) is installed later, double-click `preview.bat`. It runs a live preview at http://localhost:4321 that updates as files change.

## Where things live

| What | Where |
| --- | --- |
| Colours, fonts, buttons | `src/styles/global.css` |
| Header / menu, footer | `src/components/Header.astro`, `Footer.astro` |
| Animated home hero | `src/components/HeroAnimated.astro` (layers in `public/images/hero/`) |
| Pages | `src/pages/` (each file is one page; `courses/` holds the course pages) |
| Blog posts | `src/content/blog/` |
| YouTube videos | `src/content/videos/` |
| Calendar entries | `src/content/events/` |
| Images | `public/images/` |

## Social media links and contact email

Open `src/data/site.ts` and paste each link between the quotes, for example `href: 'https://www.youtube.com/@...'`. A link left as `''` hides that icon everywhere. The icons appear in the footer of every page and on the Contact page.

## Adding content

Blog posts, videos and events are plain text files. Copy the `_example.md` file in the folder, rename it without the underscore, and edit the details at the top. Files whose names start with `_` are ignored.

For a video, `youtubeId` is the part after `v=` in the YouTube link.

## Replacing the hero images with high-resolution versions

The home hero is built from four images in `public/images/hero/`, all 16:9 and exactly the same size:

- `layer-logo.webp`: the emblem only, transparent everywhere else
- `layer-ma.webp`: Ma's portrait only, transparent everywhere else
- `layer-name.webp`: माँ Shakti Devpriyā only, transparent everywhere else
- `banner-full.webp`: the complete banner

The best source is the designer's layered file (Photoshop or Canva), exported as these four layers at 2400 × 1350 px. Keep the file names the same.

`public/images/ma-portrait.webp` is the portrait used lower down the home page.

## Publishing

For the review site on GitHub Pages, follow **GITHUB-STEPS.md**.


`npm run build` creates the finished site in `dist/`. That folder can be hosted on Netlify, Cloudflare Pages or Vercel. Connecting a hosting service to a GitHub copy of this folder also gives an automatic preview link for every change.
