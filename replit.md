# Mubashir Rehman Portfolio

A personal portfolio site built with React, Vite, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build tool**: Vite 5
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6 (HashRouter)
- **Animations**: Framer Motion
- **State**: TanStack React Query
- **Data**: Local JSON files in `src/data/`

## Project Structure

```
src/
  components/   - Shared UI components (Navbar, Footer, etc.)
  components/ui - shadcn/ui primitives
  data/         - Static JSON data (profile, projects, journal, etc.)
  hooks/        - Custom React hooks
  lib/          - Utility functions
  pages/        - Page components (Landing, About, Projects, etc.)
```

## Running the Project

The project runs on port 5000 using the `Start application` workflow:

```
npm run dev
```

## Git Commit Convention

All commit messages must follow this format:

```
<page/module/component> (<fix/refactor/enhancement/add/remove/feat>) : <change/implementation details>
```

Examples:
- `Projects (add) : enterprise AI/ML pipeline integration project`
- `SEO (enhancement) : dynamic canonical URLs per route`
- `App (refactor) : lazy-load all pages except Landing`
- `fortyRules (fix) : replace abbreviated rules with full text`

## Replit Migration Notes

- Removed `lovable-tagger` from vite config (Lovable-specific tool)
- Set `base: "/"` (was `/portfolio/` in production mode on Lovable)
- Set `server.host: "0.0.0.0"` and `port: 5000` for Replit compatibility
- Fixed CSS `@import` order in `src/index.css` (must precede Tailwind directives)
- Added `ScrollRestoration` component — saves/restores scroll position per route
- Added `ScrollToTop` floating button (bottom-right, appears after 300px scroll)
- Deployment configured as static site (`dist/public` directory, `npm run build`)

## SEO & Performance Optimizations

- **Sitemap**: `public/sitemap.xml` with all routes (hash-based URLs)
- **Robots.txt**: `public/robots.txt` with sitemap reference
- **Structured data**: JSON-LD (Person + WebSite schemas) on home page via `src/components/SEO.tsx`
- **Canonical URLs**: Dynamic per-route canonical and og:url meta tags
- **Code-splitting**: All pages except Landing are lazy-loaded via `React.lazy()` + `Suspense`
- **Google verification**: `public/google970de44929ca96e5.html`
