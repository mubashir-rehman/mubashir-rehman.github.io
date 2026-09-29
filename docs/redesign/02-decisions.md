# Decisions (creative director, 2026-09-29)

Made under Mubashir's standing authority for this build. Each line says what was chosen and why.

## Direction
- **Palette A, "black is black":** true #000 page, amethyst for what was decided or built (primary action, rule numbers, current marker), cobalt for signals (links, focus, data flow, the trace). Dark by default, follows the system theme, light theme equal in quality. Zero contrast failures across both themes (design/tokens.mjs).
- **Type:** one variable family (Archivo) used across its width axis; Martian Mono for code only. No mono labels, no all-caps eyebrows, no 01/02/03 on non-sequences (frontend-design skill).
- **Boldness in one place:** the hero line set in three widths, over a trace that settles from noise to flat. Personal flavour, implicit: the eight-point Multan star in the brand mark; numbered rules; "What broke" sections.
- **Hero line:** "I like difficult systems. I like figuring out why they break. Then I like making them boring." The identity sentence follows directly for recruiters and crawlers.

## Structure
- **Nav:** Work, Writing, About, Contact, and a Résumé button; all visible on phones as a second row (UX lead's evidence beat the designer's menu toggle). Existing URLs kept; `/services/` became "Problems I solve", out of the nav.
- **Case studies:** nine pages at launch. Home flagships: the dental AI front desk, the social-signal intelligence backend, AI agents on a live ERP. The AWS backend is its own page so each stays within budget.
- **Signature interaction:** the explorable system diagram on case studies, generated from data, fully readable without JavaScript. One motion moment per template.
- **Rules on About** are generated from the case studies' `rule` fields, so the evidence link can never drift.
- **Journal:** status flag (published, draft, archived). Two posts archived with redirects; sensitive drafts and working docs live in the private `portfolio-drafts` repo.

## Content
- Verified or claimed facts only; the content bank's retire list applied across data, pages, llms.txt, chat context and résumés. Left out on purpose: the key-deletion incident, practice counts, the placeholder-figures story, voice-vendor names, "Mirth".
- Phone number removed from the site (it stays on the résumé PDFs).

## Engineering
- React and Tailwind removed; the chat is a small script loaded only when opened, with its context fetched from `/ask-context.json` instead of being inlined in every page.
- One JSON-LD `@graph` per page with stable ids; title suffix " | Mubashir Rehman" only when it fits 60.
- Post-build gate (`scripts/check-dist.mjs`) runs on every build and in CI.
- Cut for budget: per-page social cards (one site-wide card for now) and five separate QA agents (one combined pass).
