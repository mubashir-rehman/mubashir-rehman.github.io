# Redesign report (2026-09-29)

## What shipped

- **A new site on a new design system.** True-black pages, amethyst for what was decided or built, cobalt for signals; one variable typeface; the hero line in three widths over a trace that settles from noise to flat. Dark by default, following the system theme, with an equal light theme. Zero contrast failures (`node design/tokens.mjs`).
- **Nine case-study pages** (`/projects/<slug>/`), each with problem, an explorable system diagram, three decision records, what broke, outcome, a numbered rule and stack. Home flagships: the dental AI front desk, the social-signal intelligence backend, AI agents on a live ERP.
- **Verified-only content everywhere:** pages, role pages, `llms.txt`, the chat context and all four résumés. Retired: endpoint and service counts, concurrent users, the headcount (now the measured 138), accuracy percentages, UAV and download figures, n8n as a skill, Stripe and Channels claims, pricing and retainer language, "Mirth", the doubled teaching numbers.
- **Four one-page résumés** (Backend, AI backend, Full-stack, ERP and AI), generated with Claude's pdf skill, XYZ-formula bullets, the Springer paper directly under the summary.
- **Journal with a publish status** (published, draft, archived). Two posts archived with redirects. The Tavily post lost the side-codebase section and an unverified figure.
- **SEO/AEO/GEO:** one JSON-LD graph per page with stable ids, title rule with an 18-character suffix, generated `llms.txt`, explicit crawler policy in `robots.txt`, sitemap `lastmod` from real content dates, breadcrumbs, FAQ blocks on role pages and posts, one social card.
- **Engineering:** React, Tailwind and about 60 dependencies removed; the chat loads only when opened and no longer inlines its prompt into every page; post-build gate in every build and in CI; tests and lint pass.
- **Private repo `portfolio-drafts`:** the content bank, editorial plan, the dead-letter-queue incident draft, and the résumé generator.

## Quality

| Check | Result |
|---|---|
| Build gate (one h1, canonical equals sitemap, lengths, JSON-LD, links, em dashes, banned words, NDA denylist) | 25 pages pass |
| axe-core, WCAG 2.2 AA, dark and light, 5 pages at 390px | 0 violations |
| Lighthouse mobile, home | 100 / 100 / 100 / 100, LCP 1.5 s, CLS 0 |
| Lighthouse mobile, case study | 100 / 100 / 100 / 100, LCP 1.7 s, CLS 0 |
| Keyboard (skip link, nav, theme, diagram, chat) | passes |
| Live QA | see `live-qa.md` |

## Known issues and cuts

- One site-wide social card instead of one per page (cut for budget; `scripts/og.mjs` is the starting point).
- The chat still uses a public Groq key baked into the bundle (free-tier limits are the only protection).
- The designer's written spec (`30-design-system.md`) was not finished; the tokens, specimen and stylesheet are the system of record.
- Diagram arrows can look heavy next to a selected node (cosmetic).
- The temporary branch `claude/netcheck-aiml` could not be deleted from here.

## What you need to do

1. **Rotate the leaked GitHub token** named in `master-resume/.env` (revoke it on GitHub and on the AIML server).
2. **Search Console and Bing Webmaster:** resubmit `https://mubashir-rehman.is-a.dev/sitemap-index.xml`, request indexing for the home page and two case studies, and add IndexNow if you use Bing.
3. **Profiles:** update the GitHub repo description (it still says React, Vite, habit tracker, sakura), your GitHub profile README, and LinkedIn (headline, the HL7 product name in two places, n8n, the ECG hardware and "under review" wording) so they match the site.
4. **Groq key proxy:** move the chat behind a small Cloudflare Worker that holds the key, then remove `PUBLIC_GROQ_API_KEY` from the build.
5. **Decide on drafts** in `portfolio-drafts/journal/`: fact-check the dead-letter-queue post and get your employer's OK before publishing.
6. **Open questions** from the content lead (`portfolio-drafts/working/10-content-bank.md`, section 8): equal-contribution wording in the Springer PDF, whether "four engineers" includes you, and whether the 138 headcount may stay public.
7. Delete the stray branch `claude/netcheck-aiml` on GitHub.
