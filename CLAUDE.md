# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio for Mubashir Rehman, deployed as a fully static site to Cloudflare Pages at https://mubashirrehman.com (canonical since 2026-10-02; the old https://mubashir-rehman.is-a.dev on GitHub Pages now only redirects). No backend — the only runtime-dynamic feature is the AskMe chatbot, which calls the Groq API directly from the browser.

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
npm test             # vitest run (one-shot)
npm run test:watch   # vitest watch mode
```

Node 22 in CI. npm only (`package-lock.json`); do not add a `bun.lock`: Cloudflare Pages switches to `bun install --frozen-lockfile` whenever one exists, and a stale one fails every build.

## Architecture (rebuilt 2026-09-29, see docs/redesign/)

Static Astro MPA, **no React and no Tailwind**. Every route renders at build time from data.

- `src/data/profile.json` (incl. `label`, `availabilityShort`, `servicesLead`), `roles.json`, `builds.json`, `problems.json` (shared by home and `/services/`): identity, role pages, smaller builds. Single source for pages, JSON-LD, `llms.txt`, and the chat context.
- `src/content/work/*.md`: case studies (frontmatter only, schema in `src/content.config.ts`). `src/content/journal/*.md`: posts with `status: published | draft | archived`; only published posts are built, archived ones with `redirectTo` get a redirect.
- `src/layouts/Base.astro`: head (title rule, canonical, OG, one JSON-LD graph via `src/lib/schema.ts`), header, footer (chat dialog is unmounted, see below).
- `src/components/`: Header, Footer, Diagram (explorable, case pages), MiniDiagram (static compact copy on a `--surface` panel, from the same nodes and edges), Artifact (case study row, full and compact), Incident (SYMPTOM, CAUSE, FIX), Trace, plus the dormant AskDialog. The role switcher is markup in `src/pages/for/[role].astro`. `src/lib/text.ts` spells out computed counts (`numWord`); never hardcode counts.
- **Chat is off by owner decision** (main 0a18977): `Base.astro` does not mount `AskDialog`; `ask.ts`, `askPrompt.ts`, `/ask-context.json` stay for later. Built pages ship zero `.js` files; keep it that way. (The only script on the live site, `beacon.min.js`, is Cloudflare Web Analytics injected at the edge; it is not in `dist/`.)
- **Redesign v3** (docs/redesign/v3/PLAN.md, owner-approved mockup "F"): `src/styles/v3.css` loads after `global.css` and remaps the token names onto one palette mirrored across dark and light, plus fonts (Bricolage Grotesque for headings, DM Sans for text and labels; monospace only for code) and a six-step type scale. Every page is built from one card system in `src/styles/cards.css` (classes prefixed `j-`, loaded on every page). Every inner page opens with `src/components/PageTop.astro` (same card heights and title position everywhere; cut content rather than enlarge the card), and text links follow the five link roles defined at the end of `cards.css` (inline, action, title, navigation, on purple). The portrait is `src/components/Portrait.astro` (dark and light photos swapped by theme). The home page is fed by `src/data/approach.json`, `toolbox.json` and `problems.json` (with `icon`). Icons: `src/components/Icon.astro` (Lucide, ISC, only the icons in `src/icons/lucide.json`). Gold only on traces; no new facts, numbers or names.
- Design tokens are generated: edit `design/tokens.mjs`, run `npm run tokens` to rewrite `src/styles/tokens.css`. Everything else lives in `src/styles/global.css`.
- `scripts/check-dist.mjs` is the post-build gate (one h1, canonical equals sitemap, title/description length, JSON-LD, links, no em dashes or banned words). `npm run build` runs it. Set `NDA_DENYLIST` to a private file to also scan for names that must never publish.
- `scripts/og.mjs` regenerates the social card and icons.
- Sensitive drafts and working docs live in the private repo `mubashir-rehman/portfolio-drafts`.

## Conventions

- **Path alias:** `@/*` → `src/*` (configured in `tsconfig.json`, `astro.config.mjs`, and `vitest.config.ts` — keep all three in sync).
- **Env vars:** Astro requires the `PUBLIC_` prefix for client-exposed vars. Only `PUBLIC_GROQ_API_KEY` is read, by the dormant chat client `src/scripts/ask.ts` (chat is off, so nothing ships it); the `PUBLIC_GISCUS_*` entries in `.env.example` and the workflow are dead. Values are baked into the bundle at build time and publicly visible (the Groq key relies on free-tier rate limits for abuse protection). In CI, the workflow maps the older `VITE_*` GitHub secrets onto these `PUBLIC_*` env vars.
- **TypeScript:** extends `astro/tsconfigs/strict` but loosened — `strictNullChecks`, `noImplicitAny`, `noUnused*` all off.
- **Themes:** two themes, light and dark. No provider: the inline script in `Base.astro` sets `data-theme` before first paint and the toggle in `Header.astro` flips it, persisted to `localStorage` under key `theme`. Tokens come from `design/tokens.mjs` (run `npm run tokens` to rewrite `src/styles/tokens.css`).
- **Commit messages:** `<page/module/component> (<fix/refactor/enhancement/add/remove/feat>) : <details>`, e.g. `SEO (enhancement) : dynamic canonical URLs per route`.

## Deploy

Two hosts build `main` on every push:

- **Cloudflare Pages** (project `mubashir-rehman-github-io`, configured on Cloudflare's side, no wrangler file): build `npm run build`, output `dist/public`, Node 22. It serves the canonical **https://mubashirrehman.com** (`www` redirects to the root via a Cloudflare redirect rule). `SITE` in `src/lib/schema.ts`, `astro.config.mjs` and `scripts/check-dist.mjs` must stay in sync with this domain.
- **GitHub Pages** via `.github/workflows/deploy.yml`: runs tests, the build gate and the 13-viewport layout check, then `scripts/redirect-stubs.mjs` turns every HTML page into a stub that redirects to the same path on mubashirrehman.com (meta refresh + `location.replace`, canonical, noindex). This keeps old **mubashir-rehman.is-a.dev** links working; GitHub Pages cannot send real 301s. PDFs and feeds stay in place.

Keep a single Pages workflow and never reuse its `pages` concurrency group in another workflow (two workflows sharing it cancelled each other in the past).

## Tests

Vitest (node environment, no React). Config in `vitest.config.ts`; tests match `src/**/*.{test,spec}.ts` (currently `src/lib/__tests__/diagram.test.ts`). `npm test` and `npm run lint` both pass.
