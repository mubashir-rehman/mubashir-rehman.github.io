# mubashir-rehman.github.io

A fully static, open source developer portfolio built with Astro 5, TypeScript, and Tailwind CSS. Every route is a real Astro page rendered to HTML at build time from JSON data — React survives only as a couple of tiny islands (an AI chatbot and a theme toggle). Features an "Ask Me Anything" chatbot whose grounding is generated from the site's own data at build time, role-targeted hire-me pages, a Markdown journal, and light / dark themes.

**Live site:** https://mubashir-rehman.is-a.dev

---

## ⚠️ Personal Data Notice

All personal content in `src/data/*.json` — including profile information, work experience, projects, journal entries, and habit logs — belongs solely to **Mubashir Rehman** and is **not covered by the MIT license**. If you fork this repo, replace all content in `src/data/` with your own before publishing.

The source code (components, pages, utilities, configuration) is available under the [MIT License](#license). Respective licenses of all third-party libraries apply independently.

---

## Features

- 🤖 **AI chatbot** — floating "Ask Me Anything" assistant powered by Groq (llama-3.3-70b). Its system prompt is **generated at build time** from `profile.json` / `projects.json` / `roles.json`, so the answers can never drift from the site's content
- ⚡ **Static Site Generation** — every page pre-rendered at build time via Astro (`output: "static"`), no server needed
- 🏝️ **Islands, not an SPA** — the shipped JS is just the chatbot and the theme toggle; navigation is plain MPA links with Astro's `<ClientRouter />` view transitions
- 🎯 **Role-targeted landing pages** — `/for/<role>/` pages generated from `roles.json`, each with its own tailored résumé PDF
- ✍️ **Journal** — Markdown entries rendered to static HTML at build time (zero client JS)
- 🎨 **Two themes** — light and dark, with a no-FOUC inline theme script
- 🔍 **SEO ready** — canonical URLs, Open Graph, Twitter Card, JSON-LD structured data, auto-generated sitemap, `llms.txt` for AI crawlers
- 🚀 **Auto deploy** — GitHub Actions deploys to GitHub Pages on every push to `main`
- 📱 **Responsive** — mobile-first, with a mobile bottom nav

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 (static output) |
| Interactivity | React 18 islands (`AskMe`, `ThemeToggle`) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 (+ `@tailwindcss/typography`) |
| Animation | Framer Motion (chatbot only) + CSS scroll-reveal |
| Routing | Astro file-based MPA + `<ClientRouter />` view transitions |
| SEO | Static `<head>` emitted by `src/layouts/Base.astro` |
| Markdown | react-markdown, rendered at build time |
| Icons | lucide-react |
| AI Chatbot | Groq API (llama-3.3-70b-versatile) |
| Deploy | GitHub Pages + GitHub Actions |

---

## Getting Started

### Prerequisites

- Node.js 20+ (CI uses Node 22)
- npm

### 1. Clone the repo

```bash
git clone https://github.com/mubashir-rehman/mubashir-rehman.github.io.git
cd mubashir-rehman.github.io
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Then fill in your values in `.env`:

```env
# Groq API key — get a free key at https://console.groq.com
PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

> **Note:** Astro exposes client-side env vars only when prefixed with `PUBLIC_` (read via `import.meta.env.PUBLIC_*`). They are baked into the JS bundle at build time — there is no runtime server. The Groq API key will be visible in the compiled output; Groq's free-tier rate limits provide natural abuse protection.
>
> In CI the GitHub Actions secret is still named `VITE_GROQ_API_KEY` and the workflow maps it onto `PUBLIC_GROQ_API_KEY` at build time — so keep the **secret** name as `VITE_*` but use `PUBLIC_*` in your local `.env`.
>
> `.env.example` also lists `PUBLIC_GISCUS_*` variables. These are leftovers from a removed comments feature and are not read by any code.

### 4. Start the dev server

```bash
npm run dev
```

The site runs at `http://localhost:4321` (Astro's default dev port).

---

## Customising for Your Own Portfolio

All personal content lives in `src/data/`. Edit these JSON files — the pages (and the chatbot's system prompt) are built from them.

### `src/data/profile.json`
Your name, tagline, bio, skills, work experience, education, publications, metrics, and social links.

```jsonc
{
  "name": "Your Name",
  "tagline": "Your tagline",
  "email": "you@example.com",
  "bio": "...",
  "skills": { "Backend": ["Python", "Django"] },
  "experience": [...],
  "socialLinks": {
    "github": "https://github.com/your-username",
    "linkedin": "https://linkedin.com/in/your-username"
  }
}
```

### `src/data/projects.json`
Each project entry:

```jsonc
{
  "id": "my-project",
  "title": "Project Title",
  "description": "What it does and key achievements.",
  "tags": ["Python", "FastAPI"],
  "github": "https://github.com/you/project",
  "demo": "https://project.com",
  "featured": true,
  "metrics": ["10K users", "99.9% uptime"]
}
```

### `src/data/roles.json`
Drives the `/for/<slug>/` hire-me pages — one page is generated per entry, each pointing at its own résumé PDF in `public/resume/`:

```jsonc
{
  "slug": "backend",
  "label": "Backend Engineer",
  "tagline": "One line on why you fit this role.",
  "resume": "/resume/Your-Name-Backend.pdf"
}
```

### `src/data/journal.json`
Journal entries with Markdown content:

```jsonc
{
  "slug": "my-first-post",
  "title": "My First Post",
  "date": "2026-03-15",
  "excerpt": "A short summary shown on the journal list.",
  "tags": ["Personal", "Engineering"],
  "content": "# Heading\n\nMarkdown content here..."
}
```

New entries go at the **top** of the array so they appear first.

### Sitemap
The sitemap is generated automatically at build by `@astrojs/sitemap` (output `dist/public/sitemap-index.xml` + `sitemap-0.xml`) — no manual editing needed.

---

## Setting Up the AI Chatbot (AskMe)

The floating "Ask Me Anything" button is powered by [Groq](https://console.groq.com/) — a free, fast inference API. No backend required; the request is made directly from the browser.

### Steps

1. **Get a free Groq API key** at https://console.groq.com/

2. **Add it to your `.env`:**
   ```env
   PUBLIC_GROQ_API_KEY=gsk_your_key_here
   ```

3. **Add it as a GitHub Actions secret** so CI builds can embed it:
   - Go to your repo → `Settings → Secrets and variables → Actions`
   - Click **New repository secret**
   - Name: `VITE_GROQ_API_KEY`, Value: your key (the workflow maps this secret onto `PUBLIC_GROQ_API_KEY` at build time)

4. **Don't hand-write the system prompt.** It is assembled at build time by `src/lib/askmePrompt.ts` from `profile.json`, `projects.json` and `roles.json`, and passed into the island as a prop by `PageLayout.astro`. Update the JSON and the chatbot updates with it. Only edit `askmePrompt.ts` if you want to change the prompt's *structure* or rules.

5. **Update the suggested questions** in the `SUGGESTED_QUESTIONS` array at the top of `src/components/AskMe.tsx` to reflect your own background.

> The chatbot is instructed to only answer questions based on the generated context and to redirect off-topic questions. It keeps conversation history within the session (and across page navigations).

---

## Contact

There is no contact form and no form backend. `/contact/` links straight out to email (`mailto:`), WhatsApp, and LinkedIn, all read from `src/data/profile.json`. To change them, edit `profile.json`.

---

## Project Structure

```
├── public/                     # Static assets (copied to the build root as-is)
│   ├── fonts/                  # Self-hosted Inter + JetBrains Mono woff2
│   ├── resume/                 # Résumé PDFs linked from the /for/<role>/ pages
│   ├── llms.txt                # Site summary for AI crawlers
│   ├── robots.txt
│   ├── favicon.svg
│   └── og-image.png            # Open Graph / social preview image
│
├── src/
│   ├── pages/                  # ← Astro routes — the real pages (static HTML)
│   │   ├── index.astro         # /
│   │   ├── about.astro         # /about/
│   │   ├── projects.astro      # /projects/
│   │   ├── services.astro      # /services/
│   │   ├── journal.astro       # /journal/
│   │   ├── journal/[slug].astro# /journal/<slug>/ (from journal.json)
│   │   ├── for/[role].astro    # /for/<role>/    (from roles.json)
│   │   ├── contact.astro       # /contact/
│   │   └── 404.astro           # 404
│   │
│   ├── layouts/
│   │   ├── Base.astro          # <head>: title, OG/Twitter, canonical, JSON-LD, theme FOUC guard
│   │   └── PageLayout.astro    # Base + ClientRouter, skip link, Navbar/Footer/BottomNav, AskMe island
│   │
│   ├── components/
│   │   ├── astro/              # ← Presentational Astro components (zero client JS)
│   │   │   ├── Navbar.astro
│   │   │   ├── BottomNav.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Section.astro  Card.astro  ProjectCard.astro
│   │   │   └── RoleCard.astro  Badge.astro  Metric.astro
│   │   ├── AskMe.tsx           # React island — AI chatbot (client:idle)
│   │   ├── ThemeToggle.tsx     # React island — light/dark toggle (client:load)
│   │   └── Markdown.tsx        # React, NO client directive → rendered to HTML at build
│   │
│   ├── lib/
│   │   └── askmePrompt.ts      # Builds the chatbot system prompt from the JSON at build time
│   │
│   ├── data/                   # ← ALL personal content lives here
│   │   ├── profile.json        # Bio, skills, experience, education, links
│   │   ├── projects.json       # Project cards
│   │   ├── journal.json        # Journal entries (Markdown)
│   │   └── roles.json          # Hire-me role tracks → /for/<slug>/ pages
│   │
│   ├── env.d.ts                # Types for PUBLIC_* env vars
│   └── index.css               # Design tokens (CSS custom properties) + self-hosted @font-face
│
├── archive/hobbies/            # Removed Hobbies page + its data, kept for reference
├── .github/workflows/deploy.yml  # GitHub Actions deploy pipeline (static.yml is an identical duplicate)
├── astro.config.mjs              # static output → dist/public, trailingSlash: "always", sitemap, @ alias
├── tailwind.config.ts            # Tailwind theme tokens
└── package.json
```

> **Leftovers:** `index.html` at the repo root, `public/giscus-*.css` and `components.json` are unused remnants of earlier iterations (a Vite SPA, giscus comments, shadcn/ui). They are not referenced by the build.

---

## Build

```bash
# Production build (SSG)
npm run build

# Output is in dist/public/
# This is what GitHub Actions uploads to GitHub Pages
```

```bash
# Preview the production build locally
npm run preview
```

```bash
# Run tests
npm test
```

> **Heads-up:** `vitest.config.ts` currently imports `@vitejs/plugin-react-swc`, which is not installed (`@vitejs/plugin-react` is), so `npm test` fails to load its config. Fix the import or add the dependency before relying on the suite.

---

## URL Conventions (important)

The site builds with `trailingSlash: "always"`, because GitHub Pages serves directory-format URLs (`/about/` → `about/index.html`) and 301-redirects the slash-less form. So:

- every internal link, every `canonicalPath`, and every absolute URL inside JSON-LD ends with `/`;
- **except** links to files with an extension (`/resume/foo.pdf`), which never get one.

Keeping these consistent is what makes each page's `<link rel="canonical">` byte-identical to its `<loc>` in the sitemap.

---

## Deploying to GitHub Pages

This repo is pre-configured for automated GitHub Pages deployment.

### Automatic deploy (recommended)

Every push to `main` triggers the GitHub Actions workflow at `.github/workflows/deploy.yml`, which:
1. Installs dependencies (`npm ci`)
2. Builds the site (`npm run build`)
3. Uploads `dist/public/` as the Pages artifact
4. Deploys to GitHub Pages

**One-time setup:**
1. Go to your repo → `Settings → Pages`
2. Under **Source**, select **GitHub Actions**
3. Add the required secret under `Settings → Secrets and variables → Actions`:
   - `VITE_GROQ_API_KEY` — your Groq API key
4. Push to `main` — the workflow runs automatically

Your site will be live at `https://your-username.github.io` within ~2 minutes.

### Custom domain (optional)

1. Add a `CNAME` file to the `public/` directory containing your domain:
   ```
   yourdomain.com
   ```
2. Configure your DNS provider to point to GitHub Pages
3. Enable HTTPS in `Settings → Pages → Enforce HTTPS`
4. Update `site` in `astro.config.mjs` and the `SITE` constant in `src/layouts/Base.astro` so canonicals, OG URLs and the sitemap point at your domain

> This site uses `https://mubashir-rehman.is-a.dev`; the `mubashir-rehman.github.io` URL 301-redirects to it, and non-canonical hosts are served with `noindex`.

---

## Adding a New Page

One file. Create `src/pages/your-page.astro`:

```astro
---
import PageLayout from "@/layouts/PageLayout.astro";
import profile from "@/data/profile.json";
---
<PageLayout
  title="Your Page"
  description="Under 155 characters — Google truncates past that."
  canonicalPath="/your-page/"
>
  <h1>Your Page</h1>
  <p>{profile.tagline}</p>
</PageLayout>
```

House rules for a new page:

- one `<h1>`, meta description ≤ 155 chars, title ≤ 60 chars (`Base.astro` appends the site name);
- `canonicalPath` and all internal links carry a trailing slash;
- content comes from `src/data/*.json` — don't hand-duplicate taglines or bios;
- images go in `src/assets/` and render through Astro's built-in `<Image />` (`astro:assets`), never a raw `<img>` from `public/`;
- after `npm run build`, confirm the route is in `dist/public/sitemap-0.xml` and its canonical matches that `<loc>` exactly.

The sitemap updates automatically on the next build (`@astrojs/sitemap`).

---

## Setting Up Google Search Console

Verifying your site with [Google Search Console](https://search.google.com/search-console) lets you monitor search performance, submit your sitemap, and spot indexing issues.

### Verification (HTML file method — already used in this repo)

1. Go to https://search.google.com/search-console and add your property URL
2. Choose **HTML file** verification
3. Download the verification file (e.g. `google970de44929ca96e5.html`)
4. Place it in the `public/` directory — Astro copies everything in `public/` to the build root, so it will be served at the site root
5. Push to `main` and wait for CI to deploy, then click **Verify** in Search Console

### Submit your sitemap

Once verified, submit your sitemap for faster indexing:

1. In Search Console go to **Sitemaps**
2. Enter `sitemap-index.xml` and click **Submit**

> The sitemap is generated automatically by `@astrojs/sitemap` on every build — no manual maintenance needed.

---

## License

**Source code** — MIT License. See [LICENSE](./LICENSE).

**Personal content** (`src/data/*.json`) — All rights reserved. © Mubashir Rehman. Not licensed for reuse.

**Third-party libraries** — Each dependency carries its own license. See `package.json` for the full list.
