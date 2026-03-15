# mubashir-rehman.github.io

A fully static, open source developer portfolio built with React 18, Vite, TypeScript, Tailwind CSS, and shadcn/ui. Features SSG via `vite-react-ssg`, a GitHub-style habit tracker, a personal journal with [giscus](https://giscus.app/) comments powered by GitHub Discussions, and three themes (dark / light / sakura).

**Live site:** https://mubashir-rehman.github.io

---

## ⚠️ Personal Data Notice

All personal content in `src/data/*.json` — including profile information, work experience, projects, journal entries, and habit logs — belongs solely to **Mubashir Rehman** and is **not covered by the MIT license**. If you fork this repo, replace all content in `src/data/` with your own before publishing.

The source code (components, pages, utilities, configuration) is available under the [MIT License](#license). Respective licenses of all third-party libraries apply independently.

---

## Features

- 🤖 **AI chatbot** — floating "Ask Me Anything" assistant powered by Groq (llama-3.3-70b), answers questions about skills, experience, and projects based on injected resume context
- ⚡ **Static Site Generation** — pre-rendered at build time via `vite-react-ssg`, no server needed
- 🎨 **Three themes** — dark, light, and sakura (cherry blossom spring theme) with smooth cycling
- 📊 **GitHub-style habit tracker** — contribution grids with month labels, streaks, radar chart overview, year switcher
- ✍️ **Journal** — Markdown-rendered entries with [giscus](https://giscus.app/) comments via GitHub Discussions
- 📬 **Contact form** — powered by [Formspree](https://formspree.io/), zero backend
- 🔍 **SEO ready** — canonical URLs, Open Graph, Twitter Card, JSON-LD structured data, sitemap
- 🚀 **Auto deploy** — GitHub Actions deploys to GitHub Pages on every push to `main`
- 📱 **Responsive** — mobile-first, works across all screen sizes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 + vite-react-ssg |
| Styling | Tailwind CSS v3 + shadcn/ui |
| Animation | Framer Motion |
| Routing | react-router-dom v6 |
| SEO | react-helmet-async |
| Comments | @giscus/react |
| AI Chatbot | Groq API (llama-3.3-70b-versatile) |
| Contact | Formspree |
| Deploy | GitHub Pages + GitHub Actions |

---

## Getting Started

### Prerequisites

- Node.js 20+
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
VITE_GROQ_API_KEY=your_groq_api_key_here

# Giscus — get values at https://giscus.app/
VITE_GISCUS_REPO=your-username/your-repo
VITE_GISCUS_REPO_ID=your_repo_id
VITE_GISCUS_CATEGORY=General
VITE_GISCUS_CATEGORY_ID=your_category_id
```

> **Note:** All `VITE_` variables are baked into the JS bundle at build time by Vite — there is no runtime server. The Groq API key will be visible in the compiled output; Groq's free-tier rate limits provide natural abuse protection.

### 4. Start the dev server

```bash
npm run dev
```

The site runs at `http://localhost:5000`.

---

## Customising for Your Own Portfolio

All personal content lives in `src/data/`. Edit these JSON files — the UI updates automatically.

### `src/data/profile.json`
Your name, bio, skills, work experience, education, publications, and social links.

```jsonc
{
  "name": "Your Name",
  "tagline": "Your tagline",
  "email": "you @example.com",
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

### `src/data/habits.json`
Each habit has a name, emoji, and a log of completed dates:

```jsonc
{
  "habit": "Read 30 mins",
  "emoji": "📚",
  "log": {
    "2026-03-14": true,
    "2026-03-13": true
  }
}
```

> **Tip:** The "Journal entry" habit is special — it automatically reads dates from `journal.json` and lights up the corresponding days on the grid. No manual logging needed for that habit.

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

### `src/data/anime.json` / `src/data/books.json`
Lists shown on the Hobbies page. Edit freely.

### `public/sitemap.xml`
Update manually whenever you add new pages or journal entries.

---

## Setting Up Giscus Comments

Journal posts support comments via [giscus](https://giscus.app/), which stores comments as GitHub Discussion threads.

### Steps

1. **Enable GitHub Discussions** on your repo:
   `Settings → Features → check Discussions`

2. **Install the giscus GitHub App** on your repo:
   https://github.com/apps/giscus

3. **Get your config values:**
   - Go to https://giscus.app/
   - Enter your repo name
   - Set mapping to **pathname**
   - Create a Discussion category called `Blog Comments` (use **Announcements** type)
   - Copy the generated `data-repo-id` and `data-category-id` values

4. **Update `src/components/Comments.tsx`:**

```tsx
<Giscus
  repo="your-username/your-repo"
  repoId="YOUR_REPO_ID"          // paste here
  category="Blog Comments"
  categoryId="YOUR_CATEGORY_ID"  // paste here
  ...
/>
```

5. **Update the `THEME_BASE_URL`** constant in `Comments.tsx` to your live domain:

```tsx
const THEME_BASE_URL = "https://your-username.github.io";
```

The three custom CSS theme files (`public/giscus-dark.css`, `giscus-light.css`, `giscus-sakura.css`) are already included and will automatically match your site's active theme.

---

## Setting Up the AI Chatbot (AskMe)

The floating "Ask Me Anything" button is powered by [Groq](https://console.groq.com/) — a free, fast inference API. No backend required; the request is made directly from the browser.

### Steps

1. **Get a free Groq API key** at https://console.groq.com/

2. **Add it to your `.env`:**
   ```env
   VITE_GROQ_API_KEY=gsk_your_key_here
   ```

3. **Add it as a GitHub Actions secret** so CI builds can embed it:
   - Go to your repo → `Settings → Secrets and variables → Actions`
   - Click **New repository secret**
   - Name: `VITE_GROQ_API_KEY`, Value: your key

4. **Update the system prompt** in `src/components/AskMe.tsx` — replace the `--- CONTEXT START ---` block with your own resume text and project descriptions. The more detail you provide, the better the answers.

5. **Update the suggested questions** in the `SUGGESTED_QUESTIONS` array at the top of `AskMe.tsx` to reflect your own background.

> The chatbot is instructed to only answer questions based on the injected context and to redirect off-topic questions. It maintains full conversation history within the session.

---

## Setting Up the Contact Form

The contact form uses [Formspree](https://formspree.io/) — no backend or server required.

### Steps

1. **Create a free Formspree account** at https://formspree.io/

2. **Create a new form** in your Formspree dashboard
   - You'll get a form endpoint URL like `https://formspree.io/f/xxxxxxxx`

3. **Update `src/pages/Contact.tsx`** — replace the existing endpoint:

```tsx
const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
```

That's it. Form submissions will be delivered to your Formspree-linked email.

---

## Project Structure

```
├── public/                     # Static assets (served at root)
│   ├── giscus-dark.css         # Giscus theme — dark
│   ├── giscus-light.css        # Giscus theme — light
│   ├── giscus-sakura.css       # Giscus theme — sakura
│   ├── robots.txt
│   ├── sitemap.xml             # Update manually when adding pages/entries
│   └── 404.html                # SPA fallback for GitHub Pages
│
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives (auto-generated, don't edit)
│   │   ├── AskMe.tsx           # Floating AI chatbot (Groq-powered)
│   │   ├── Comments.tsx        # Giscus comments widget
│   │   ├── Footer.tsx          # Footer with sakura road scene
│   │   ├── Navbar.tsx          # Navigation with theme cycler
│   │   ├── SEO.tsx             # Per-page helmet tags
│   │   ├── SakuraPetals.tsx    # Falling petal animation (sakura theme only)
│   │   ├── ThemeProvider.tsx   # dark / light / sakura theme context
│   │   └── ...
│   │
│   ├── data/                   # ← ALL personal content lives here
│   │   ├── profile.json        # Bio, skills, experience, education
│   │   ├── projects.json       # Project cards
│   │   ├── journal.json        # Blog/journal entries (Markdown)
│   │   ├── habits.json         # Habit tracker logs
│   │   ├── anime.json          # Hobbies — anime list
│   │   ├── books.json          # Hobbies — books list
│   │   └── fortyRules.json     # Forty Rules of Love quotes (footer)
│   │
│   ├── pages/
│   │   ├── Landing.tsx         # Home /
│   │   ├── About.tsx           # /about
│   │   ├── Projects.tsx        # /projects
│   │   ├── Habits.tsx          # /habits — GitHub-style tracker + radar chart
│   │   ├── Journal.tsx         # /journal and /journal/:slug
│   │   ├── Hobbies.tsx         # /hobbies
│   │   ├── Contact.tsx         # /contact — Formspree form
│   │   └── NotFound.tsx        # 404
│   │
│   ├── main.tsx                # ViteReactSSG entry, route config, stale-chunk recovery (lazyWithReload)
│   ├── App.tsx                 # Shell layout (Navbar + Outlet + Footer)
│   └── index.css               # Design tokens (CSS custom properties)
│
├── .github/workflows/static.yml  # GitHub Actions deploy pipeline
├── vite.config.ts                # Vite + SSG config
├── tailwind.config.ts            # Tailwind theme tokens
└── package.json
```

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

> **Stale chunk recovery:** After a new deploy, Vite renames all JS chunks with a fresh content hash. Visitors with cached old HTML would normally see "Failed to fetch dynamically imported module". Two guards in `main.tsx` handle this automatically — `lazyWithReload` catches the chunk 404 and performs one silent hard-reload, and a `fetch` monkey-patch handles the SSG manifest mismatch. Visitors see a ~1s spinner, then land on the fresh page with no error.

---

## Deploying to GitHub Pages

This repo is pre-configured for automated GitHub Pages deployment.

### Automatic deploy (recommended)

Every push to `main` triggers the GitHub Actions workflow at `.github/workflows/static.yml`, which:
1. Installs dependencies (`npm ci`)
2. Builds the site (`npm run build`)
3. Uploads `dist/public/` as the Pages artifact
4. Deploys to GitHub Pages

**One-time setup:**
1. Go to your repo → `Settings → Pages`
2. Under **Source**, select **GitHub Actions**
3. Add all required secrets under `Settings → Secrets and variables → Actions`:
   - `VITE_GROQ_API_KEY` — your Groq API key
   - `VITE_GISCUS_REPO`, `VITE_GISCUS_REPO_ID`, `VITE_GISCUS_CATEGORY`, `VITE_GISCUS_CATEGORY_ID` — your Giscus config
4. Push to `main` — the workflow runs automatically

Your site will be live at `https://your-username.github.io` within ~2 minutes.

### Custom domain (optional)

1. Add a `CNAME` file to the `public/` directory containing your domain:
   ```
   yourdomain.com
   ```
2. Configure your DNS provider to point to GitHub Pages
3. Enable HTTPS in `Settings → Pages → Enforce HTTPS`

---

## Adding a New Page

1. Create `src/pages/YourPage.tsx`
2. Add the route in `src/main.tsx` — use `lazyWithReload` (not `React.lazy`) so stale-chunk recovery applies:
   ```tsx
   { path: "your-page", Component: lazyWithReload(() => import("@/pages/YourPage")) }
   ```
3. Add to `ssgOptions.includedRoutes` in `vite.config.ts`:
   ```ts
   "/your-page"
   ```
4. Add to `public/sitemap.xml`

---

## Setting Up Google Search Console

Verifying your site with [Google Search Console](https://search.google.com/search-console) lets you monitor search performance, submit your sitemap, and spot indexing issues.

### Verification (HTML file method — already used in this repo)

1. Go to https://search.google.com/search-console and add your property URL (`https://your-username.github.io`)
2. Choose **HTML file** verification
3. Download the verification file (e.g. `google970de44929ca96e5.html`)
4. Place it in the `public/` directory — Vite copies everything in `public/` to the build root, so it will be served at `https://your-username.github.io/google970de44929ca96e5.html`
5. Push to `main` and wait for CI to deploy, then click **Verify** in Search Console

### Submit your sitemap

Once verified, submit your sitemap for faster indexing:

1. In Search Console go to **Sitemaps**
2. Enter `sitemap.xml` and click **Submit**

> Remember to keep `public/sitemap.xml` up to date whenever you add new pages or journal entries — it is static and not auto-generated.

---

## License

**Source code** — MIT License. See [LICENSE](./LICENSE).

**Personal content** (`src/data/*.json`) — All rights reserved. © Mubashir Rehman. Not licensed for reuse.

**Third-party libraries** — Each dependency carries its own license. See `package.json` for the full list.
