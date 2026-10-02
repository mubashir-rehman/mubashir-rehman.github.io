# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio for Mubashir Rehman, deployed as a fully static site to GitHub Pages at https://mubashir-rehman.is-a.dev. No backend — the only runtime-dynamic feature is the AskMe chatbot, which calls the Groq API directly from the browser.

> **History:** Two migrations, both worth knowing because stale references survive in odd corners.
> 1. Began as a Vite + `vite-react-ssg` SPA (entry `main.tsx`/`App.tsx`, pages in `src/pages/*.tsx`, HashRouter) and **migrated to Astro** in commit `76787d8`. That left Astro as a thin SEO shell mounting one `client:only` React SPA island.
> 2. Commit `0dd729d` **deleted that React SPA layer entirely** (`ReactApp.tsx`, `src/components/pages/**` incl. mobile variants, `src/components/ui/**` shadcn primitives, `ThemeProvider`, `Comments.tsx`, legacy chrome). Every route is now a real `.astro` page; React survives only as three small islands.
>
> If you see references to `vite.config.ts`, `main.tsx`, `build:dev`, `ReactApp.tsx`, `src/components/pages/`, react-router, react-helmet, giscus, the habits tracker, the hobbies page, or the sakura theme, they're stale — trust the actual code and this file. Known stale leftovers still on disk: root `index.html` (Vite-era, references sakura), `public/giscus-*.css`, `components.json`, `PUBLIC_GISCUS_*` in `.env.example`/`src/env.d.ts`/the deploy workflow (nothing reads them), and the portfolio's own self-description in `src/data/projects.json`.

## Commands

```bash
npm run dev          # astro dev server (http://localhost:4321)
npm run build        # astro build → outputs to dist/public/
npm run preview      # preview the production build
npm run lint         # eslint .
npm test             # vitest run (one-shot) — currently broken, see Tests
npm run test:watch   # vitest watch mode
```

Node 22 in CI. npm only (`package-lock.json`); do not add a `bun.lock`: Cloudflare Pages switches to `bun install --frozen-lockfile` whenever one exists, and a stale one fails every build.

## Architecture (rebuilt 2026-09-29, see docs/redesign/)

Static Astro MPA, **no React and no Tailwind**. Every route renders at build time from data.

- `src/data/profile.json`, `roles.json`, `builds.json`: identity, role pages, smaller builds. Single source for pages, JSON-LD, `llms.txt`, and the chat context.
- `src/content/work/*.md`: case studies (frontmatter only, schema in `src/content.config.ts`). `src/content/journal/*.md`: posts with `status: published | draft | archived`; only published posts are built, archived ones with `redirectTo` get a redirect.
- `src/layouts/Base.astro`: head (title rule, canonical, OG, one JSON-LD graph via `src/lib/schema.ts`), header, footer, chat dialog.
- `src/components/`: Header, Footer, Diagram (explorable system diagram, laid out by `src/lib/diagram.ts`), Trace, AskDialog. `src/scripts/ask.ts` is the chat client, loaded on open.
- Design tokens are generated: edit `design/tokens.mjs`, run `npm run tokens` to rewrite `src/styles/tokens.css`. Everything else lives in `src/styles/global.css`.
- `scripts/check-dist.mjs` is the post-build gate (one h1, canonical equals sitemap, title/description length, JSON-LD, links, no em dashes or banned words). `npm run build` runs it. Set `NDA_DENYLIST` to a private file to also scan for names that must never publish.
- `scripts/og.mjs` regenerates the social card and icons.
- Sensitive drafts and working docs live in the private repo `mubashir-rehman/portfolio-drafts`.

## Conventions

- **Path alias:** `@/*` → `src/*` (configured in `tsconfig.json`, `astro.config.mjs`, and `vitest.config.ts` — keep all three in sync).
- **Env vars:** Astro requires the `PUBLIC_` prefix for client-exposed vars. Only `PUBLIC_GROQ_API_KEY` is actually read (by `AskMe.tsx`); the `PUBLIC_GISCUS_*` entries in `src/env.d.ts`, `.env.example` and the workflow are dead. Values are baked into the bundle at build time and publicly visible (the Groq key relies on free-tier rate limits for abuse protection). In CI, the workflow maps the older `VITE_*` GitHub secrets onto these `PUBLIC_*` env vars.
- **TypeScript:** extends `astro/tsconfigs/strict` but loosened — `strictNullChecks`, `noImplicitAny`, `noUnused*` all off.
- **Themes:** two themes, light and dark. No provider — the FOUC script in `Base.astro` applies the class and `ThemeToggle.tsx` flips it; persisted to `localStorage` under key `theme` (any legacy value, e.g. `sakura`, is migrated to `light`). Tokens live in `src/index.css` (`:root` + `.dark`).
- **Commit messages:** `<page/module/component> (<fix/refactor/enhancement/add/remove/feat>) : <details>`, e.g. `SEO (enhancement) : dynamic canonical URLs per route`.

## Deploy

Push to `main` auto-deploys to GitHub Pages (build → upload `dist/public` → deploy) via the single workflow `.github/workflows/deploy.yml`.

> **Resolved 2026-08-06:** there used to be a second, byte-identical workflow (`static.yml`). Both fired on every push and both declared `concurrency.group: pages` with `cancel-in-progress: true`, so whichever registered second cancelled the other — every commit showed 2 cancelled + 2 successful checks. Deleting `static.yml` fixed it. If you ever add another Pages workflow, do **not** reuse the `pages` concurrency group.

**Cloudflare Pages** also builds this repo, configured on Cloudflare's side (there is no `wrangler.toml` or Cloudflare config in the repo). The canonical domain is served by **GitHub Pages** (`curl -sI https://mubashir-rehman.is-a.dev/` → `server: GitHub.com`), so the Cloudflare `*.pages.dev` deployment receives no traffic. It's harmless — `Base.astro`'s `isCanonical` check emits `noindex` on any host other than `mubashir-rehman.is-a.dev` — but it is a redundant build. Left in place deliberately.

## Tests

Vitest + React Testing Library + jsdom. Setup in `src/test/setup.ts`; tests match `src/**/*.{test,spec}.{ts,tsx}`. Currently minimal (`src/test/example.test.ts`).

**Broken:** `vitest.config.ts` imports `@vitejs/plugin-react-swc`, which is not in `package.json` (the installed plugin is `@vitejs/plugin-react`), so `npm test` fails at config load with `ERR_MODULE_NOT_FOUND`. Fix the import (or add the dep) before relying on the test suite. `npm run lint` also currently reports errors, mostly from generated (`.astro/types.d.ts`) and archived (`archive/hobbies/`) files.
