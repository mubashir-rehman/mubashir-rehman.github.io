# mubashir-rehman.github.io

Source for **[mubashirrehman.com](https://mubashirrehman.com)**, the portfolio of Mubashir Rehman, a backend and systems engineer in Lahore.

A static Astro 5 site with no UI framework and no CSS framework. Every page is plain HTML rendered at build time from a small data layer. The only client-side scripts are the theme toggle, the header's hide-on-scroll on phones, the explorable system diagrams, and a chat that loads only when opened.

## What is in it

- **Case studies** (`src/content/work/*.md`): frontmatter only. Each has a problem, an explorable system diagram, decision records, what broke (symptom, cause, fix), the outcome and a rule. Work under NDA is described by function, never by name.
- **Writing** (`src/content/journal/*.md`): build logs and incident write-ups, each with a `published`, `draft` or `archived` status. Only published posts are built; archived posts with `redirectTo` get a redirect.
- **Identity data** (`src/data/profile.json`, `roles.json`, `builds.json`): the single source for pages, JSON-LD, `llms.txt` and the chat's context.
- **Role pages** (`/for/<role>/`) with a one-page résumé for each track (`public/resume/`).

## Stack

| Area | Choice |
|---|---|
| Framework | Astro 5, static output, `trailingSlash: "always"` |
| Styling | Hand-written CSS (`src/styles/global.css`) over generated design tokens (`design/tokens.mjs` → `src/styles/tokens.css`, OKLCH with a WCAG contrast report) |
| Type | Archivo (variable width) and Martian Mono, self-hosted |
| SEO | One JSON-LD graph per page (`src/lib/schema.ts`), sitemap with real `lastmod`, RSS, generated `llms.txt`, explicit crawler policy in `robots.txt` |
| Social card and icons | Built with satori and resvg (`scripts/og.mjs`) |
| Chat | A small vanilla script that answers only from a context file generated at build time (`/ask-context.json`) |
| Tests | Vitest |
| Deploy | Cloudflare Pages builds `main` and serves mubashirrehman.com. GitHub Actions runs the tests and layout check, then publishes a redirect-only copy to GitHub Pages so the old address (mubashir-rehman.is-a.dev) forwards every path |

## Quality gates

`npm run build` runs `scripts/check-dist.mjs` after the build. It fails on: more or fewer than one `h1`, a canonical URL that does not match the sitemap, over-long titles or descriptions, invalid JSON-LD, broken internal links, em dashes or banned words in copy, and (when `NDA_DENYLIST` points to a private file) any name that must never be published.

CI also runs a layout check across 13 viewports from 320 px up (`scripts/viewport-check.mjs`) to catch horizontal overflow.

## Commands

```bash
npm install
npm run dev              # http://localhost:4321
npm run build            # build to dist/public and run the gate
npm run preview
npm test
npm run lint
npm run tokens           # regenerate src/styles/tokens.css
npm run check:viewports  # needs a running preview
```

Node 22.

## Reuse

There is no licence file, so default copyright applies. The personal content (everything in `src/data/`, `src/content/`, `public/resume/` and the headshot) belongs to Mubashir Rehman. Ask before reusing any of it.
