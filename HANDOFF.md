# Delphi Hiking: EmDash site

The files here go into the `bluebellgr/delphihiking-com` repo, using the same folder paths. They turn the blog template into the Delphi Hiking site: Home, 4 hike pages, About and Contact. Everything on those pages can be edited in the EmDash admin.

## 1. Copy files into the repo

1. Copy everything in this folder into the repo root and overwrite existing files when asked.
2. **Rename** `src/pages/hikes/-slug-.astro` to `src/pages/hikes/[slug].astro`. The download can't store square brackets in file names.
3. **Delete** the blog-only files. They query the `posts` collection, which no longer exists:
   - `src/pages/posts/`, `src/pages/category/`, `src/pages/tag/`
   - `src/pages/search.astro`, `src/pages/rss.xml.ts`
   - `src/pages/pages/` (About and Contact now have their own routes)
   - `src/components/PostCard.astro`, `src/components/Byline.astro`
   - `src/utils/reading-time.ts`
4. Commit and push to `main`. The seed downloads the photos from `raw.githubusercontent.com/bluebellgr/delphihiking-com/main/public/assets/...`, so they must be pushed first (see note below).

## 2. Load the new content

EmDash only applies `seed/seed.json` to an **empty** database. Your D1 database already holds the blog seed, so you need a fresh one. Pick one of these:

**Option A: new D1 database (recommended)**
```bash
pnpm wrangler d1 create delphihiking-site
```
Paste the new `database_id` into `wrangler.jsonc` under `d1_databases`, then deploy:
```bash
pnpm install
pnpm deploy
```
Open `https://delphihiking.com/_emdash/admin`. Complete the setup wizard; the hikes, guides, pages and menu are created from the seed.

**Option B: local first**
```bash
pnpm install
pnpm dev
```
Then open http://localhost:4321/_emdash/admin. Local dev uses its own empty database, so the seed applies there.

> **Photos and a private repo:** if the GitHub repo is private, raw.githubusercontent URLs return 404 and the seed fails on images. In that case, replace `https://raw.githubusercontent.com/bluebellgr/delphihiking-com/main/public/assets/` in `seed/seed.json` with `https://delphihiking.com/assets/`. Deploy once so the files are live, then reset the database (Option A) so the seed runs again.

## 3. Contact form email

The form posts to `/api/inquiry`, which sends an email through [Resend](https://resend.com). It's free for low volume.

1. Create a Resend account and verify the `delphihiking.com` domain (add the DNS records it gives you in Cloudflare).
2. Create an API key, then:
   ```bash
   pnpm wrangler secret put RESEND_API_KEY
   ```
3. Optional settings, as plain vars in `wrangler.jsonc` → `"vars"` or in the dashboard:
   - `INQUIRY_TO`: where inquiries go (default `info@delphihiking.com`)
   - `INQUIRY_FROM`: the sender, e.g. `Delphi Hiking <bookings@delphihiking.com>`

Replies go straight to the visitor's email address.

## 4. Editing content in the admin

- **Hikes**: one entry per hike: photos, stats, story, highlights, equipment and the price table. `Order on homepage` sets the card order. The URL is `/hikes/<slug>`.
- **Guides**: name, role and photo. The first two appear on the homepage; all of them appear on About.
- **Pages**:
  - `home`: hero, intro, the "included" list (*List items*), "Not included" (*Content*) and the on-demand band (*Call-to-action*).
  - `about`: text and the YouTube link (first *List item* with a link).
  - `contact`: the email, Viber and phone entries. Items with a link also appear in the footer.
- **Menus → primary**: the header links.
- **Viber number**: still a placeholder. Edit it in Pages → contact → List items, and add a link such as `viber://chat?number=%2B30...`.

## 5. Greek version (later)

When the Greek copy is ready, enable Astro i18n (`i18n: { defaultLocale: "en", locales: ["en", "el"] }`). EmDash then stores a Greek translation of every entry, and an EN/ΕΛ switch can be added to the header. Send the copy and this can be wired up.

## What changed

| File | What it does |
| --- | --- |
| `seed/seed.json` | Schema (`tours`, `guides`, `pages`), menu, settings and all content from the zip |
| `astro.config.mjs` | Fonts are now Figtree (body) and Caprasimo (headings) |
| `src/layouts/Base.astro` | New header, navy footer; search and theme switcher removed |
| `src/styles/organic.css` | The Organic design system |
| `src/styles/site.css` | Page layouts |
| `src/styles/theme.css` | Maps the template tokens to Organic and the logo colours |
| `src/pages/index.astro`, `hikes/[slug].astro`, `about.astro`, `contact.astro`, `404.astro` | The pages |
| `src/pages/api/inquiry.ts` | Contact form handler |
| `src/components/TourCard.astro`, `Icon.astro`, `src/utils/tours.ts` | Shared pieces |
| `public/assets/tours/`, `public/assets/about/` | Your photos, resized to 1400px |
