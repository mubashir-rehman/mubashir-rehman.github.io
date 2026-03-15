# mubashir-rehman.github.io

A fully static, open source developer portfolio built with React 18, Vite, TypeScript, Tailwind CSS, and shadcn/ui. Features SSG via `vite-react-ssg`, a GitHub-style habit tracker, a personal journal with [giscus](https://giscus.app/) comments powered by GitHub Discussions, and three themes (dark / light / sakura).

**Live site:** https://mubashir-rehman.github.io

---

## ⚠️ Personal Data Notice

All personal content in `src/data/*.json` — including profile information, work experience, projects, journal entries, and habit logs — belongs solely to **Mubashir Rehman** and is **not covered by the MIT license**. If you fork this repo, replace all content in `src/data/` with your own before publishing.

The source code (components, pages, utilities, configuration) is available under the [MIT License](#license). Respective licenses of all third-party libraries apply independently.

---

## Features

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

### 3. Start the dev server

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
│   ├── main.tsx                # ViteReactSSG entry + route config
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
3. Push to `main` — the workflow runs automatically

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
2. Add the route in `src/main.tsx`:
   ```tsx
   { path: "your-page", Component: React.lazy(() => import(" @/pages/YourPage")) }
   ```
3. Add to `ssgOptions.includedRoutes` in `vite.config.ts`:
   ```ts
   "/your-page"
   ```
4. Add to `public/sitemap.xml`

---

## License

**Source code** — MIT License. See [LICENSE](./LICENSE).

**Personal content** (`src/data/*.json`) — All rights reserved. © Mubashir Rehman. Not licensed for reuse.

**Third-party libraries** — Each dependency carries its own license. See `package.json` for the full list.
