# Portfolio Website - Project Context

## Project Overview

Personal portfolio website for **Mubashir Rehman**, a Backend-focused Software Engineer specializing in AI/ML, Cloud, and Systems.

**Site:** https://mubashir-rehman.is-a.dev

## Tech Stack (Current)

- **Framework:** Astro 5.x (migrated from Vite React SSG)
- **UI:** React 18 islands via `@astrojs/react`
- **Styling:** Tailwind CSS 3.x via `@astrojs/tailwind`
- **Components:** shadcn/ui + Radix UI primitives
- **Routing:** Astro file-based routing (`.astro` pages)
- **Animations:** Framer Motion
- **State:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **Testing:** Vitest + React Testing Library
- **Icons:** Lucide React

## Key Dependencies

```
astro: ^5.18.1
@astrojs/react: ^5.0.2
@astrojs/tailwind: ^5.1.0
@astrojs/sitemap: ^3.7.2
react: ^18.3.1
react-dom: ^18.3.1
framer-motion: ^12.35.1
```

## Project Structure

```
portfolio-website/
├── src/
│   ├── components/       # React + Astro components
│   │   ├── ReactApp.tsx  # Main React app wrapper
│   │   ├── Comments.tsx  # Giscus comments (uses PUBLIC_GISCUS_*)
│   │   ├── AskMe.tsx     # AI chat (uses PUBLIC_GROQ_API_KEY)
│   │   └── ui/          # shadcn/ui components
│   ├── data/            # JSON content files
│   │   ├── profile.json
│   │   ├── projects.json
│   │   ├── journal.json
│   │   ├── habits.json
│   │   ├── books.json
│   │   ├── anime.json
│   │   └── fortyRules.json
│   ├── layouts/
│   │   └── Base.astro   # HTML shell with SEO/structured data
│   └── pages/
│       ├── index.astro
│       ├── about.astro
│       ├── projects.astro
│       ├── hobbies.astro
│       ├── habits.astro
│       ├── journal.astro
│       ├── journal/[slug].astro
│       ├── contact.astro
│       └── 404.astro
├── .github/workflows/
│   ├── deploy.yml       # GitHub Pages deployment (primary)
│   └── static.yml       # Alternative deployment
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Commands

```bash
npm run dev       # astro dev
npm run build     # astro build
npm run preview   # astro preview
npm run lint      # eslint .
npm test          # vitest run
npm run test:watch # vitest
```

## Build Output

- Output directory: `dist/public`
- Site base URL: `https://mubashir/rehman.is-a.dev`

## Environment Variables

Astro uses `PUBLIC_` prefix for client-exposed env vars:

- `PUBLIC_GISCUS_REPO` - Giscus repo name
- `PUBLIC_GISCUS_REPO_ID` - Giscus repo ID
- `PUBLIC_GISCUS_CATEGORY` - Giscus discussion category
- `PUBLIC_GISCUS_CATEGORY_ID` - Giscus category ID
- `PUBLIC_GROQ_API_KEY` - Groq AI API key (used in AskMe.tsx)

GitHub Actions secrets use `VITE_*` prefix (legacy naming), mapped to `PUBLIC_*` in workflow.

## Deployment

- **Platform:** GitHub Pages
- **Node.js:** 22+ required (Astro 5/6 requirement)
- **Workflow:** `.github/workflows/deploy.yml`
- **Artifact path:** `dist/public`

## Migration History

Last major commit migrated from `vite-react-ssg` to Astro:
- Removed: `vite.config.ts`, `src/main.tsx`, `tsconfig.app.json`, `tsconfig.node.json`
- Added: `astro.config.mjs`, `.astro` page files, `Base.astro` layout
- Changed: Build scripts from Vite to Astro commands
- SEO: Moved from `react-helmet-async` to static Astro `<head>` with structured data

## Notes

- React components are used as "islands" via `client:only="react"` or `client:load`
- Base.astro handles all SEO, Open Graph, Twitter Cards, and JSON-LD structured data
- Theme FOUC prevention runs synchronously before first paint
- Sitemap excludes 404 page
