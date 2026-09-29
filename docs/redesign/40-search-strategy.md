# 40. Search strategy: SEO, AEO and GEO

Role: SEO / AEO / GEO lead. Method: the marketing `seo-audit` skill (executive summary, on-page
issue table, keyword opportunity table, content gaps, technical checklist, competitor comparison,
quick wins versus strategic investments), adapted from commercial sites to a personal engineer
portfolio.

Audit baseline: commit `10eb841`, production build run on 2026-09-29 (`npm ci && npm run build`),
Lighthouse 12 against `astro preview`, and web search sanity checks. No site code or content was
changed. Since that build, other roles added `20-ux-blueprints.md`, `10-content-bank.md`,
`50-editorial-plan.md`, `scripts/check-dist.mjs` and journal content collections. This document
reconciles with all of them; where it disagrees with one, §13 says so and gives a recommendation.

**Evidence labels**

- **[M] measured:** built HTML in `dist/public/`, or Lighthouse 12 (Chromium, localhost, mobile
  default plus one desktop run).
- **[S] search check:** one-off, logged-out web search. A sanity check on SERP composition, not rank
  tracking. Statements about Google policy that come from search summaries (Google's own docs were
  blocked in the sandbox) are marked and should be confirmed in Search Central.
- **[R] reasoned:** judgement with no data behind it. Every keyword demand and difficulty rating
  here is [R] unless marked otherwise, because no SEO tool (Ahrefs, Semrush) and no Search Console
  access was available. Connect one and re-rate §2.2 before committing to the post queue.

**Copy rules applied to everything drafted here:** no em dashes, none of the banned words, no
client, internal or vendor-vertical names, none of the language the brief bans from the client
path, and only figures the content bank allows (tier A wording). Every drafted title and
description was length-checked by script. Drafted copy is provisional until the content lead's
claims check.

**Contents.** 0 Executive summary. 1 Audit findings. 2 Intent and keyword map. 3 Page-level plan.
4 Structured data. 5 AEO patterns. 6 GEO plan. 7 Content clusters and post queue. 8 Off-site levers.
9 Measurement. 10 Migration safety. 11 CI checks. 12 Prioritized action plan. 13 Decisions, answers
to other roles, limits.

---

## 0. Executive summary

**Overall: strong technical foundation, thin content surface, fragmented entity signals, and
claims on machine-read surfaces that the content bank now contradicts.**

The build is clean. All 14 indexable URLs have a canonical byte-identical to the sitemap `<loc>`,
every page has one `<h1>`, none of 232 internal links is broken, every JSON-LD block parses, and
Lighthouse on the local build gives mobile performance 98 to 99, SEO 100, best practices 100 and
accessibility 96 to 100 [M]. A logged-out search for "Mubashir Rehman backend engineer" already
returns the home page first and the full-stack role page second [S].

Four things hold it back.

1. **Nothing to rank for beyond the name.** 15 URLs: four near-duplicate role pages, four posts, and
   no page about any specific build. All 20 projects are cards on one index page [M].
2. **Wrong claims sit exactly where machines read.** Meta descriptions, JSON-LD, FAQs, `llms.txt`
   and the chatbot prompt repeat figures the content bank marks blocked or measured false (§1.3).
3. **The entity is inconsistent.** No `@id`, three `Person` shapes, a different `jobTitle` and `url`
   per page type, and JSON-LD URLs that break the site's own trailing-slash rule [M].
4. **The title suffix eats the budget.** 37 of 60 characters, so three of four posts break the
   60-character rule at 94, 94 and 63 [M].

**Top 3 priorities**

1. Fix the data layer first: remove blocked claims from every SEO surface, then build
   `/projects/[slug]/` case studies and the post queue on the corrected facts (§1.3, §3.4, §7).
2. One `@graph` with stable `@id`s, the ` | Mubashir Rehman` suffix rule, and one canonical entity
   line and fact block everywhere (§3.0, §4, §6).
3. The off-site work answer engines actually read: LinkedIn, GitHub, Scholar, ORCID, cross-posts
   with canonical, plus Search Console, Bing Webmaster and IndexNow on day one (§8).

**What SEO can honestly deliver here.** Recruiters mostly arrive from LinkedIn or a résumé link, so
head terms like "backend engineer Lahore" belong to job boards and are not winnable [S]. Three
things are winnable: name plus role queries, long-tail problem queries where a first-hand incident
write-up beats a generic guide, and accurate AI answers when someone asks a chatbot about him,
which is the most likely way a recruiter or CTO researches a candidate in 2026 [R]. The strategy
targets those three and does not chase the rest.

---

## 1. Audit findings

### 1.1 Method and limits

Built the site; parsed all 15 HTML files; compared canonicals to the sitemap; counted headings,
JSON-LD types, links and islands; read `robots.txt`, `llms.txt`, `rss.xml` and the résumé PDFs'
metadata; ran Lighthouse on home, about, a role page, a post and the projects index; ran
`scripts/check-dist.mjs` and a stricter script of my own (§11) against the same build.

Could not verify: live-site behaviour (the sandbox proxy returns 403 for the production domain, so
HTTPS enforcement, the slash-less 301, headers and the real 404 status are unchecked); Google's
developer docs and the Springer page (blocked); anything in Search Console or Bing.

### 1.2 Ranked findings (on-page and technical issue table)

Severity: **Critical** actively damages trust or blocks ranking, **High** significant impact,
**Medium** best-practice gap, **Low** polish.

| # | Sev. | Where | Finding (evidence) | Fix |
|---|---|---|---|---|
| 1 | Critical | `data/profile.json`, `projects.json`, `roles.json`, `public/llms.txt`, `lib/askmePrompt.ts`, `Base.astro` | Claims the content bank blocks or measures false are on meta descriptions, JSON-LD, FAQ text, `llms.txt` and the chatbot prompt [M]. These are the strings answer engines quote. Detail in §1.3. | Fix at the data layer once; every surface derives from it. Add a blocked-claims scan (§11). |
| 2 | High | `pages/projects.astro`, `components/astro/ProjectCard.astro` | No page for any specific build. 20 projects render as headings on one URL; cards link only to external GitHub or demo URLs [M]. Nothing can rank or be cited for a specific system and no internal link can point at one. | UX blueprint §3.3 template, slugs and eligibility test in §3.4. |
| 3 | High | `layouts/Base.astro` (`fullTitle`), `data/profile.json` `seo.baseTitle` | The suffix is 34 characters plus a 3-character separator, so a page title has 23 characters left [M]. Posts run 94, 94 and 63 characters against the 60 limit [M]. The suffix contains an em dash (banned in copy). `check-dist` enforces length but not the em dash in `<title>` (it strips `<head>` before scanning). | the 18-character suffix (space, pipe, space, then the name) plus the rule in §3.0. Editorial and UX already assume this. |
| 4 | High | `Base.astro`, `pages/about.astro`, `pages/for/[role].astro`, `pages/index.astro` | Entity graph is fragmented [M]. No `@id` on any node except an ORCID URL inside the paper. `Person` appears in three shapes: full (every page), minimal (about), and inside a role page's `ProfilePage` with `url` set to the role page and `jobTitle` set to the role headline. `Person.url`, `WebSite.url` and `author.url` lack a trailing slash on every page (CLAUDE.md rule 1) [M]. `WebSite.name` says "Portfolio" while the title says "Backend Engineer". The paper's `isPartOf.name` mixes journal and publisher. `email` is emitted on every page. | One `@graph` (§4). Full `Person` on `/` and `/about/`, slim node elsewhere. |
| 5 | High | `data/journal.json`, `pages/services.astro`, `pages/index.astro`, `pages/contact.astro`, `public/llms.txt` | Off-brief client-path language on SEO surfaces: a meta description ("available for contract/project work"), `ProfessionalService` JSON-LD, a pricing FAQ, home cards ("Fixed-scope projects", "Retainer & contract"), and `llms.txt` [M]. The brief allows "open to select engagements" at most. Two stale posts and a personal essay are indexed, in the sitemap and in RSS. | Reframe per UX §3.8 and §2.5; no `Service` or `ProfessionalService` markup (confirmed, §13.2). Post status: §10.2. |
| 6 | High | `layouts/PageLayout.astro`, `pages/journal/[slug].astro`, `Base.astro` | Post pages emit `og:type=website` and no `article:*` tags: `Base` supports `articleMeta`, but `PageLayout` neither accepts nor forwards it (confirmed in built HTML, 4 of 4 posts) [M]. One static 1200x630 `og-image.png` serves every page and is the `BlogPosting.image`; no `og:image:width/height/alt`, no `twitter:image:alt`; `article:author` is a name, not a profile URL. | Forward `articleMeta`; per-page OG image at build (plan §8.4). |
| 7 | High | `PageLayout.astro` (AskMe `client:idle`), `components/ThemeToggle.tsx` (`client:load`) | JS and render budget. About 100 KB of JS is transferred on every page: React runtime 44.5 KB (pulled in by the theme toggle island alone), AskMe 44.3 KB (Lighthouse: 24 KiB unused), router 5.7 KB [M]. Plan budget 50 KB. Mobile LCP is 2.0 to 2.3 s (plan target 1.5 s); the LCP element is the hero paragraph and 79 percent of it is render delay from a render-blocking 51 KB stylesheet (9.6 KB gzip) and three font files totalling 92 KB, two not preloaded [M]. | Theme toggle as a tiny vanilla script (drops React from content pages). Chat loads on first interaction. Inline critical CSS. At most two font files above the fold. UX §5.4 and Q14 already lean this way. |
| 8 | Medium | Sitewide chrome and templates | Internal linking is navigation only [M]. Every page has the same 11 sitewide links; each post has exactly 1 inbound link; no post links to a project or role page and none links back; no visible breadcrumb although `BreadcrumbList` is emitted on role and post pages. | Contextual links (§3.6, §7.3); visible breadcrumbs (UX §6.1). |
| 9 | Medium | `lib/askmePrompt.ts`, `PageLayout.astro` | The full chatbot system prompt is serialised into a `props` attribute on every page: 14,883 bytes of a 37 to 86 KB document [M]. It contains a rendering bug (`[object Object] · Lahore, Pakistan`, from interpolating the `currentRole` object) and an internal tool name from the `erpnext-frappe` description, so that name is in the HTML of all 15 pages [M]. `check-dist` cannot see it: it scans visible text only. | Load the prompt on interaction from a JSON file or the proxy, never inline. Fix the interpolation. Scan raw HTML in CI. |
| 10 | Medium | `public/llms.txt`, `public/robots.txt` | `llms.txt` is hand-maintained (CLAUDE.md rule 5), stale ("Team Lead" label, a "Services (for clients)" retainer block, em dashes) [M]. `robots.txt` repeats `Allow: /` for 10 bots the wildcard already allows, keeps deprecated tokens (`Claude-Web`, `anthropic-ai`) and lacks current retrieval agents (`Claude-SearchBot`, `Claude-User`, `Perplexity-User`) [S]. | Generate `llms.txt` at build from the data (§6.5); new `robots.txt` (§6.6). |
| 11 | Medium | `public/resume/*` | Three of four PDFs have no Title and Author "Un-named" (LibreOffice defaults); their links point at the old `mubashir-rehman.github.io` host; the fourth is a 7 KB ReportLab file [M]. A PDF's search title comes from its Title metadata. A Markdown copy of the full-stack résumé is publicly served at `/resume/Mubashir-Rehman-Full-Stack.md` [M]. | Regenerate in phase 5 with Title, Author, Subject and canonical-domain links. Remove the `.md` from `public/`. |
| 12 | Medium | `data/roles.json` `faqs`, `pages/services.astro` | Each of four role pages repeats near-identical "available for remote" and "what experience" Q&As [M]. Google reportedly retired FAQ rich results on 7 May 2026 [S, secondary sources], so the markup buys no SERP feature. FAQ text carries blocked figures (§1.3). | Rules in §5.4; UX §3.7 already limits role FAQs to short, page-specific answers. |
| 13 | Medium | `astro.config.mjs` (sitemap), `pages/rss.xml.ts` | Sitemap has no `<lastmod>` [M]. RSS has no `<language>`, `<lastBuildDate>` or `atom:link rel="self"`, only excerpts, and includes the personal essay [M]. | §3.0 and §3.1. |
| 14 | Medium | `PageLayout.astro` footer, post template, `Markdown.tsx` | The footer emits three `<h2>` on every page, so every outline ends with chrome [M]. Post headings have no `id`, so no deep links or contents list on a 1,449-word post [M]. | UX §6.1 removes footer headings (`<nav aria-label="Footer">`); add heading ids in the post template. |
| 15 | Medium | `Markdown.tsx`, `public/` | No `astro:assets` anywhere (rule 4); the certificate image has no `width` or `height` [M]. | Every raster through `astro:assets`; diagrams as inline SVG with `<title>` and `<desc>`. |
| 16 | Low | `pages/404.astro` | The 404 page has a canonical to `/404/`, the full `Person` JSON-LD and no `noindex` [M]. | `noindex`, no canonical, no `Person` (UX §3.10 already says `noindex`). |
| 17 | Low | `Base.astro` head | No `theme-color`, `apple-touch-icon`, `favicon.ico` fallback or `og:locale` [M]. | Add. Not a ranking issue. |
| 18 | Low | Navbar, home | Lighthouse: `label-content-name-mismatch` on the logo link on every page; `link-in-text-block` on home [M]. | UX §7.5 already requires the visible label inside the accessible name. |
| 19 | Low | `public/giscus-*.css`, `public/placeholder.svg` | Dead assets still published [M]. | Delete in the rebuild. |
| 20 | Info | Hosting | GitHub Pages cannot send custom headers (`public/_headers` is only honoured by Cloudflare Pages), cannot 301 beyond the trailing-slash case, and gives no access logs. Redirects must be Astro meta-refresh pages (§10.3); AI-crawler traffic is unmeasurable; cache lifetimes cannot be tuned. | Noted in §13. |
| 21 | Info | Search results | A result listed the home page as `http://mubashir-rehman.is-a.dev/` [S], possibly an artefact of the search tool. | Check Search Console Page indexing for an `http` alternate; confirm "Enforce HTTPS" in Pages settings. |

### 1.3 Claims on SEO surfaces that the content bank rules out

The content bank (`10-content-bank.md`, tiers and ledger rows L1 to L22) is the authority. These
are the ones that reach meta descriptions, JSON-LD, FAQ text, `llms.txt` and the chatbot prompt.
Nothing below is a new finding about the person; it is the current site contradicting the ledger.

| Where it appears | Claim type | Bank ruling |
|---|---|---|
| Home lede, `about.astro` description, role `metaDescription` and pitch, FAQ text, `llms.txt` | Endpoint counts (and the service count they are paired with) for the SaaS backend | Endpoint counts are on the unverified list and may not return in any form; the service count has no ledger row either |
| ERP role `metaDescription`, pitch, FAQ, `llms.txt`, `projects.json` | A headcount for the HRMS workforce | Measured false (row L2); the system is past tense; employer headcount is employer-sensitive |
| `projects.json`, role FAQ | A commit count and "top contributor" for the healthcare console | The verified figure differs (row L10, PS-04); never state a team size |
| `projects.json`, role FAQ | A specific R² attached to a ResNet-18 model, and PyTorch as a skill | The paper prints no such figure; both wrong (CS-22). "Equal contribution" needs the Springer PDF checked first (G13) |
| `projects.json` (intelligence backend) | A detection accuracy, a chain count and "ML-based" detection wording | Unsupported; the record bars claiming ML model ownership there (CS-04) |
| `profile.json`, `projects.json` | UAV counts, telemetry rates, message throughput, download counts and store rating | Unverified list; scope only ("led a team of four") |
| `profile.json`, `roles.json` | "Cut prompt deployment from hours to minutes"; an automation tool listed as a skill | Allowed wording is the migration's scale and "no code deploy" (PS-05); the tool is not a claimed skill |
| `profile.json`, `projects.json`, `roles.json` | Names of an open-source HRMS, an HL7 engine and an internal dashboard | Naming optional or barred (CS-06, CS-09); the dashboard name is identifying |
| `profile.json` education | Institution dates "Sep 2018 to Dec 2024" | Disputed; print institution and degree only |
| AskMe prompt, `llms.txt`, JSON-LD | Every item above, repeated | Same rulings; regenerate from the corrected data |

The existing gate (`scripts/check-dist.mjs`) scans visible text only. It cannot catch a blocked
claim inside a `<meta>` tag, a JSON-LD block or a `props` attribute, which is where most of these
live. §11 adds a raw-HTML scan driven by a private list, so the list itself never enters the repo.

### 1.4 Technical SEO checklist

| Check | Status | Details |
|---|---|---|
| Canonical equals sitemap `<loc>` | Pass | 14 of 14 indexable pages identical [M]. 404 has a canonical but is correctly absent from the sitemap. |
| Sitemap presence and accuracy | Warning | `sitemap-index.xml` then `sitemap-0.xml`, 14 URLs, `/404` filtered. No `lastmod` (#13). Redirect routes' sitemap status is untested. |
| robots.txt | Warning | Nothing disallowed, sitemap declared; redundant blocks, missing agents (#10). |
| Title length (full string) | Fail | 3 of 4 posts exceed 60 (#3). |
| Meta description length | Pass | All 15 between 126 and 155 [M]. |
| One H1 per page | Pass | 15 of 15 [M]. |
| Heading outline | Warning | Footer `<h2>`s; no post heading ids (#14). |
| JSON-LD parses | Pass | 15 of 15 [M]. |
| JSON-LD coverage and consistency | Fail | Fragmented `Person`, no `@id`, slash-less URLs, nothing on `/projects/` or `/contact/` (#4). |
| Open Graph and Twitter | Warning | Complete on every page, but posts typed `website`; one image for all (#6). |
| Images and alt text | Warning | Few images; alt present; no `astro:assets`; one missing dimensions (#15). |
| Internal links | Warning | 0 broken of 232 [M]; structure nav-only (#8). |
| Mobile friendliness | Pass | Viewport set; Lighthouse mobile SEO 100 on five templates [M]. |
| Core Web Vitals (lab) | Warning | CLS 0, TBT 0 to 50 ms. LCP 2.0 to 2.3 s versus 1.5 s target (#7). No field data. |
| JS budget | Fail | About 100 KB versus 50 KB plan budget (#7). |
| Fonts | Warning | Self-hosted, `font-display: swap`, one preload; three files, 92 KB (#7). |
| HTTPS | Warning | Unverified from the sandbox (#21). Canonicals all `https`. |
| noindex on non-canonical hosts | Pass | `Base.astro` `isCanonical`; keep it. |
| RSS | Warning | Valid, autodiscovery present, thin (#13). |
| `llms.txt` | Warning | Present, stale, hand-written (#10). |
| Search Console verification | Pass | `public/google970de44929ca96e5.html` is published. Must survive the rebuild (§10). |
| Existing post-build gate | Warning | `check-dist` run on the baseline build: 18 problems (an em dash in visible copy on 15 pages, three titles over 60 characters), all real. It does not check JSON-LD URLs, `@id`s, `og:type`, duplicates, head or attribute content (§11). |
| Structured data in Google's tools | Not run | Rich Results Test and Schema Markup Validator unreachable; run both before launch. |

### 1.5 Measured baseline (Lighthouse 12, local `astro preview`)

Local runs have no network latency and use simulated mobile throttling: a regression baseline, not
field truth.

| Template | Perf | A11y | Best practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Home, mobile | 98 | 96 | 100 | 100 | 2.2 s | 50 ms | 0 |
| Home, desktop | 100 | 96 | 100 | 100 | 0.5 s | 0 ms | 0 |
| About, mobile | 99 | 100 | 100 | 100 | 2.0 s | 0 ms | 0 |
| Role page (backend), mobile | 98 | 100 | 100 | 100 | 2.3 s | 0 ms | 0 |
| Post (Tavily), mobile | 98 | 100 | 100 | 100 | 2.2 s | 0 ms | 0 |
| Projects index, mobile | 99 | 100 | 100 | 100 | 2.0 s | 0 ms | 0 |

Transferred weight: home 216 KiB, post 273 KiB. JS transferred on home: `client.*.js` 44.5 KB,
`AskMe.*.js` 44.3 KB, router 5.7 KB, three small chunks 5.8 KB. Re-measure the new site after launch
and quote only those figures (content bank PS-10).

### 1.6 Keep list: do not regress

- `trailingSlash: "always"`, canonical normalisation in `Base.astro`, `noindex` on non-canonical hosts.
- One `<h1>`, descriptions at or under 155, zero broken internal links.
- Build-time Markdown with no client JS (`Markdown.tsx`, no directive).
- Data-driven copy from `src/data/*.json` and a generated chatbot prompt (keep the pattern, fix the leaks).
- Self-hosted fonts, no third-party requests on load, no cookies.
- `Person.sameAs` including ORCID and Scholar, once the content lead confirms the two accounts that
  exist only on the live site (ORCID, Stack Overflow) are his and wanted.
- The Search Console verification file and the `/sitemap-index.xml` path.

Data files were being edited in the working tree while this audit was written, so §1.3 describes
the baseline commit. Re-run the scan in §11 against the next build to see what is already fixed.

---

## 2. Intent and keyword map

### 2.1 Four query classes and the honest target for each

| Class | Who types it | What ranks today [S] | Realistic goal |
|---|---|---|---|
| Name, and name plus qualifier ("Mubashir Rehman", "… backend engineer", "… Lahore", "… résumé") | Recruiters, CTOs and founders checking a candidate | The site, LinkedIn profiles of several other people with the same name, ZoomInfo, GitHub | Own the first screen for name plus any qualifier (role, city, employer, paper). Highest value, most winnable. |
| Role plus location ("backend engineer Lahore", "Django developer Pakistan remote") | Job seekers, and hiring teams sourcing | LinkedIn Jobs, Glassdoor, Mustakbil, Crossover, RemotePython listings | Not winnable and mostly the wrong intent. Use the terms naturally on role pages; do not build for them. |
| Problem and symptom ("dead letter queue keeps growing", "multiple agents one browser", "ZKTeco Django multiple devices") | Engineers and CTOs with a specific failure | Vendor docs, Stack Overflow, GitHub issues, Medium, DEV, aggregator guides | Winnable in the specific long tail, and this is exactly what incident write-ups produce. |
| AI-answer queries ("who is Mubashir Rehman", "Python backend engineers in Pakistan with LLM agent experience") | Anyone using ChatGPT, Perplexity, Google AI Mode or Copilot | Answers built from the site, LinkedIn, GitHub, Scholar, ORCID and any page that mentions him | Make the answers accurate and consistent (§6). Measure monthly (§9.3). |

Name collision is real [S]: logged-out searches surface unrelated engineers and other professions
with the same name, including a "Mubashir Ur Rehman". Disambiguators that belong in every bio and
off-site profile: **Lahore, Information Technology University (ITU), TransData, the Springer CSSP
2025 paper, HireTrack.**

### 2.2 Keyword opportunity table

Difficulty is for a personal site with no meaningful backlink profile beyond its own profiles.
"Current" is filled only where a spot check exists. Story IDs (S01 to S20) are the editorial plan's.
Sorted by opportunity, then by ease. Rows that would need a name the content bank bars (the HL7
engine, the automation tool, the open-source HRMS) are deliberately absent.

| # | Query or family | Class | Intent | Difficulty | Opportunity | Current | Target | Format |
|---|---|---|---|---|---|---|---|---|
| 1 | mubashir rehman backend engineer | Name plus role | Navigational | Easy | High | #1 home, #2 full-stack role page [S] | `/` | Home |
| 2 | mubashir rehman | Name | Navigational, ambiguous | Moderate | High | Unknown | `/`, `/about/` | Home, About |
| 3 | mubashir rehman lahore; software engineer lahore | Name plus city | Navigational | Easy | High | Unknown | `/about/` | About |
| 4 | mubashir rehman resume; cv | Name plus asset | Navigational | Easy | High | Unknown | Role pages, PDFs | Role page, PDF |
| 5 | dead letter queue keeps growing; scheduler requeues failed job every tick | Symptom | Troubleshooting | Moderate | High | None | S01 | Incident post |
| 6 | multiple coding agents one browser cookies; playwright tabs share context | Symptom | How-to | Easy to moderate | High | None | S08 | Lab note |
| 7 | aws kms key pending deletion cancel; alert on key deletion eventbridge | Symptom | Troubleshooting | Moderate | High | None | S04 (gated) | Incident post |
| 8 | ecs circuit breaker rollback health check command not found | Symptom | Troubleshooting | Easy | Medium to high | None | S06 | Incident post |
| 9 | websocket messages arrive as strings json double encoded | Symptom | Troubleshooting | Easy | Medium to high | None | S05 | Incident post |
| 10 | unbounded promise.all timeout many endpoints; search across many services one slow | Symptom | Decision | Easy to moderate | Medium | None | S03 | Decision post |
| 11 | jwt issued in the future postgrest; prove managed service bug with curl | Error string | Troubleshooting | Easy | Medium | None | S12 | Lab note |
| 12 | zkteco django integration; zkteco web api multiple devices | Problem | How-to | Easy (forum and issue SERP) [S] | Medium | None | S18, `hr-attendance` | Build post |
| 13 | store llm prompts in a database with versions; prompt versioning django | Problem | How-to | Moderate (vendor SERP) | Medium | None | S13, `publishing-platform` | Build post |
| 14 | vllm litellm openai-compatible proxy self-hosted 12gb | Stack | How-to | Moderate (many generic guides, few on this hardware) [S] | Medium | None | S19, `local-inference` | Build post |
| 15 | tenant filter missing postgres row level security cross tenant leak | Problem | Decision | Moderate (hard as a head term) | Medium | None | S07 (gated) | Incident post |
| 16 | mcp server design multiple companies tenant context | Design | Decision | Easy | Medium | None | S16, `erp-agent-layer` | Decision post |
| 17 | langgraph deterministic pipeline before the llm | Design | Informational | Moderate | Medium | None | S20, `hiretrack` | Build post |
| 18 | hiretrack mubashir rehman; hiretrack open source job tracker | Brand | Navigational | Moderate (at least seven unrelated GitHub repos and one commercial site share the name) [S] | Medium | Unknown | `/projects/hiretrack/` | Case study |
| 19 | mubashir rehman ecg; the paper title | Name plus paper | Informational | Easy with the name, hard without (Springer, arXiv, ADS own the title) [S] | Medium | Springer, arXiv, ADS outrank | About paper block | About |
| 20 | erpnext developer pakistan; frappe developer lahore | Role plus location | Commercial | Moderate (consultancy and partner pages) | Medium | Unknown | `/for/erp-hrms/` | Role page |
| 21 | cloudfront distribution creation blocked verification; waf on alb instead of cloudfront | Symptom | Decision | Easy | Low to medium | None | S15 | Decision post |
| 22 | vendor lock-in assessment effort estimate | Design | Decision | Hard | Low | None | S17 | Decision post |
| 23 | ai backend engineer pakistan; llm engineer lahore | Role plus location | Job seeker | Hard to moderate (few listings) | Low to medium | Unknown | `/for/ai-backend/` | Role page |
| 24 | backend engineer lahore; python developer pakistan remote | Role plus location | Job seeker | Very hard (job boards) [S] | Low | Not expected | `/for/backend/` (on-page terms only) | Role page |
| 25 | ai agents on an existing erp; add ai to a system of record | Problem (founder) | Investigational | Hard | Low | None | `/services/` headings, `erp-agent-layer` | Services copy |

### 2.3 Who owns each SERP (competitor comparison, adapted)

A head-to-head against commercial competitors does not fit a personal portfolio, and no backlink or
keyword tool was connected, so this compares SERP owners by intent class.

| Intent class | SERP owners [S] | What they have that this site lacks | What would beat them |
|---|---|---|---|
| Name | LinkedIn, ZoomInfo, GitHub, the site | Domain authority, profile-page structure | Consistent entity signals, `sameAs` both ways, a fact-dense About page |
| Role plus location | Job boards | Fresh listings at scale | Nothing; do not compete |
| Symptom, queues, auth, cloud | Stack Overflow, vendor docs, GitHub issues, Medium, DEV | Volume and vendor authority | An incident write-up with the exact symptom, the wrong turn, the cause and the check that proved it |
| Symptom, agents and browsers | Tool docs, forum threads, aggregator blogs | Recency | A reproduced failure and the rule that followed |
| Self-hosted LLM | Aggregator blogs, docs sites (Towards Data Science, Qovery, Spheron, Qwen docs) | Breadth | A stated method on one specific 12 GB card. The record has no benchmark numbers, so a fresh dated measurement is what makes this citable. |
| Paper | Springer, arXiv, ADS | The paper itself | Nothing for the title; win name plus paper |
| Brand, HireTrack | Several unrelated repos, a commercial site | Older repos | A distinct descriptor, the author name, a case study |

A peer-portfolio benchmark (three engineer sites with strong case studies) was not done: it needs a
crawl tool. Do it once by hand after launch. UX Appendix A names three commonly cited examples.

### 2.4 Role-track names against demand [R]

Labels follow the UX and content-bank vocabulary (Backend, AI backend, Full-stack, ERP and AI, or
"ERP with AI" in the bank; the CD picks one). Slugs never change.

| Track | Search and job-title vocabulary | SEO note |
|---|---|---|
| Backend (`/for/backend/`) | "Python backend engineer" and "Django developer" beat "Backend / API engineer" | Put "Python" and the stack in the title |
| AI backend (`/for/ai-backend/`) | "AI engineer" and "LLM engineer" dominate titles; "AI backend engineer" is rarer, which suits a niche page | Keep the label; add "LLM" and "agents" on the page |
| ERP and AI (`/for/erp-hrms/`) | "ERPNext developer" is the searched noun; "ERP and AI" has no search vocabulary | Whatever the label, the title and the fit line contain "ERPNext developer" |
| Full-stack (`/for/full-stack/`) | "Full stack developer" is high volume and saturated | Value is recruiter matching, not search |

None of these pages will rank for its head term. They exist for recruiters (linked from résumés and
LinkedIn) and for name plus role queries.

### 2.5 Question keywords worth answering [R]

Only questions he can answer from first-hand work, taken from the editorial plan's symptom queries:

- Why does a dead-letter queue keep growing, and what stops it?
- How do you run several coding agents safely against a production system?
- How do you put a concurrency limit and a timeout on a search that fans out to many services?
- What do you do when AWS KMS keys show as pending deletion?
- Why do websocket messages arrive as strings, and why does a hotfix not fix it?
- Why did an ECS health check roll back my stack and delete the load balancer?
- How do you store LLM prompts in a database with versions?
- What is a deterministic-first LLM pipeline?
- Who is Mubashir Rehman, where does he work, and is he open to remote roles?

Mine People Also Ask, related searches and the questions recruiters and founders actually email,
then feed them to the editorial queue.

---

## 3. Page-level plan

### 3.0 Global rules (every template)

**Titles.**

- New suffix ` | Mubashir Rehman`: **18 characters** including the separator, replacing 37. It
  matches the proposed `WebSite.name`. Change `profile.seo.baseTitle` and drop the em dash.
  UX (Q4) and the editorial plan (§2.1) already assume this suffix.
- Logic in `Base.astro`: if the title already contains "Mubashir Rehman", no suffix; otherwise
  append the suffix only if the total stays at or under 60; otherwise the title stands alone (the
  site name shows separately above a result title in Google, so the suffix is redundant on long
  titles [R]). The `seoTitle` budget is therefore **42 characters when the suffix should apply and 60
  when it should not**. CI fails any full title over 60 and any em dash in a `<title>`.
- Use a colon, not a dash, as the internal separator.
- "Résumé" follows the UX vocabulary in visible copy. Engines fold diacritics in matching [R], but
  check Search Console for "resume" versus "résumé" impressions after launch. URLs and file names
  stay ASCII (`/resume/`).

**Descriptions.** 120 to 155 characters, unique, first clause says what the page is, contains the
primary term, one concrete fact only if the content bank allows it. Stored per route in the content
schema with `.max(155)`. "Open to remote roles" appears on home, role pages and contact only.
"Any timezone" stays off SEO surfaces until the content lead resolves G18 (it can be read as a
work-authorisation claim).

**H1.** Exactly one; matches the title's meaning; contains the primary term. The UX blueprints set
the exceptions (home hero line, 404). Footer and chrome never use heading elements.

**Breadcrumbs.** Visible on case studies and posts (UX §6.1), and on any other page that emits
`BreadcrumbList`. JSON-LD mirrors what is visible.

**Canonical and sitemap.** Keep the current normalisation. `lastmod` only where a real date exists:
posts and case studies use `updated ?? date`, About uses its `updated`; omit elsewhere, because a
build-time date on every URL teaches crawlers to ignore the field [R]. Redirect stubs and archived
posts never appear in the sitemap.

**Robots meta.** On indexable pages emit `max-snippet:-1, max-image-preview:large`. Snippet-blocking
directives reduce eligibility for AI features (`docs/seo-references/ai-optimization-guide.md`), so be
explicit that none is wanted. `noindex` only on non-canonical hosts, the 404 and any retired page.

**Social.** Per-page 1200x630 OG image (plan §8.4) with `og:image:width`, `og:image:height`,
`og:image:alt`, `twitter:image:alt`. `og:type` is `article` for posts and case studies, `website`
elsewhere, with `article:published_time`, `article:modified_time`, `article:section`, `article:tag`,
and `article:author` set to the About URL. Keep `/og-image.png` as the fallback.

### 3.1 Core routes

**`/` Home** (UX §3.1)

- Title: `Mubashir Rehman: Backend Engineer, AI Automation, Lahore` (56, no suffix).
- Description (144): "Mubashir Rehman is a backend engineer in Lahore building Python, Django and FastAPI systems, with AI and automation where they earn their place."
- H1: the hero line (content bank line A), as UX recommends. **Confirmed (UX Q3):** that is enough
  for the entity if four conditions hold: the `<title>` and JSON-LD carry name and role; the
  identity sentence is the first text after the H1 and the decorative figure (UX puts it there);
  the header wordmark is the full name in a link (UX §2.4); and "backend engineer" plus "Lahore"
  appear within the first 40 words. Fallback if the recruiter test fails: identity sentence above
  the H1.
- Lede: use the UX sentence, minus "any timezone" for now: "Backend engineer in Lahore with 3+ years
  in production, open to remote roles."
- Schema: `WebSite` and full `Person` in one `@graph` (§4). `ScholarlyArticle` and
  `SoftwareSourceCode` leave this page.
- Links out: three flagship case studies (function-based titles as anchors), the four role links,
  the two latest posts, the résumé, contact. No stat tiles (UX rejects them): a number appears only
  in a sentence that links to the page proving it.

**`/about/`** (UX §3.4)

- Title: `About Mubashir Rehman, Backend Engineer in Lahore` (49, no suffix).
- Description (148): "Mubashir Rehman is a backend engineer in Lahore. His timeline, how he works, and the peer-reviewed ECG and ML paper he co-authored (Springer, 2025)."
- H1: UX says "About". Acceptable if the first words of the bio are "Mubashir Rehman is…", which the
  answer-first bio already requires.
- Must contain: the bio, the facts block as a `<dl>` (UX §7.3, §5.5 here), the working rules with
  stable `#rule-n` anchors and one evidence link each (each a contextual internal link), the
  timeline, the paper block (citation string, DOI, links, "third of seven authors" and the
  contribution sentence, PS-01 and PS-02 wording exactly), plain visible links to LinkedIn, GitHub,
  Scholar and ORCID.
- Schema: `ProfilePage` with `mainEntity` the full `Person`, and the `ScholarlyArticle` for the
  paper; `BreadcrumbList`. There is no separate paper page (content bank CS-22 puts it on About).

**`/projects/` (Work)** (UX §3.2)

- Title: `Work: Backend, AI and Automation Systems` plus suffix (58).
- Description (130): "Case studies by Mubashir Rehman: AI backends, integrations, ERP and HRMS, self-hosted LLM inference, and what broke along the way."
- H1: "Work". Case studies as rows linking to their pages; "Smaller builds" as a plain list with no
  URLs (thin-page rule, §3.4). No filter at launch (UX §2.1), so no parameter URLs.
- Schema: `CollectionPage` with an `ItemList` of case studies; `BreadcrumbList`.

**`/journal/` (Writing)** (UX §3.5, editorial plan)

- Title: `Writing: Incident Reports and Lab Notes` plus suffix (57).
- Description (121): "Incident reports, lab notes and build logs on backend systems and applied AI, by Mubashir Rehman. The answer comes first."
- H1: the section label the CD chooses (UX "Writing"; editorial D7 prefers "Field notes"). Use it
  identically in nav, H1, breadcrumb and schema `name`. The URL stays `/journal/`. If "Field notes"
  wins, keep "incident reports" and "lab notes" in the title, because those are the searchable nouns.
- Content: reverse-chronological rows (type, title, lede, date). No tag archives. Series appear as
  a group with "Part n of m" (UX); no series URL at launch (§13.2).
- Schema: `Blog` with `blogPost` references; `BreadcrumbList`.
- Feed `/rss.xml`: add `<language>`, `<lastBuildDate>`, `atom:link rel="self"`, full-text
  `content:encoded`; exclude archived posts; title without a dash.

**`/services/` (Problems I solve)** (UX §3.8, §2.5)

- Title: `Problems I Solve` plus suffix (34).
- Description (152): "Messy multi-system workflows, brittle integrations, AI features that must ship. The problems Mubashir Rehman likes to solve. Open to select engagements."
- H1: "Problems I solve". Headings are five symptoms in the reader's own words (UX): keep them as real
  questions people type, because this page is the low-profile front door for founders. Each links to
  the case study that proves it; that is where the page earns its internal-link value.
- Deliberately not targeted: marketplace-style "hire a developer" queries.
- Schema: `WebPage` and `BreadcrumbList`. **No `Service` or `ProfessionalService`** (UX asked; confirmed).
  No pricing, packages or engagement-model steps. Keep it out of the nav (UX) but in the sitemap and footer.

**`/contact/`** (UX §3.9)

- Title: `Contact` plus suffix (25).
- Description (113): "Email Mubashir Rehman about a backend or AI automation role. Based in Lahore, Pakistan, and open to remote roles."
- H1: "Contact". Email as visible link text. UX recommends the phone number live in the résumé PDF, not
  the site; SEO agrees (scrapers harvest visible numbers).
- Schema: `ContactPage`, `BreadcrumbList`. `email` only here and on About.

**`/404`** (UX §3.10): `noindex`; no canonical; no `Person`; H1 "Nothing here."; five links.

**`/resume/*.pdf`**

- Regenerate at the same URLs (plan §4, phase 5). Set Title ("Mubashir Rehman, {Role} Résumé"),
  Author ("Mubashir Rehman"), Subject and Keywords; link to the canonical domain only (never the
  `github.io` host).
- Keep them indexable. Trade-off: an indexed PDF can outlive its content, mitigated by regenerating
  in place. GitHub Pages cannot send `X-Robots-Tag`, so the only alternative is `Disallow: /resume/`,
  which hides them from "Mubashir Rehman résumé" searches entirely.
- Each role page and Contact link the matching PDF with descriptive text ending "(PDF)".
- Remove `public/resume/Mubashir-Rehman-Full-Stack.md`. It never had an inbound link, so the 404 is
  acceptable, but it is a removed URL: get the CD's sign-off (§10.1).

### 3.2 `/how-i-work/`

UX decided and SEO agrees: no page. The working rules live in `/about/` with stable anchors
(`#rule-1`…), each backed by one evidence link. A standalone principles page has no query demand
[R]. Each post ends with "the rule I took from this" (editorial §2.7); those rules feed About, which
gives the numbered-principles device a citation key. Promotion trigger stays UX's: five or more posts
carrying a rule.

### 3.3 Role pages `/for/[role]/`

Slugs unchanged, so no redirects. Structure and word caps are UX §3.7 (285 words, cap 320).

| Slug | Title (page part, chars) | Total with suffix | Fit-line opening | Description (chars) |
|---|---|---|---|---|
| `backend` | Python Backend Engineer: Django, FastAPI (40) | 58 | "Python backend engineer in Lahore…" | "Python backend engineer in Lahore: Django, FastAPI, PostgreSQL and Docker, with 3+ years of full-time work. Open to remote roles." (129) |
| `ai-backend` | AI Backend Engineer: LLMs, Agents, Search (41) | 59 | "AI backend engineer in Lahore…" | "AI backend engineer in Lahore: LLM agents, pgvector semantic search and self-hosted model serving. Open to remote roles." (120) |
| `erp-hrms` | ERPNext Developer: Frappe, AI Agents (36) | 54 | "ERPNext and Frappe developer in Lahore…" | "ERPNext and Frappe developer in Lahore: an internal ERP that replaced three tools, plus AI agents inside a live ERP. Open to remote roles." (138) |
| `full-stack` | Full-Stack Engineer, Backend-Leaning (36) | 54 | "Backend-leaning full-stack engineer in Lahore…" | "Backend-leaning full-stack engineer in Lahore: Python APIs, React and TypeScript front ends, and a healthcare operations console. Open to remote roles." (151) |

H1 is the track label the CD chooses (UX: "Backend", "AI backend", "Full-stack", "ERP and AI"). For
the ERP track the title and the fit line must still say "ERPNext developer".

**Indexing decision (UX §3.7 left it to SEO): index all four, self-canonical, in the sitemap.**
They are the URLs linked from résumés and LinkedIn, one already ranks second for the name plus role
query [S], and each is distinct enough (different evidence order, different stack tags, different
answers). Mitigation: unique evidence order and page-specific answers, as UX specifies. Monitor:
if Search Console reports "Duplicate, Google chose different canonical" for a role page after eight
weeks, `noindex` that page and keep it linked for recruiters.

**FAQ (UX: 3 or 4 recruiter questions, answers at most 30 words).** The questions may repeat across
pages; the answers must not. Availability is a visible fact in Practicalities, not an FAQ. Use
`FAQPage` markup only if three unique visible questions remain (low priority, §4).

Schema: `WebPage` with `about` referencing `#person`, `BreadcrumbList`; drop the per-page
`ProfilePage` and the varying `jobTitle`.

Links in: home role router, footer, résumé PDFs, LinkedIn Featured. Links out: three case studies
(UX evidence list), the matching PDF, one or two posts from the matching cluster (content-bank §4.3
gives each track's lead evidence), other roles as plain links (UX).

### 3.4 Case studies `/projects/[slug]/`

Structure, order, word caps (850) and eligibility test (two real decisions with a rejected
alternative, one real failure, one verifiable fact) are UX §3.3, §7.1 and §2.2. SEO adds:

- **URL.** Lowercase, hyphenated, function-first, at most four words, permanent, no product or
  client name, and never derived from a `projects.json` `id`. Use the editorial plan's aliases as
  slugs so a post's `caseStudy` field, the alias in the text and the URL all agree. **Slug conflict
  to resolve before launch (§13.3):** UX proposes `dental-ai-front-desk` and
  `social-intelligence-backend`; the editorial plan's alias glossary uses `clinic-front-desk` and
  `alerting-backend` and says "dental" adds identifying weight for no teaching value. SEO prefers the
  editorial slugs: less identifying, and the keyword weight belongs in the title, not the slug.
- **`seoTitle` and `seoDescription`.** Optional frontmatter, defaulting to `title` and `summary`.
  `title` (H1, at most 45) stays function-based; `seoTitle` may add the stack noun a searcher types.
- **First paragraph** is the 20-word summary (answer-first). H2 text is UX's fixed set; each decision
  heading is the decision's own title, phrased as a question where honest.
- **System diagram:** inline SVG with `<title>` and `<desc>`, the numbered legend as the text
  equivalent (UX §3.3). Nothing that matters exists only in the interactive version.
- **Schema:** `Article` (`articleSection: "Case study"`) and `BreadcrumbList`; HireTrack adds
  `SoftwareApplication` and `SoftwareSourceCode`.
- **Outcome facts** are stated in a sentence, tier A wording only, each with its evidence key.
- **Page-end note** ("Working on something similar? Email me.") is the only client-shaped sentence
  (UX §2.5). It is not a heading and not a link to `/services/`.

Provisional page set, from the content bank's ranking (§4) and UX's launch list. Titles are
`seoTitle` suggestions with no suffix (all at or under 60):

| Slug | seoTitle (chars) | Primary query | Notes |
|---|---|---|---|
| `clinic-front-desk` | AI Voice Front Desk for Clinics: Multi-Tenant, on AWS (53) | multi-tenant voice agent; tenant isolation | CS-01 and CS-02 as one page, two chapters. Hub for S01, S02, S04, S06, S07, S08, S11, S12, S15, S17. Heaviest NDA and employer review. |
| `alerting-backend` | Message Ingestion and Alerting Backend: FastAPI, pgvector (57) | none (proof page) | CS-04. Verified sole authorship. Hub for S14. The financial domain stays out of the copy (editorial alias rule). |
| `erp-agent-layer` | AI Agents on a Live ERP: ERPNext and Tool-Calling (49) | ai agents erpnext | CS-05. The thinnest-competition niche; flagship for the ERP and AI track. Hub for S16. |
| `hiretrack` | HireTrack: Open-Source Résumé Tailor and Job Tracker (52) | hiretrack (with name) | CS-19. The one public, checkable build. Hub for S20. Repo is named `job-application-tracker`: align naming (§8). |
| `integration-console` | Operations Console for a Healthcare Integration Engine (54) | none | CS-06. Second wave. Hub for S03. No engine name, no compliance language, no team size. |
| `multi-tenant-saas-architecture` | Architecture for a Multi-Tenant Lead Intelligence SaaS (54) | none | CS-07. In progress; must be labelled design and demo. |
| `ai-agent-harness` | An Engineering Harness for AI Coding Agents (43) | run multiple coding agents safely | CS-03. Hub for S02, S08. High demand, high competition; the incidents are the differentiator. |
| `hr-attendance` | HRMS with Biometric Attendance, Then One ERP (44) | zkteco django integration | CS-09 and CS-10, past tense only. Short page. Hub for S18. |
| `publishing-platform` | Moving 28 Prompts into a Versioned Backend (42) | prompt versioning | CS-08. Short page. Hub for S13. |
| `local-inference` | Self-Hosted LLM Inference on One 12 GB GPU (42) | vllm litellm 12gb | CS-15. Short page or lab note. Needs a fresh dated measurement to be citable. Hub for S19. |

Recommended first wave at launch: `clinic-front-desk`, `alerting-backend`, `erp-agent-layer`,
`hiretrack` (UX: five at launch; the content lead decides after the eligibility test). Search-value
note for the CD: `hr-attendance` and `local-inference` have the best long-tail demand against
competition but thinner recruiter evidence, so they earn most of their search value as posts (S18,
S19) with a short case-study page behind them.

### 3.5 Post template `/journal/[slug]/`

Structure, formats and word budgets are UX §3.6 and §7.2 and the editorial plan §1.5 and §2. SEO
requirements on top:

- `seoTitle` follows §3.0 (42 characters if the suffix should apply, otherwise up to 60). The H1 is
  the `title` and may be longer and more human. `seoDescription` at most 155, contains the
  `primaryKeyword`, and states the answer.
- **Primary keyword** appears in the H1, the first paragraph, one H2, the description and the slug
  (editorial gate). Slug is permanent and carries the keyword.
- **Answer first.** The lede (UX `shortAnswer`, at most 40 words) answers the title on its own; it
  is the snippet candidate. UX and the editorial plan describe the opening slightly differently
  (40-word lede plus optional "In brief" versus an 80 to 130 word intro plus a TL;DR); both satisfy
  SEO. §13.3 asks the CD to pick one.
- Every H2 and H3 has an `id`. UX's "On this page" rail covers case studies and long posts.
- Byline links to `/about/`. `<time datetime>` for published; "Updated" only with a visible
  `updateNote` (editorial schema requires one).
- Each post links to its case study and one sibling post, and at most one role page (UX §3.6).
- Exact error strings and symptom wording appear in the body (they are the queries in §2.2).
- `FAQPage` only when the visible "Questions" section exists (UX: 2 to 4 real questions).
- Schema: `BlogPosting` and `BreadcrumbList` (§4).

### 3.6 Internal-linking matrix

| From | Must link to | Should link to | Anchor guidance |
|---|---|---|---|
| Home | 3 flagship case studies, 4 role pages, 2 latest posts, About | Contact | Function-based title as the anchor, never "read more" |
| About | Every timeline entry's case study, each rule's evidence, résumé | Latest post | Name the system, not the page |
| Case study | Author (`/about/`), its posts, one role page | Next case study; `/services/` only through the page-end note | Question or claim as anchor text |
| Post | Author, its case study | One sibling post, one role page at most | Inline in the sentence that needs the reference |
| Role page | 3 case studies, matching PDF, contact | 1 to 2 posts, other roles | Role plus system |
| Services | 4 to 5 case studies (one per problem) | Contact | The symptom in plain words |
| Work, Writing index | Every child page | Contact | Title as anchor |

Rule: every indexable page has at least three contextual inbound links (nav and footer excluded);
CI reports pages below that as a warning (§11). Résumé PDFs get two: the role page and Contact.

---

## 4. Structured data plan

### 4.1 Principles

1. **One `@graph` per page** in a single `<script type="application/ld+json">`, produced by one
   helper (for example `src/lib/schema.ts`) from the data layer. No hand-written JSON-LD in `.astro`
   pages, so the shapes cannot drift again.
2. **Stable `@id`s.** `https://mubashir-rehman.is-a.dev/#person`, `/#website`, and per page
   `{canonical}#webpage`, `#article`, `#breadcrumb`.
3. **URL policy.** Every on-domain absolute URL ends in `/` unless it has a file extension
   (CLAUDE.md rule 1). `Person.url` is the About page; `WebSite.url` is the root. Both come from one
   `SITE` constant, never from `profile.website` (no trailing slash today).
4. **Person weight.** Full node on `/` and `/about/`. Elsewhere an inline slim node (`@type`, `@id`,
   `name`, `url`), because Google evaluates each page on its own and does not resolve an `@id`
   defined on another URL. Every `@id` reference must be defined in the same page's graph (CI checks it).
5. **Visibility parity.** Anything in JSON-LD is visible on that page, except entity facts on the
   two pages that own the `Person`.
6. **Only what the content bank allows.** No `offers`, `aggregateRating`, `isAccessibleForFree` or
   `license` unless verified; no invented dates; no figure outside tier A wording; no institution
   dates (education is disputed); `knowsAbout` curated against the record's `skills.md`, dropping
   anything not claimed (the automation tool, PyTorch).
7. **`email` on About and Contact only.**
8. **`FAQPage` only where honest and visible** (§5.4). Google reportedly retired the FAQ rich
   result on 7 May 2026 [S, secondary sources]; the markup stays valid schema.org and costs nothing,
   but it is low priority.
9. **Drop:** `ProfessionalService`, per-role `ProfilePage` and `Person` variants, `jobTitle`
   overrides, the ORCID-as-`@id` pattern, `ScholarlyArticle` and `SoftwareSourceCode` on the home page.
10. **Validate** in CI (§11) and by hand at launch with Google's Rich Results Test and the Schema
    Markup Validator (unreachable from the sandbox).

### 4.2 Coverage matrix

| Route | Nodes |
|---|---|
| `/` | `WebSite`, `Person` (full) |
| `/about/` | `ProfilePage`, `Person` (full, with `email`), `ScholarlyArticle`, `BreadcrumbList` |
| `/projects/` | `CollectionPage`, `ItemList`, `BreadcrumbList` |
| `/projects/[slug]/` | `Article`, `BreadcrumbList`, slim `Person`; HireTrack adds `SoftwareApplication` and `SoftwareSourceCode` |
| `/journal/` | `Blog`, `BreadcrumbList` |
| `/journal/[slug]/` | `BlogPosting`, `BreadcrumbList`, slim `Person`, `FAQPage` only with a visible FAQ |
| `/for/[role]/` | `WebPage`, `BreadcrumbList`, slim `Person`, `FAQPage` only with three or more unique visible questions |
| `/services/` | `WebPage`, `BreadcrumbList`, slim `Person` |
| `/contact/` | `ContactPage`, `BreadcrumbList`, slim `Person` plus `email` |
| `/404` | none |

### 4.3 Skeletons

Values in double braces come from the data layer. Do not hard-code the figures.

**Identity graph (home; About adds the `ProfilePage` and the paper)**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://mubashir-rehman.is-a.dev/#website",
      "url": "https://mubashir-rehman.is-a.dev/",
      "name": "Mubashir Rehman",
      "alternateName": ["Mubashir Rehman Portfolio"],
      "description": "{{profile.seo.baseDescription}}",
      "inLanguage": "en",
      "publisher": { "@id": "https://mubashir-rehman.is-a.dev/#person" }
    },
    {
      "@type": "Person",
      "@id": "https://mubashir-rehman.is-a.dev/#person",
      "name": "Mubashir Rehman",
      "givenName": "Mubashir",
      "familyName": "Rehman",
      "url": "https://mubashir-rehman.is-a.dev/about/",
      "mainEntityOfPage": "https://mubashir-rehman.is-a.dev/about/",
      "jobTitle": "Backend Software Engineer",
      "description": "{{content bank one-line bio, section 6.2}}",
      "image": {
        "@type": "ImageObject",
        "url": "https://mubashir-rehman.is-a.dev/mubashir-rehman.webp",
        "width": 400,
        "height": 400
      },
      "address": { "@type": "PostalAddress", "addressLocality": "Lahore", "addressCountry": "PK" },
      "nationality": { "@type": "Country", "name": "Pakistan" },
      "worksFor": { "@type": "Organization", "name": "TransData", "url": "https://transdata.biz/" },
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Information Technology University",
        "url": "{{ITU website, verify}}"
      },
      "knowsAbout": ["{{curated list, 20 or fewer, from skills.md}}"],
      "sameAs": [
        "https://github.com/mubashir-rehman",
        "https://www.linkedin.com/in/mubashir-rehman/",
        "https://scholar.google.com/citations?user=-N7lsKsAAAAJ",
        "https://orcid.org/0009-0000-5804-0759",
        "https://stackoverflow.com/users/23617259/mubashir-rehman"
      ]
    }
  ]
}
```

Notes: ORCID and Stack Overflow stay in `sameAs` only after the content lead confirms they are his
and wanted (content bank §1.2). Use exactly one LinkedIn spelling everywhere (the bank asks for a
pick; `www` and trailing slash here). Append dev.to and Hashnode when those accounts exist. Add
`email` on About and Contact only. Optionally turn the six main `knowsAbout` entries into `Thing`
objects with a Wikipedia `sameAs`; verify each URL at build. Do not add `knowsLanguage`, `award`,
`affiliation` or `hasOccupation` figures the record does not hold.

**About: `ProfilePage` and the paper (added to the graph)**

```json
[
  {
    "@type": "ProfilePage",
    "@id": "https://mubashir-rehman.is-a.dev/about/#webpage",
    "url": "https://mubashir-rehman.is-a.dev/about/",
    "name": "About Mubashir Rehman, Backend Engineer in Lahore",
    "isPartOf": { "@id": "https://mubashir-rehman.is-a.dev/#website" },
    "mainEntity": { "@id": "https://mubashir-rehman.is-a.dev/#person" },
    "breadcrumb": { "@id": "https://mubashir-rehman.is-a.dev/about/#breadcrumb" },
    "dateCreated": "{{first publish, ISO}}",
    "dateModified": "{{last material edit, ISO}}",
    "inLanguage": "en"
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://mubashir-rehman.is-a.dev/about/#paper",
    "headline": "{{publications[0].title}}",
    "author": [
      { "@type": "Person", "name": "{{author 1, from publications[0].authors}}" },
      { "@type": "Person", "name": "{{author 2}}" },
      { "@type": "Person", "@id": "https://mubashir-rehman.is-a.dev/#person", "name": "Mubashir Rehman" }
    ],
    "datePublished": "{{full ISO date from the Springer page, not only the year}}",
    "isPartOf": {
      "@type": "Periodical",
      "name": "Circuits, Systems, and Signal Processing",
      "publisher": { "@type": "Organization", "name": "Springer" }
    },
    "identifier": { "@type": "PropertyValue", "propertyID": "DOI", "value": "10.1007/s00034-025-03048-2" },
    "url": "https://link.springer.com/article/10.1007/s00034-025-03048-2",
    "sameAs": [
      "https://doi.org/10.1007/s00034-025-03048-2",
      "https://arxiv.org/abs/2308.04355"
    ]
  }
]
```

List all seven authors in published order (the person is third). Fixes over today's version: he
resolves to `#person` (ORCID stays in `sameAs`), journal and publisher are separated,
`datePublished` should be the exact date (the Springer page could not be opened from the sandbox),
and no result figure appears in the markup. On the page, use PS-01 and PS-02 wording only: "third of
seven authors", the contribution sentence, both results with the sample count, and no "equal
contribution" until the Springer PDF has been checked (G13).

**Slim author node (every page that names the author)**

```json
{
  "@type": "Person",
  "@id": "https://mubashir-rehman.is-a.dev/#person",
  "name": "Mubashir Rehman",
  "url": "https://mubashir-rehman.is-a.dev/about/"
}
```

**`BlogPosting`**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": "{{canonical}}#article",
      "mainEntityOfPage": { "@type": "WebPage", "@id": "{{canonical}}" },
      "headline": "{{title, 110 characters or fewer}}",
      "description": "{{seoDescription}}",
      "image": ["{{per-post OG image URL, 1200x630 or larger}}"],
      "datePublished": "{{ISO date}}",
      "dateModified": "{{updated ?? date}}",
      "author": { "@type": "Person", "@id": "https://mubashir-rehman.is-a.dev/#person", "name": "Mubashir Rehman", "url": "https://mubashir-rehman.is-a.dev/about/" },
      "isPartOf": { "@type": "Blog", "@id": "https://mubashir-rehman.is-a.dev/journal/#blog" },
      "articleSection": "{{format: incident, decision, lab note, build log}}",
      "keywords": "{{tags, comma separated}}",
      "about": [{ "@type": "Thing", "name": "{{primaryKeyword}}" }],
      "inLanguage": "en"
    },
    { "@type": "BreadcrumbList", "@id": "{{canonical}}#breadcrumb", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mubashir-rehman.is-a.dev/" },
      { "@type": "ListItem", "position": 2, "name": "{{section label}}", "item": "https://mubashir-rehman.is-a.dev/journal/" },
      { "@type": "ListItem", "position": 3, "name": "{{title}}", "item": "{{canonical}}" }
    ] }
  ]
}
```

The current schema names a `Person` as `publisher` and uses the generic OG image; both go. If the
post belongs to a series, add `isPartOf` with a `CreativeWorkSeries` node (`name`, `position` on the
post) only when the series has a visible group on the index (§13.2).

**Case study `Article`**

```json
{
  "@type": "Article",
  "@id": "{{canonical}}#article",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "{{canonical}}" },
  "headline": "{{title}}",
  "description": "{{summary, 20 words or fewer, plus one scope fact}}",
  "image": ["{{per-page OG image URL}}"],
  "datePublished": "{{ISO}}",
  "dateModified": "{{ISO}}",
  "articleSection": "Case study",
  "author": { "@type": "Person", "@id": "https://mubashir-rehman.is-a.dev/#person", "name": "Mubashir Rehman", "url": "https://mubashir-rehman.is-a.dev/about/" },
  "about": [{ "@type": "Thing", "name": "{{system type, by function}}" }],
  "mentions": [{ "@type": "Thing", "name": "{{key technology}}" }],
  "inLanguage": "en"
}
```

**HireTrack additions** (only fields the data layer holds; no `offers`, no `license` until a LICENSE
file is confirmed)

```json
[
  {
    "@type": "SoftwareApplication",
    "@id": "https://mubashir-rehman.is-a.dev/projects/hiretrack/#software",
    "name": "HireTrack",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "url": "{{projects.hiretrack.demo}}",
    "description": "{{summary sentence}}",
    "author": { "@id": "https://mubashir-rehman.is-a.dev/#person" },
    "sameAs": ["https://github.com/mubashir-rehman/job-application-tracker"]
  },
  {
    "@type": "SoftwareSourceCode",
    "@id": "https://mubashir-rehman.is-a.dev/projects/hiretrack/#code",
    "name": "HireTrack source code",
    "codeRepository": "https://github.com/mubashir-rehman/job-application-tracker",
    "programmingLanguage": "TypeScript",
    "targetProduct": { "@id": "https://mubashir-rehman.is-a.dev/projects/hiretrack/#software" },
    "author": { "@id": "https://mubashir-rehman.is-a.dev/#person" }
  }
]
```

Google offers no rich result for either type without `offers` or reviews; this is entity markup for
answer engines. Drop it if it feels like padding. Add a slim `Person` node to the page graph so both
`@id` references resolve.

**`FAQPage` (rules in §5.4)**

```json
{
  "@type": "FAQPage",
  "@id": "{{canonical}}#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{{question exactly as shown on the page}}",
      "acceptedAnswer": { "@type": "Answer", "text": "{{answer exactly as shown on the page}}" }
    }
  ]
}
```

**Role page, services, contact, indexes** (compact)

```json
{ "@type": "WebPage", "@id": "{{canonical}}#webpage", "url": "{{canonical}}", "name": "{{title}}",
  "description": "{{description}}", "isPartOf": { "@id": "https://mubashir-rehman.is-a.dev/#website" },
  "about": { "@id": "https://mubashir-rehman.is-a.dev/#person" },
  "breadcrumb": { "@id": "{{canonical}}#breadcrumb" }, "inLanguage": "en" }
```

- Contact uses `"@type": "ContactPage"` with the same fields; `email` is allowed here.
- Work index: `CollectionPage` plus `mainEntity` `ItemList` with `ListItem`s (`position`, `url`,
  `name`) for each case study.
- Writing index: `Blog`, `@id` `https://mubashir-rehman.is-a.dev/journal/#blog`, `name` the chosen
  section label, `url`, slim author, `blogPost` references to each post's `@id`.

---

## 5. AEO patterns (answer engines)

Google's own guidance says no special files, markup or "chunking for AI" are needed and that pages
should be written for people (`docs/seo-references/ai-optimization-guide.md`). Everything below is
ordinary good writing that is also easy to lift, so it is safe under that guidance. The editorial
plan and UX blueprints already adopt most of it; this section is the SEO statement of the rules.

### 5.1 Answer-first paragraphs

Under any heading that poses a question, the first sentence answers it in 30 words or fewer and can
stand alone if quoted. The second gives the boundary condition. Evidence follows. Template, with
placeholders only:

> **Why does a dead-letter queue keep growing?**
> A dead-letter queue keeps growing when {the producer keeps making jobs that cannot succeed}. In
> this case {the specific cause, in one clause}. {What was seen, what was changed, what proved it,
> and what was not measured.}

Rules: name the subject in the first sentence (a paragraph opening "This" or "It" is useless when
lifted); state "not measured" instead of estimating; no preamble ("In this post"). This matches
UX's lede and the editorial "answer first" move.

### 5.2 Question headings

- Use a question as an H2 when a real question exists (§2.5, People Also Ask, recruiter and
  founder emails). Otherwise use the noun phrase or the claim people search. Never "Introduction".
- Phrase it the way the searcher would, not the way the author would; include the exact error
  string where there is one.
- Three to five question or claim headings in a 1,200-word post, not every H2 (UX §3.6: 2 to 5
  sections of 60 to 200 words).
- Every H2 and H3 has an `id`.

### 5.3 Definitions, tables and lists

**Definitions.** For each term he uses or coins, 40 to 60 words directly under the heading that
introduces it. Generic, claim-free drafts:

- Deterministic-first pipeline: "A deterministic-first pipeline does everything it can with rules,
  parsers and schema checks, and asks a language model only for the fields that remain unresolved.
  The model is the last tier of the fallback, not the first, so most runs are cheap, repeatable and
  easy to audit."
- Bring-your-own-key: "Bring-your-own-key means the app never holds a shared model account. The user
  supplies their own provider API key, the app calls the provider on their behalf, and the cost and
  the data-handling terms stay between the user and that provider."
- Circuit breaker: "A circuit breaker stops a caller from retrying something that keeps failing. After
  a set number of failures it opens and skips the call, then closes again when a check shows the
  dependency works."

**Tables.** A real `<table>` with a `<caption>` and `<th scope>` when comparing three or more
options on three or more criteria, or for a "choose X when, choose Y when" summary. Short,
self-contained cells (assistants quote row by row). At most one table per 500 words. Never an image
of a table. **Lists.** `<ol>` for procedures (one action per item), `<ul>` for parallel items,
`<dl>` for facts (§5.5). Diagrams get a text equivalent (§6.4).

### 5.4 FAQ placement rules

1. Only questions people actually ask (Search Console queries, People Also Ask, recruiter and
   founder emails). Never invented to fit a keyword.
2. The Q and A are visible and identical to any `FAQPage` markup, or there is no markup.
3. Role pages: 3 or 4 recruiter questions, answers at most 30 words, and the **answers differ per
   page** (UX §3.7). Availability is a visible fact, not a question. Posts: 2 to 4 real questions,
   answers at most 50 words (UX §3.6). Never on home, contact or services. No pricing or
   engagement-model FAQ anywhere.
4. The first sentence of an answer stands alone and names the subject.
5. Voice: entity copy (FAQ answers, bios, `llms.txt`, JSON-LD text) is third person so it can be
   quoted without context; page prose stays first person (content bank §1.3 sets the same rule).
6. No figure appears in an FAQ that is not tier A wording in the content bank.

### 5.5 Fact blocks

One `<dl>` on About and a slice of it on each role page (UX §7.3), rendered from one data source.
Draft with content-bank values; the bank's rules on years and education are followed:

- Name: Mubashir Rehman
- Role: Backend software engineer
- Based in: Lahore, Pakistan
- Works: remote-first; on-site in Lahore
- Experience: 3+ years, full-time engineering
- Current employer: TransData, Software Engineer, since March 2025
- Education: BS Computer Science, Information Technology University (no years)
- Research: third of seven authors, Circuits, Systems, and Signal Processing, Springer, 2025, DOI 10.1007/s00034-025-03048-2
- Open source: HireTrack

### 5.6 Passage hygiene

One idea per section, a heading that says what the section answers, the subject named in the first
sentence, no dependence on the previous paragraph. Do not fragment pages into tiny sections "for AI".

---

## 6. GEO plan (generative engines)

Generative answers about a person are assembled from a handful of sources: the person's own site,
LinkedIn, GitHub, Scholar and ORCID, plus any third-party page that mentions them [R]. The lever is
consistency across those sources and a small set of quotable, dated, attributable facts. The content
bank (`10-content-bank.md` §1) already fixes the canonical facts; this section says where they must
appear and adds what SEO needs.

### 6.1 Entity consistency

One source of truth: the data layer for the site, and a short private text file for off-site
profiles. Each row must read identically wherever it appears.

| Field | Canonical value | Must match on |
|---|---|---|
| Name | Mubashir Rehman. Never "Mubashir Ur Rehman", "Muhammad Mubashir", "M. Rehman". | Site, JSON-LD, résumés, LinkedIn, GitHub, Scholar, ORCID, Stack Overflow, cross-posts, the paper's author string |
| Role line (visible) | "Backend software engineer, with AI and automation where they help" (bank §1.1) | Identity block, `llms.txt`, LinkedIn About, GitHub README, Scholar and ORCID biography |
| Role noun | "backend engineer" in titles and ledes; "Backend Software Engineer" as `jobTitle` and LinkedIn position. No other variants. | Site and JSON-LD; LinkedIn |
| Location and work | "Lahore, Pakistan. Remote-first. On-site in Lahore." No "any timezone" and no implied right to work elsewhere until G18 is resolved | Everywhere; "Lahore" in every off-site bio |
| Years | "3+ years, full-time engineering only" | Site, LinkedIn About; never "my last three years" |
| Current employer | TransData, Software Engineer, since March 2025 | Site, LinkedIn, Scholar affiliation line, `worksFor` |
| Availability | "Open to remote roles" | Site, LinkedIn, contact page |
| Photo | The same headshot | Site, LinkedIn, GitHub, Scholar, ORCID |
| Paper | Full title, journal "Circuits, Systems, and Signal Processing", Springer, 2025, DOI 10.1007/s00034-025-03048-2, "third of seven authors" | Site, Scholar, ORCID, LinkedIn Publications |
| HireTrack | "HireTrack: an open-source, offline-first job-application tracker and résumé tailor" | Site, GitHub repo description and README H1, LinkedIn Featured |
| Links | LinkedIn `https://www.linkedin.com/in/mubashir-rehman/`; every off-site profile links back to `https://mubashir-rehman.is-a.dev/` or `/about/` | The reciprocal half of `sameAs` |

### 6.2 Canonical strings to reuse

Use the content bank's; do not write new ones.

- **Role line (10 words):** "Backend software engineer, with AI and automation where they help."
- **One-line bio (27 words), feeds `Person.description` and `llms.txt`:** "Mubashir Rehman is a backend software engineer in Lahore, Pakistan (3+ years, full-time) who builds the systems behind messy, multi-system workflows and adds AI where it helps."
- **50-word and 150-word bios:** bank §1.5. Two conflicts for the CD: both mention "dental clinics" while the editorial plan (D1) recommends the alias "clinic", and both name a current product whose launch facts are employer-sensitive (G2). Resolve before they reach any SEO surface.
- **LinkedIn headline (133 of 220 characters):** "Backend software engineer | Python, FastAPI, Django, PostgreSQL | AI and automation | Lahore, remote-first | mubashir-rehman.is-a.dev"
- **GitHub bio (101 of 160 characters):** "Backend engineer in Lahore. Python, AI and automation systems. Case studies: mubashir-rehman.is-a.dev"

### 6.3 Quotable fact sentences

Third-person renderings of the content bank's tier A proof items, for About, role pages,
case-study fact blocks and `llms.txt`. Each keeps its bank ID and its constraints; if the bank's
wording changes, this list regenerates from it. One fact each, subject named.

| ID | Sentence | Constraint to keep |
|---|---|---|
| Identity | Mubashir Rehman is a backend software engineer in Lahore, Pakistan, with 3+ years of full-time engineering experience. | Years rule, bank §1.1 |
| PS-01 | He is the third of seven authors on a peer-reviewed paper in Circuits, Systems, and Signal Processing (Springer, 2025), DOI 10.1007/s00034-025-03048-2. His part was data collection, the ML pipeline, and model training and evaluation. | Co-author, never first or sole; DOI one click away |
| PS-02 | The study covered 42 subjects and 6,131 segmented samples. The best model, a random forest, reached R² 0.99 on the segmented data and R² 0.87 with transfer learning on the unsegmented set. | Quote both results and the sample count together; never attach 0.87 to ResNet-18 |
| PS-03 | He wrote 154 of the 155 commits in an intelligence backend built for a client, and handed it over when it was done. | Never name the client; a commit count proves authorship, not quality |
| PS-04 | He wrote 272 of the 389 commits behind a healthcare integration console, the largest share in the repository. | No team size, no product name |
| PS-05 | He moved 28 prompts out of 11 automation workflows into one versioned system, so a prompt change no longer needs a code deploy. | Scale of the migration, not usage; do not name the tool |
| PS-08 | He built and ran the internal ERP that replaced an HRMS, spreadsheet CRM tracking and a project-management tool. | Lead with what it replaced |
| PS-11 | He wrote all 89 commits of HireTrack, an open-source job-application tracker, and the repository is public. | Count dated 2026-07-24: recount or skip the number; no adoption claim |
| PS-13 | He led a team of four engineers building drone-control software at VeritusLabs. | Scope only |
| PS-14 | He set up the self-hosted model server his engineering team adopted: vLLM on one 12 GB GPU behind an OpenAI-compatible proxy. | Adoption is qualitative; no throughput or uptime |
| Availability | He is open to remote roles, and to on-site work in Lahore. | G18 |

Held back until cleared: PS-06 (HRMS scale, employer-sensitive), PS-16 (launch facts, G2), PS-12
(counts that keep moving).

### 6.4 Citation-worthy original assets

What answer engines and other authors cite is specific, dated and hard to fabricate. In order of
value for this site (the editorial plan already produces the first four):

1. **Incident write-ups** with the exact symptom, the wrong turn, the cause, the check that proved
   it, and "what I got wrong". No client names, no colleagues, reconstructed code labelled as such.
2. **Reproduced failures with exact error strings** (a key pending deletion, a health-check command
   not found, a token issued in the future). These are the queries in §2.2.
3. **Decision records** with the rejected alternative and the cost accepted.
4. **The rulebook.** Numbered rules with stable `#rule-n` anchors on About, each backed by an
   evidence link. Numbered, quotable, attributable to one author: the site's most distinctive asset.
5. **Diagrams as inline SVG** with `<title>`, `<desc>`, caption and a numbered text legend.
6. **A fresh, dated measurement** for the self-hosted inference note: hardware, model,
   quantisation, context length, settings, date. The record has no benchmark numbers, so this is the
   one asset that has to be created rather than written up. "Not measured" is publishable; an
   estimate is not.
7. **Repo READMEs written as documentation** (HireTrack first). Assistants draw on GitHub READMEs
   heavily [R]; the README H1 and first line must match §6.1.
8. **Consistently used coined terms** ("deterministic-first", "boring on purpose") if they are his.

### 6.5 `llms.txt` and `llms-full.txt`

Evidence: Google says it does not use `llms.txt` and does not plan to; large log studies report the
major AI crawlers almost never request it; a few IDE agents and MCP tools do [S, secondary
sources]. GitHub Pages gives no access logs, so any fetch here is unmeasurable.

**Recommendation: keep `llms.txt`, generate it at build, spend no more effort on it.** It costs
close to nothing from an endpoint (`src/pages/llms.txt.ts`) reading the same data as the pages, and
it doubles as a compact fact sheet. Rules: 60 lines or fewer; no em dashes; never hand-edited; no
services or pricing block, no phone number, no email (link to `/contact/`); facts limited to §6.3.

```
# Mubashir Rehman

> Backend software engineer in Lahore, Pakistan (3+ years, full-time) who builds the systems behind
> messy, multi-system workflows and adds AI where it helps. Software engineer at TransData.
> Open to remote roles.

## Facts
- Location: Lahore, Pakistan. Remote-first. On-site in Lahore.
- Paper: third of seven authors, Circuits, Systems, and Signal Processing, Springer, 2025, DOI 10.1007/s00034-025-03048-2
- Open source: HireTrack, an offline-first job-application tracker and résumé tailor

## Case studies
- [{{title}}](https://mubashir-rehman.is-a.dev/projects/{{slug}}/): {{summary sentence}}
- {{one line per published case study, from the data layer}}

## Writing
- {{one line per indexable post, newest first}}

## Roles
- [Python backend engineer](https://mubashir-rehman.is-a.dev/for/backend/)
- [AI backend engineer](https://mubashir-rehman.is-a.dev/for/ai-backend/)
- [ERPNext developer](https://mubashir-rehman.is-a.dev/for/erp-hrms/)
- [Full-stack engineer, backend-leaning](https://mubashir-rehman.is-a.dev/for/full-stack/)

## Profiles
- [About](https://mubashir-rehman.is-a.dev/about/)
- [GitHub](https://github.com/mubashir-rehman)
- [LinkedIn](https://www.linkedin.com/in/mubashir-rehman/)
- [Google Scholar](https://scholar.google.com/citations?user=-N7lsKsAAAAJ)
```

**`llms-full.txt`: not worth it at launch.** No evidence anyone fetches it from a site this size,
the real content is a few thousand words already available as clean HTML, and it adds a second copy
of every claim to keep in sync. If wanted later, a build script that concatenates About, case
studies and posts as Markdown is about 30 lines.

### 6.6 AI crawlers in `robots.txt`: policy and trade-offs

Current agent families [S, secondary sources]: OpenAI `GPTBot` (training), `OAI-SearchBot` (search
index), `ChatGPT-User` (user-initiated fetch); Anthropic `ClaudeBot` (training), `Claude-SearchBot`,
`Claude-User`; Perplexity `PerplexityBot` and `Perplexity-User`; Google `Googlebot` and
`Google-Extended` (a control token for Gemini training and grounding; it does not affect Search
ranking or AI Overviews eligibility); Apple `Applebot-Extended`; Common Crawl `CCBot`. User-initiated
agents may not honour `robots.txt` at all.

| Policy | Gains | Costs | Fit |
|---|---|---|---|
| A. Allow everything (current) | Present in AI search and in future model training; models can "know" him without browsing, which matters when a recruiter asks a plain chatbot | Content is used for training without attribution | **Recommended.** Public professional material; nothing to monetise or protect; being known is the goal. |
| B. Allow search and user agents, block training-only (`GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`, `Applebot-Extended`) | Keeps citations in live answers; withholds training data | Weaker recall in models that do not browse; needs upkeep as agents change | Reasonable if the writing becomes long-form original work he wants out of training |
| C. Block AI agents | Maximum control | Disappears from AI answers; defeats the site's purpose | Not recommended |

Recommended file: one wildcard group, one grouped block for explicit AI agents (redundant with the
wildcard, kept as documentation and to survive a future wildcard change), the sitemap line. Drop
`Claude-Web` and `anthropic-ai`. Do not disallow `/_astro/` (crawlers need CSS and JS to render).

```
# Policy: search, answer and training crawlers are welcome. Revisit if the writing is monetised.
User-agent: *
Allow: /

User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: GPTBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: ClaudeBot
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
Allow: /

Sitemap: https://mubashir-rehman.is-a.dev/sitemap-index.xml
```

Re-check the agent list every quarter; names change.

### 6.7 Rendering and fetch rules

- Every fact is in server-rendered HTML text, never only behind a click, a tab that needs
  JavaScript, an image, the interactive diagram or the chatbot (UX §1.4 says the same).
- Interactive diagrams have a static, fully readable twin (UX §3.3 legend).
- Keep HTML small; the chatbot prompt must leave the markup (finding #9). Some AI fetchers
  truncate or time out on heavy pages [R].
- Visible author, visible dates, outbound links to primary sources (DOI, repo, vendor docs).
- Stable URLs, one canonical per page, no parameters.
- Never write hidden text or repeated bios for machines.
- If an assistant states something wrong about him, fix the source (site fact block, profile, or
  third-party page) and re-check next month (§9.3). There is no way to edit a model.

---

## 7. Content clusters and the post queue

### 7.1 Hub and spoke

Hubs are case studies; spokes are the editorial plan's stories (S-IDs); role pages sit on top and
link down. Series (the editorial plan's A, B, C) are a reading order and are orthogonal to clusters.

| Cluster | Hub | Spokes | Role pages that link in | Anchor vocabulary |
|---|---|---|---|---|
| Multi-tenant product in production | `clinic-front-desk`, `multi-tenant-saas-architecture` | S01, S04, S06, S07, S11, S12, S15, S17 | Backend, Full-stack | dead-letter queue, circuit breaker, row-level security, KMS keys, health check |
| Agents next to production | `ai-agent-harness`, `clinic-front-desk` | S02, S08, S11 | AI backend | coding agents, blast radius, isolated browser context |
| Seams: integrations and interfaces | `integration-console`, `hr-attendance`, `erp-agent-layer`, `publishing-platform`, `local-inference` | S03, S05, S13, S16, S18, S19 | Backend, ERP and AI, AI backend | concurrency limit, MCP server, ZKTeco, prompt versioning, vLLM |
| Ingest and alert | `alerting-backend` | S14 | Backend, AI backend | alert engine, ingestion |
| Deterministic AI apps | `hiretrack` | S20 | AI backend, Full-stack | LangGraph, deterministic-first |
| About and the rulebook | `/about/` | S09, S10 | none | numbered rules |

### 7.2 Post queue ranked by search value

Search value here is demand times winnability times specificity of the first-hand material, with
recruiter relevance as a tie-break. It is not the editorial rank (which weighs pull, proof, edge and
NDA safety), and it does not override the editorial gates (employer sign-off, interviews, the
cooling period). Demand and difficulty are [R]. "Primary query" is my recommendation for the
`primaryKeyword` field; where it differs from the editorial plan's, the note says why.

| # | Story | Primary query | Secondary (H2 candidates) | Demand | Difficulty | Editorial rank and gate | SEO note |
|---|---|---|---|---|---|---|---|
| 1 | S01 Dead-letter queue | dead letter queue keeps growing | retry guard; circuit breaker; scheduler requeues failed job | Medium to high | Moderate | 1, written | "Dead-letter queue" alone is a head term. Keep it in H1 and seoTitle; put "keeps growing" in the description and one H2. |
| 2 | S08 Parallel agents, one browser | playwright tabs share cookies same context | multiple agents isolated browser contexts | Medium to high | Easy to moderate | 8, ready, low risk | Publish earlier than its rank: ready, low NDA risk, a real symptom. |
| 3 | S06 Health check tore down the load balancer | ecs circuit breaker rollback health check | container health check command not found; cloudformation rollback deleted load balancer | Medium | Easy | 6, ready | Publish earlier than its rank: exact-symptom queries are the likeliest to be found and cited [R]. |
| 4 | S05 Eight hotfixes, one line | websocket messages arrive as strings json double encoded | hotfix reverted; double encoding | Medium | Easy | 5, needs interview | Keep in the first six slots. |
| 5 | S03 Search that trusted every channel | promise.all timeout many endpoints | search across many services one slow; concurrency limit | Medium | Easy to moderate | 3, ready | Editorial primary "concurrency limit" is too generic to win; use it as a secondary. |
| 6 | S04 Four keys, three days from deletion | kms key pending deletion cancel | alert on key deletion eventbridge; cloudtrail | Medium to high | Moderate (AWS docs dominate) | 4, gated on employer sign-off | Highest urgency-driven demand; do not rush the gate. |
| 7 | S02 Diagnosis is safe to parallelize | run multiple coding agents safely | read-only agent production database; blast radius | High | Hard as a head term, moderate for the long tail | 2, ready | Editorial primary "parallel coding agents" is a saturated head term; lead with the safety phrasing. |
| 8 | S16 Keep the company out of the MCP server | mcp server design multiple companies | where to put tenant context in mcp tools | Medium (MCP is timely, multi-tenant design write-ups are few) | Easy to moderate | 16, ready | Raise priority: it carries the thinnest role track (ERP and AI) and the topic is time-sensitive. Authorship wording per CS-05 accuracy note ("specified", not "built an MCP server"). |
| 9 | S13 Prompts are config | store llm prompts in a database with versions | prompt versioning django | Medium to high | Moderate (vendor SERP) | 13, ready | Use PS-05 wording only; do not name the automation tool. |
| 10 | S18 Syncing ZKTeco devices into Django | zkteco django integration | zkteco web api multiple devices | Low to medium | Easy | 18, needs interview | Raise priority: easiest query to rank for, and the best evidence for the ERP and AI track. Past tense; no headcount or payroll specifics. |
| 11 | S19 A 12 GB GPU, an 8B model, one endpoint | vllm litellm openai-compatible proxy self-hosted | qwen3-8b awq 12gb | Medium to high | Moderate | 19, interview plus fresh measurement | Raise priority if he can take a dated measurement this month; without one it is one more generic guide. |
| 12 | S20 HireTrack, deterministic first | langgraph deterministic pipeline before the llm | truth-only tailoring; bring-your-own-key | Low to medium | Moderate | 20, read the repo | Zero NDA risk and writable from public code at any time. Builds the brand entity early. |

Optional, not in the story bank: **"What the ECG vascular-age paper does and does not show"** for the
name plus paper query (row 19 in §2.2). Use PS-01 and PS-02 wording, show the whole result table
including the unsegmented result (CS-22 asks for the candid version), and clear the co-author
wording (G13) first.

Low search value, keep for method and trust: S07, S09, S10, S11, S12, S14, S15, S17. S10 (the
correction of a published headcount) has no query but is the strongest trust signal on the site;
publish it after the old claims are gone (editorial D5).

### 7.3 Link rules

- Post to hub case study and one sibling (series previous and next); at most one role page (UX §3.6).
- **Hub to its posts.** UX's case-study data allows one related post. A hub with eight spokes and one
  outbound link is a weak cluster. Ask UX for a plain "Writing about this build" list on each case
  study (three to ten links, no cards). This is the single change that makes the hub-and-spoke real.
- Role page to one or two posts from its cluster; About rules to their evidence.
- Anchor text: the claim or the symptom in words, never "read more" (UX §6.1).
- The engagement cap limits how fast a cluster fills, not how it links.

### 7.4 Content gaps

| Topic | Why it matters | Format | Priority | Effort |
|---|---|---|---|---|
| Case-study pages, four at launch (§3.4) | The biggest missing surface; nothing specific to rank or cite today | Case study | High | Substantial (multi-day each, plus NDA and employer review) |
| About: facts block, rulebook with anchors, paper block | Entity home; the most quotable page | Page | High | Moderate |
| Launch posts S01, S03 and the two rewritten posts | First problem-query surface; freshness | Posts | High | Substantial each |
| Ready, low-risk symptom posts: S06, S08, S12 | Easiest long tail; no interview needed | Lab notes | High | Moderate (half a day each) |
| Interview-gated posts: S05, S18, S19 | S18 is the best recruiter-relevant long tail | Build and incident | Medium | Substantial plus one 90-minute interview |
| A fresh dated measurement for `local-inference` | The one asset that must be created, not written up | Measurement | Medium | Moderate (half a day) |
| Role pages: page-specific answers, evidence order | Removes duplication; keeps four indexable pages distinct | Edit | Medium | Quick win |
| Funnel coverage | Today only decision-stage content exists (role pages, résumé, contact). Awareness needs posts; consideration needs case studies. | Posts, case studies | High | Ongoing |
| Missing content types | Reproduced-failure write-ups, decision tables, a benchmark, the rulebook | Various | Medium | Ongoing |
| Freshness | The newest post is from August 2026; no page is over 12 months old, but the cadence gap is the risk | Cadence | Medium | Ongoing (editorial: biweekly, floor of monthly) |

---

## 8. Off-site levers (Mubashir's, not the site's)

Answer engines lean on off-site profiles at least as much as on the site [R]. Do these in the first
two weeks, in this order. Use the strings in §6.2 and the fact sentences in §6.3 verbatim.

| # | Lever | Actions | Why | Effort |
|---|---|---|---|---|
| 1 | Search Console | Add a URL-prefix property `https://mubashir-rehman.is-a.dev/` (the HTML verification file is already published; keep it). Submit `sitemap-index.xml`. **Export the 16-month baseline now** (Performance by query and page, Page indexing, Links). A Domain property needs DNS control that a shared-registry subdomain may not give [R]. | Search Console keeps 16 months; the redesign should be judged against it. It also has a Generative AI report (impressions in AI Overviews and AI Mode, launched June 2026, no clicks or queries) [S]. | 1 h |
| 2 | Bing Webmaster Tools and IndexNow | Import from Search Console; submit the sitemap. Generate an IndexNow key, publish `public/{key}.txt`, and add a deploy step that posts changed URLs to `https://api.indexnow.org/indexnow`. Bing, Yandex, Naver and Seznam use it; Google does not [R]. ChatGPT search is widely reported to draw on Bing's index [R], so Bing matters. | Fast discovery of new posts; feeds AI answers | 2 h |
| 3 | LinkedIn | Headline and About from §6.2. Featured: the three best case studies, the paper, the role-appropriate résumé (canonical URLs with trailing slash). Website field: the site root. Publications: the paper with its DOI. Projects: HireTrack with its case-study URL. **Fix any wording that contradicts the record** (the content bank notes LinkedIn overstates the ECG module's authorship and prices it; it is a top source for any AI answer). Ask two people for recommendations that name a system. | Highest-authority page about him | 1 to 2 h |
| 4 | GitHub | Bio from §6.2; a profile README with the role line, HireTrack and two more pinned repos, links to the case studies. HireTrack: README H1 "HireTrack", first line per §6.1, link to its case study, no adoption claim and no implied test suite (PS-11). **Consider renaming the repo `job-application-tracker` to `hiretrack`** (GitHub redirects the old URL; update site data, PDFs, the Vercel alias): at least seven unrelated repos share the name, so an exact `github.com/mubashir-rehman/hiretrack` is a disambiguator. | READMEs and profiles are heavily used by assistants [R] | 1 to 2 h |
| 5 | Google Scholar | Public profile; homepage URL; affiliation line; the paper claimed; keywords. Scholar cannot verify a personal-domain email; do not chase that. | The strongest third-party identity anchor for the paper | 30 min |
| 6 | ORCID, Stack Overflow | Only if the accounts are his and wanted (content bank §1.2). ORCID: public works (the DOI), employment, education without dates, website and GitHub URLs. Stack Overflow: about-me link; answer only where genuinely useful. | Extra `sameAs` anchors | 30 min |
| 7 | Cross-posting with canonical | dev.to (`canonical_url` front matter), Hashnode (original article URL), Medium (Import story sets it). Publish on the site first, confirm indexing with URL Inspection, wait three to seven days, then cross-post the four to six best posts in full with "Originally published at" and a link to the case study. A canonical is a hint, not a directive. | Third-party pages are frequently cited by assistants [R] | 30 min per post |
| 8 | Communities | One submission per post where it genuinely helps: r/LocalLLaMA (S19), r/aws (S04, S06), r/django (S13, S18), Hacker News or Lobsters for the strongest incident. Disclose authorship; never ask for votes; nothing about live or open incidents (editorial cooling period). | Off-site mentions feed generative answers [R] | Per post |
| 9 | Co-author lab and ITU pages | Ask the paper's lab or ITU to link the paper's page and his site from a publication or alumni list. | A university link is a high-trust, low-effort backlink | 30 min |
| 10 | Directories | Worth it: the profiles above. Optional, recruiter-side: Wellfound or Peerlist, if he wants them, with the same role line. Not worth it: generic SEO directories, "top developers" lists, paid profile sites. | Link farms do not help and can hurt | none |

**Own domain (strategic, not now).** The site lives on a free subdomain of a shared registry
domain. That limits Search Console to a URL-prefix property, keeps him dependent on a third party's
policies, and means the canonical host can never send a server-side 301. Buying a personal domain and
moving the canonical host (Cloudflare Pages already builds this repo and supports `_redirects` and
headers) would fix all three. Do not do it during the redesign launch: a domain move is a second
migration. Revisit six months after launch, with the redirect map from §10 as the starting point.

---

## 9. Measurement

### 9.1 What to track

No numeric targets yet: there is no baseline and a new low-traffic site has none to extrapolate
from. Set targets after eight weeks of data. Log application dates and site changes together in a
private spreadsheet (plan §1) so cause and effect can be separated later; it does not belong in the repo.

| Metric | Source | Cadence | Reading rule |
|---|---|---|---|
| Résumé downloads per role | Analytics events (`resume-backend`, `resume-ai-backend`, …) | Weekly | Trend, and split by referrer |
| Email, LinkedIn, GitHub clicks | Analytics events | Weekly | Trend |
| Case-study depth (reached "What broke") and post depth (75 percent scroll) | Analytics events (editorial §1.9, UX Q10) | Monthly | Which pages hold attention |
| Referrers by source, with a `?ref=` on off-site links where the referrer is stripped | Analytics | Weekly | Does LinkedIn or search bring the recruiters |
| Impressions and clicks, brand queries (any query containing "mubashir" or "rehman") | Search Console | Monthly | Should never fall after launch (§10.3) |
| Non-brand queries with at least one impression (breadth) | Search Console | Monthly | The growth signal for §2.2 rows 5 to 17 |
| Average position of the four name-plus-qualifier queries | Search Console | Monthly | Trend |
| Indexed pages against the sitemap | Search Console Page indexing | Weekly for a month, then monthly | Every sitemap URL indexed; redirects shown as expected |
| Generative AI report impressions | Search Console | Monthly | Directional only (impressions only) [S] |
| Bing clicks and impressions, IndexNow submissions | Bing Webmaster Tools | Monthly | Directional |
| Referring domains | Search Console Links | Monthly | Trend, not a target |
| Lab Core Web Vitals and budgets | Lighthouse CI on each PR | Per PR | Performance 95 or more, SEO 100, accessibility 100, LCP 1.5 s or less, CLS 0, JS 50 KB or less |
| AI-answer spot check | §9.3 | Monthly | Mention rate, citation rate, error count |
| Inbound messages and interview calls | Private log | As they occur | Read against the change log, not against traffic |

Field Core Web Vitals will read "insufficient data" until the site has enough traffic; rely on lab
numbers until then.

### 9.2 Analytics: options and recommendation

| Option | Cost and hosting | Cookies and consent | Custom events (needed for résumé and email clicks) | Notes |
|---|---|---|---|---|
| None (Search Console only) | Free | None | No | Cannot measure the leading indicators in the plan |
| **GoatCounter** | Free for personal use, hosted or self-hosted, open source | No cookies; typically no banner needed (not legal advice) | **Yes** (`data-goatcounter-click`, `goatcounter.count()`) | About 3.5 KB script [R]. Recommended. |
| Cloudflare Web Analytics | Free | No cookies | **No custom events** [R]: a PDF download or a `mailto:` click is invisible | Fine for pageviews and vitals only |
| Plausible or Umami | Paid, or self-hosted | No cookies | Yes | More to run; same result as GoatCounter here |

Recommendation: **GoatCounter** (plan §12.1). Load it `async`, only on the canonical host (skip
localhost and `pages.dev`). None of these see crawler traffic, so AI-crawler activity stays
unmeasurable on GitHub Pages. Event names: `resume-{role}`, `email`, `linkedin`, `github`,
`read-end`, `what-broke`.

### 9.3 Monthly AI-answer spot check

Protocol, first Monday of each month:

1. Fresh logged-out session (or private window) per engine; same wording every month.
2. Engines: ChatGPT with search on, Perplexity, Google AI Mode, Google classic plus AI Overview
   where shown, Bing Copilot, Claude with web search, Gemini.
3. Sixteen queries (below): name (5), role (3), symptom (8). Extend the symptom list as posts publish.
4. Record per query and engine: mentioned (0 absent, 1 named without a link, 2 our URL cited, 3 our
   URL cited first), whether facts are correct (correct, partly, wrong, fabricated), and any
   same-name confusion. Screenshot anything wrong.
5. Any "wrong" or "fabricated" answer: fix the source (site fact block, a profile, a third-party
   page) within the month, then re-check.
6. Keep the CSV private. Month 0 is the last week before launch.

Queries:

- Name: "Who is Mubashir Rehman, a backend engineer in Lahore?"; "Tell me about Mubashir Rehman,
  backend software engineer at TransData"; "Mubashir Rehman ECG vascular age paper co-author"; "Is
  Mubashir Rehman open to remote backend roles?"; "Mubashir Rehman HireTrack".
- Role: "Python backend engineers in Pakistan with LLM agent experience"; "ERPNext developers in
  Pakistan who have built AI agents on an ERP"; "Who built HireTrack, the open-source job
  application tracker?"
- Symptom: the eight primary queries in §7.2 that have a published post, phrased as a question.

Script (optional, tested; prints the checklist and writes a blank CSV):

```js
// scripts/ai-spotcheck.mjs (optional, private). Prints the month's checklist and writes a blank log.
//   node scripts/ai-spotcheck.mjs 2026-11
// Fill the CSV by hand from each engine's answer. Keep the CSV out of the repo (it is private).
import fs from "node:fs";

const month = process.argv[2] ?? new Date().toISOString().slice(0, 7);
const engines = ["ChatGPT (search on)", "Perplexity", "Google AI Mode", "Google AI Overview / classic", "Bing Copilot", "Claude (web search)", "Gemini"];
const queries = {
  name: [
    "Who is Mubashir Rehman, a backend engineer in Lahore?",
    "Tell me about Mubashir Rehman, backend software engineer at TransData",
    "Mubashir Rehman ECG vascular age paper co-author",
    "Is Mubashir Rehman open to remote backend roles?",
    "Mubashir Rehman HireTrack",
  ],
  role: [
    "Python backend engineers in Pakistan with LLM agent experience",
    "ERPNext developers in Pakistan who have built AI agents on an ERP",
    "Who built HireTrack, the open-source job application tracker?",
  ],
  symptom: [
    "Why does a dead-letter queue keep growing after a connector goes down?",
    "How do I run several coding agents safely against a production system?",
    "How do I put a concurrency limit and timeout on a search that fans out to many services?",
    "AWS KMS keys showing pending deletion: how do I cancel and alert?",
    "Websocket messages arrive as strings after a hotfix: what is wrong?",
    "ECS health check failed and CloudFormation rolled back and deleted the load balancer",
    "How do I store LLM prompts in a database with versions?",
    "How do I sync ZKTeco devices into a Django HRMS?",
  ],
};
const cols = ["month", "engine", "group", "query", "mentioned(0-3)", "our_url_cited", "facts_correct(correct|partly|wrong|fabricated)", "name_collision", "notes"];
const rows = [cols.join(",")];
for (const engine of engines)
  for (const [group, qs] of Object.entries(queries))
    for (const q of qs) rows.push([month, engine, group, `"${q.replace(/"/g, '""')}"`, "", "", "", "", ""].join(","));
const out = `spotcheck-${month}.csv`;
fs.writeFileSync(out, rows.join("\n") + "\n");
console.log(`${queries.name.length + queries.role.length + queries.symptom.length} queries x ${engines.length} engines = ${rows.length - 1} rows -> ${out}`);
console.log("Score 'mentioned': 0 absent, 1 named without a link, 2 our URL cited, 3 our URL is the first citation.");
console.log("Any 'wrong' or 'fabricated' row: fix the source (site fact block, profile, third-party page) this month.");
```

---

## 10. Migration safety

### 10.1 URL inventory

Rule (brief): no existing URL disappears without a redirect. Statuses include what other roles have
already committed.

| URL | Decision | Note |
|---|---|---|
| `/`, `/about/`, `/projects/`, `/journal/`, `/contact/`, `/services/` | Keep, rebuild | `/services/` leaves the nav (UX) but stays live and in the sitemap |
| `/for/ai-backend/`, `/for/backend/`, `/for/erp-hrms/`, `/for/full-stack/` | Keep, rebuild | Slugs unchanged even if the labels change |
| `/journal/replacing-scraping-with-tavily/`, `/journal/rebuilding-for-mobile/` | Keep at the same URL | Migrated to Markdown and brought within the claims rules (commits `416d0b7`, `7085d62`) |
| `/journal/welcome/` | Redirect to `/about/` | Committed as archived with a redirect (`5e3e67b`). Editorial §1.7 had planned an in-place rewrite; either is SEO-safe. A redirect to the page that absorbed the content is the cleaner result. |
| `/journal/flowers-of-multan/` | Redirect to `/journal/` | Committed (`3ebb8b0`). A redirect to a generic index rather than a related page may be treated as a soft 404 for that URL [R]; acceptable for a low-value URL. Alternative: keep it live, unlisted, `noindex`, out of the sitemap and feed. |
| `/for/` | Soft redirect to `/` (UX §2.3) | Never existed; harmless; never in the sitemap |
| `/projects/[slug]/` | New | Slugs permanent from the day they are indexed (§3.4) |
| `/rss.xml`, `/sitemap-index.xml`, `/sitemap-0.xml`, `/robots.txt`, `/llms.txt` | Keep paths | Contents change |
| `/resume/Mubashir-Rehman-{AI-Backend,Backend,ERP-HRMS,Full-Stack}.pdf` | Keep filenames | Content regenerated in phase 5 |
| `/resume/Mubashir-Rehman-Full-Stack.md` | Remove | Never linked; a file URL cannot redirect on GitHub Pages; needs the CD's sign-off as an exception |
| `/google970de44929ca96e5.html` | **Keep** | Search Console ownership; losing it breaks verification |
| `/og-image.png`, `/mubashir-rehman.webp`, `/mubashir-rehman-176.webp`, `/favicon.svg` | Keep paths | Referenced by external caches and by `Person.image` |
| `/journal/tavily-web-search-api-certificate.webp` | Keep path or redirect the image reference | Content collection move already relocated the source file; the built path must not change silently |
| `/giscus-*.css`, `/placeholder.svg` | Remove | Dead; never linked |
| Old hash-route links (`/#/about`, `/#/journal/...`) from the Vite-era single-page app | Add a five-line script on `/` that rewrites `#/path` to `/path/` | Old résumé PDFs and posts may still carry them; the server cannot see fragments |

### 10.2 Redirect mechanics on GitHub Pages

Astro's `redirects` config emits a static stub page. The template (read from
`node_modules/astro/dist/core/routing/3xx.js`) contains `<meta http-equiv="refresh" content="0;url=…">`
for status 301, `content="2;url=…"` for 302, plus `<meta name="robots" content="noindex">` and
`<link rel="canonical">` pointing at the target [M]. Google treats an instant meta refresh as a
permanent redirect and a delayed one as temporary [S, Google Search Central via search]. Rules:

- Always status 301 (never 302: it adds a two-second delay and reads as temporary).
- Redirect sources are never in the sitemap or the feed; targets are. The extended gate (§11) checks it.
- No chains. Keep every redirect for at least a year [R].
- Server-side 301 is not available except for the trailing-slash case, so the equity transfer is
  weaker than a real 301. That is one more reason to keep every URL that is not clearly dead.

### 10.3 Launch and re-submission checklist

| When | Action |
|---|---|
| T minus 14 days | Export the Search Console baseline (§8 row 1). Run the month-0 AI spot check (§9.3). Save the baseline Lighthouse table (§1.5). Inventory current URLs (§10.1). |
| T minus 7 days | Build on a branch; run the full gate (§11). Run the Rich Results Test and the Schema Markup Validator on one page of each template. Confirm the `pages.dev` build is `noindex`. Confirm `google970de44929ca96e5.html` is in the build. Confirm no redirect source is in the sitemap. |
| T (merge to `main`) | Verify production: canonical, `robots.txt`, sitemap, real 404 status, HTTP to HTTPS, slash-less to slash 301, each redirect. Submit `sitemap-index.xml` in Search Console and Bing. URL Inspection "Request indexing" for home, About, the case studies, the Writing index (the daily quota is small). IndexNow all URLs. Update LinkedIn, GitHub, Scholar, ORCID links. |
| T plus 1 to 7 days | Search Console Page indexing: look for "Not found (404)", "Duplicate, Google chose different canonical", and expected "Page with redirect". Check Bing. |
| T plus 28 days | Compare brand-query clicks and impressions with the baseline. If brand clicks fall by more than a third for two consecutive weeks with no calendar explanation, check canonicals, redirects and `noindex` first. |

Rollback: tag the last good build; GitHub Pages can redeploy the previous commit. Do not combine
the launch with a domain change or any URL change not listed in §10.1.

---

## 11. CI checks

### 11.1 What `scripts/check-dist.mjs` already covers

One `<h1>`; canonical byte-identical to the URL and the sitemap `<loc>`; title at most 60 and
description at most 155; JSON-LD parses; `og:image` present and resolvable; internal links resolve
and keep trailing slashes; no em dash or banned phrase in visible copy; redirect stubs not in the
sitemap; optional private denylist over visible text and text files. Run on the baseline build it
reports 18 problems (an em dash in visible copy on 15 pages, three over-long titles), all real.

### 11.2 Gaps, and what the extended script adds

| Gap in `check-dist` | Why it matters here | Extended rule |
|---|---|---|
| Strips `<head>` before scanning | An em dash in `<title>`, or a blocked claim in a `<meta>` description, passes | Scan title and description; scan raw HTML for the private denylist |
| Ignores attributes | The chatbot prompt sits in a `props` attribute; `[object Object]` and an internal name were invisible to it | Fail on `[object Object]`; raw-HTML denylist |
| JSON-LD only parsed | Slash-less on-domain URLs (25 on the baseline) and dangling `@id`s pass | Enforce the URL rule; every `@id` reference defined on the same page |
| No `og:type` check | Posts were typed `website` (4 of 4) | Case studies and posts must be `article` |
| No duplicate check | Home and 404 shared a description | Unique titles and descriptions |
| No heading-chrome check | Footer `<h2>` on 15 pages | No `<h2>` in the footer |
| Sitemap only one way | A sitemap URL with no matching canonical, or a `noindex` page listed | Set equality between the sitemap and indexable canonicals |
| No text-output checks | `llms.txt` had an em dash; links inside it are unchecked | `llms.txt` and `robots.txt` rules |
| No image checks | Missing dimensions on one image | `alt` required, dimensions warned |
| No budget | About 100 KB of JS on every page | Static module graph, gzip size, warn over 50 KB (promote to fail after the rebuild) |
| No linking check | Posts had one inbound link | Warn below three contextual inbound links |

Run against the baseline build, the extended script reports 80 failures and 26 warnings: 25
slash-less JSON-LD URLs, 15 footer headings, 15 em dashes in visible text, title or description, 15
`[object Object]`, 4 posts typed `website`, 3 over-long titles, and one each of a duplicate
description, a canonical missing from the sitemap (the 404) and an em dash in `llms.txt`. That
overlap and delta is the case for merging these rules into `check-dist.mjs`, not keeping two gates.

Also worth adding, not in the script: a schema-required-fields check per type once `schema.ts`
exists; a monthly scheduled link-rot check on external links (for example `lychee`); Lighthouse CI
budgets (§9.1); and an accuracy step that compares every figure on the page with the content bank's
tier A list.

### 11.3 Reference script (tested against the baseline build)

Zero dependencies. Regex-based on Astro's predictable output; swap in an HTML parser if the
templates stop being machine-regular.

```js
// scripts/seo-check.mjs (reference implementation of the rules that scripts/check-dist.mjs lacks).
// Zero dependencies. Run after `astro build`:  node scripts/seo-check.mjs [dist/public]
// Exit code 1 on any FAIL. Merge the rules you want into check-dist.mjs rather than keep two gates.
// Private list: NDA_DENYLIST=/path/to/file (one term per line), same convention as check-dist.mjs.
// The list scans RAW files (head, attributes, JSON-LD, feeds), not just visible text.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = path.resolve(process.argv[2] ?? "dist/public");
const SITE = "https://mubashir-rehman.is-a.dev";
const MAX_TITLE = 60, MAX_DESC = 155, MIN_DESC = 70, JS_BUDGET_GZ = 50 * 1024;
const BANNED = /\b(passionate|innovative solutions|cutting-edge|digital transformation|revolutionizing|leveraging|spearheaded|AI enthusiast)\b/i;
const DENY = process.env.NDA_DENYLIST && fs.existsSync(process.env.NDA_DENYLIST)
  ? fs.readFileSync(process.env.NDA_DENYLIST, "utf8").split("\n").map((s) => s.trim().toLowerCase()).filter(Boolean)
  : [];

const out = { FAIL: [], WARN: [] };
const flag = (lvl, page, msg) => out[lvl].push(`${lvl.padEnd(4)} ${page.padEnd(44)} ${msg}`);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(ROOT);
const urlOf = (f) => "/" + path.relative(ROOT, f).replace(/index\.html$/, "");
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
const decode = (s = "") => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

// Sitemap
const sitemapLocs = new Set();
for (const f of files.filter((f) => /sitemap-\d+\.xml$/.test(f)))
  for (const m of fs.readFileSync(f, "utf8").matchAll(/<loc>(.*?)<\/loc>/g)) sitemapLocs.add(m[1]);

const pages = files.filter((f) => f.endsWith(".html") && !/google[0-9a-f]+\.html$/.test(f));
const known = new Set(pages.map(urlOf));
const canonicals = new Set(), titles = new Map(), descs = new Map(), inbound = new Map();

for (const f of pages) {
  const url = urlOf(f), html = fs.readFileSync(f, "utf8"), tag = (re) => html.match(re)?.[0] ?? "";
  if (/http-equiv="refresh"/.test(html)) { // Astro redirect stub
    const to = decode(attr(tag(/<link rel="canonical"[^>]*>/), "href"));
    if (sitemapLocs.has(SITE + url)) flag("FAIL", url, "redirect source is listed in the sitemap");
    if (!sitemapLocs.has(to) && to) flag("WARN", url, `redirect target not in sitemap: ${to}`);
    continue;
  }
  const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] ?? "");
  const desc = decode(attr(tag(/<meta name="description"[^>]*>/), "content") ?? "");
  const canon = decode(attr(tag(/<link rel="canonical"[^>]*>/), "href") ?? "");
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  const visible = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, " ").replace(/<[^>]+>/g, " ");

  if (title.length > MAX_TITLE) flag("FAIL", url, `title ${title.length} chars: ${title}`);
  if (desc.length > MAX_DESC) flag("FAIL", url, `description ${desc.length} chars`);
  if (desc.length < MIN_DESC && url !== "/404.html") flag("WARN", url, `description only ${desc.length} chars`);
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) flag("FAIL", url, `${h1s} <h1> elements`);
  if (/<footer[\s\S]*?<h2/.test(html)) flag("FAIL", url, "footer contains <h2> (chrome in heading outline)");
  let last = 0;
  for (const m of html.matchAll(/<h([1-6])[\s>]/g)) { if (+m[1] - last > 1 && last) { flag("WARN", url, `heading jump h${last} to h${m[1]}`); break; } last = +m[1]; }

  if (!noindex) {
    canonicals.add(canon);
    if (!canon.startsWith(SITE + "/") || !canon.endsWith("/")) flag("FAIL", url, `bad canonical: ${canon}`);
    if (!sitemapLocs.has(canon)) flag("FAIL", url, "canonical not in sitemap");
    if (titles.has(title)) flag("FAIL", url, `duplicate title with ${titles.get(title)}`); else titles.set(title, url);
    if (descs.has(desc)) flag("FAIL", url, `duplicate description with ${descs.get(desc)}`); else descs.set(desc, url);
    const ogType = attr(tag(/<meta property="og:type"[^>]*>/), "content");
    if (/^\/(journal|projects)\/[^/]+\/$/.test(url) && ogType !== "article") flag("FAIL", url, `og:type is ${ogType}, expected article`);
  } else if (sitemapLocs.has(canon)) flag("FAIL", url, "noindex page is listed in the sitemap");

  // JSON-LD
  const nodes = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const j = JSON.parse(m[1]); (Array.isArray(j) ? j : j["@graph"] ?? [j]).forEach((n) => nodes.push(n)); }
    catch (e) { flag("FAIL", url, `JSON-LD does not parse: ${e.message}`); }
  }
  const defined = new Set(), refs = new Set();
  (function scan(v, top) {
    if (Array.isArray(v)) return v.forEach((x) => scan(x));
    if (v && typeof v === "object") {
      if (v["@id"]) (Object.keys(v).length > 1 ? defined : refs).add(v["@id"]);
      Object.values(v).forEach((x) => scan(x));
    } else if (typeof v === "string" && v.startsWith(SITE)) {
      const rest = v.slice(SITE.length); // "" for the bare origin, which is also a violation
      if (rest === "" || (!rest.endsWith("/") && !/\.\w{2,5}$/.test(rest) && !/[#?]/.test(rest)))
        flag("FAIL", url, `JSON-LD URL without trailing slash: ${v}`);
    }
  })(nodes);
  for (const r of refs) if (!defined.has(r)) flag("FAIL", url, `JSON-LD @id reference not defined on this page: ${r}`);

  // Copy lint and leaks
  if (/\u2014/.test(visible + title + desc)) flag("FAIL", url, "em dash in visible text, title or description");
  if (BANNED.test(visible)) flag("FAIL", url, `banned word: ${visible.match(BANNED)[0]}`);
  if (html.includes("[object Object]")) flag("FAIL", url, "[object Object] in the HTML (usually a template interpolating an object)");
  if (/\bundefined\b|\bNaN\b|lorem ipsum/i.test(visible)) flag("FAIL", url, "placeholder text visible (undefined, NaN, lorem)");
  for (const d of DENY) if (html.toLowerCase().includes(d)) flag("FAIL", url, "private denylist term present in raw HTML");

  // Images
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (attr(m[0], "alt") === undefined) flag("FAIL", url, "img without alt");
    if (!attr(m[0], "width") || !attr(m[0], "height")) flag("WARN", url, "img without width/height");
  }

  // Links
  const body = html.replace(/<header[\s\S]*?<\/header>|<footer[\s\S]*?<\/footer>|<nav[\s\S]*?<\/nav>/g, "");
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const h = m[1]; if (h.startsWith("//")) continue;
    if (/\.\w{2,5}$/.test(h)) { if (!fs.existsSync(path.join(ROOT, h))) flag("FAIL", url, `broken file link ${h}`); continue; }
    if (!h.endsWith("/")) flag("FAIL", url, `internal link without trailing slash ${h}`);
    if (!known.has(h)) flag("FAIL", url, `broken internal link ${h}`);
  }
  for (const m of body.matchAll(/href="(\/[^"#?]*\/)"/g)) {
    if (!inbound.has(m[1])) inbound.set(m[1], new Set());
    inbound.get(m[1]).add(url);
  }

  // JS budget: static module graph referenced from the HTML, gzip size
  const seen = new Set();
  const add = (p) => {
    if (!p || seen.has(p) || !fs.existsSync(path.join(ROOT, p))) return; seen.add(p);
    const src = fs.readFileSync(path.join(ROOT, p), "utf8");
    for (const m of src.matchAll(/(?:from|import)\s*"\.\/([^"]+\.js)"/g)) add("/_astro/" + m[1]);
  };
  for (const m of html.matchAll(/(?:src|component-url|renderer-url)="(\/_astro\/[^"]+\.js)"/g)) add(m[1]);
  const gz = [...seen].reduce((n, p) => n + zlib.gzipSync(fs.readFileSync(path.join(ROOT, p))).length, 0);
  // WARN for now; promote to FAIL once the rebuild lands
  if (gz > JS_BUDGET_GZ) flag("WARN", url, `JS ${(gz / 1024).toFixed(1)} KB gzip (budget ${JS_BUDGET_GZ / 1024} KB)`);
}

// Sitemap must equal the set of indexable canonicals
for (const l of sitemapLocs) if (!canonicals.has(l)) flag("FAIL", "sitemap", `listed but no indexable page has this canonical: ${l}`);
const sitemapRaw = files.filter((f) => /sitemap-\d+\.xml$/.test(f)).map((f) => fs.readFileSync(f, "utf8")).join("");
if (!/<lastmod>/.test(sitemapRaw)) flag("WARN", "sitemap", "no <lastmod> on any URL");
// Contextual inbound links (nav and footer excluded)
for (const u of known) {
  if (u === "/" || u.endsWith(".html")) continue;
  const n = inbound.get(u)?.size ?? 0;
  if (n < 3) flag("WARN", u, `only ${n} contextual inbound link(s)`);
}
// Private denylist over non-HTML text output (feed, llms.txt, sitemaps)
for (const f of files.filter((f) => /\.(txt|xml|json)$/.test(f)))
  for (const d of DENY) if (fs.readFileSync(f, "utf8").toLowerCase().includes(d)) flag("FAIL", path.relative(ROOT, f), "private denylist term");
// robots.txt and llms.txt
const robots = fs.existsSync(path.join(ROOT, "robots.txt")) ? fs.readFileSync(path.join(ROOT, "robots.txt"), "utf8") : "";
if (!/^Sitemap:\s*https:\/\//im.test(robots)) flag("FAIL", "robots.txt", "no Sitemap line");
if (/^Disallow:\s*\/\s*$/im.test(robots)) flag("FAIL", "robots.txt", "disallows the whole site");
const llms = fs.existsSync(path.join(ROOT, "llms.txt")) ? fs.readFileSync(path.join(ROOT, "llms.txt"), "utf8") : "";
for (const m of llms.matchAll(/\]\((https:\/\/mubashir-rehman\.is-a\.dev[^)]*)\)/g)) {
  const p = m[1].replace(SITE, "");
  if (!known.has(p) && !fs.existsSync(path.join(ROOT, p))) flag("FAIL", "llms.txt", `dead link ${m[1]}`);
}
if (/\u2014/.test(llms)) flag("FAIL", "llms.txt", "em dash");

console.log([...out.FAIL, ...out.WARN].join("\n") || "seo-check: all clear");
console.log(`\nseo-check: ${pages.length} pages, ${out.FAIL.length} FAIL, ${out.WARN.length} WARN`);
process.exit(out.FAIL.length ? 1 : 0);
```

---

## 12. Prioritized action plan

### Quick wins (this week; under two hours each)

| What | Impact | Effort | Dependencies |
|---|---|---|---|
| Export the 16-month Search Console baseline; add Bing Webmaster (§8 rows 1, 2) | High | 1 h | none |
| Remove the §1.3 claims from `src/data/*.json`; fix the `[object Object]` interpolation | High | 2 h | Content lead's ruling |
| Add the private denylist and the extended checks to CI (§11) | High | 1 to 2 h | Engineering; the denylist as a secret or private file |
| LinkedIn headline, About, Featured, and the ECG wording fix (§8 row 3) | High | 1 to 2 h | Strings from §6.2 |
| GitHub bio, profile README, HireTrack README; decide the repo rename (§8 row 4) | Medium | 1 to 2 h | Mubashir |
| Scholar and ORCID: website, affiliation, DOI (§8 rows 5, 6) | Medium | 1 h | Confirm accounts |
| Replace `robots.txt` (§6.6); remove the services block from `llms.txt` | Low to medium | 30 min | none |
| Set Title and Author on the three LibreOffice PDFs (or wait for phase 5) | Medium | 30 min | Résumé regeneration plan |
| Remove `resume/*.md`, giscus CSS, `placeholder.svg` from `public/` | Low | 15 min | CD sign-off (§10.1) |
| Choose the analytics tool (GoatCounter) | Medium | 1 h | Mubashir (plan §12.1) |

### Strategic investments (this quarter)

| What | Impact | Effort | Dependencies |
|---|---|---|---|
| Schema helper, `@graph`, title logic, `articleMeta`, per-page OG images (§3.0, §4) | High | 1 to 2 days | Design approval; engineering plan §8 |
| Case-study template and the first four pages (§3.4) | High | Weeks | Content bank, NDA and employer reviews, slug ruling |
| Post queue: launch set, then biweekly, with the §7.2 primary queries | High | Ongoing | Interview (editorial §9), gates, employer sign-off |
| Merge the extended checks into `check-dist.mjs` (§11) | High | Half a day | Engineering |
| JS and render budget: vanilla theme toggle, lazy chat, prompt off the page, critical CSS, two fonts | Medium to high | 1 to 2 days | Design system |
| "Writing about this build" list on case studies (§7.3) | Medium | Half a day | UX approval |
| IndexNow step in the deploy workflow (§8 row 2) | Low to medium | 2 h | none |
| Lighthouse CI budgets (§9.1) | Medium | 2 h | none |
| Monthly AI spot check (§9.3) | Medium | 1 h a month | none |
| Cross-post program with canonical, four to six posts (§8 row 7) | Medium | 30 min per post | Posts indexed first |
| Own-domain decision (§8) | Low now, high later | Days | Six months after launch |

---

## 13. Decisions, answers to other roles, and limits

### 13.1 Decisions for the phase 2 synthesis

| # | Decision | Recommendation |
|---|---|---|
| 1 | Analytics | GoatCounter (§9.2) |
| 2 | Title suffix | The 18-character suffix (space, pipe, space, name) with the no-suffix-if-long rule (§3.0) |
| 3 | Case-study slugs | Editorial aliases (`clinic-front-desk`, `alerting-backend`) over UX's working slugs (§3.4) |
| 4 | Section label | Either "Writing" or "Field notes"; use it identically everywhere; keep "incident reports" and "lab notes" in the title |
| 5 | `flowers-of-multan` | The committed redirect is acceptable; unlisted plus `noindex` is marginally better for search (§10.1) |
| 6 | Role page indexing | Index all four; monitor and `noindex` any that Google folds (§3.3) |
| 7 | AI crawlers and `llms.txt` | Policy A, generated `llms.txt`, no `llms-full.txt` (§6.5, §6.6) |
| 8 | Photo | Yes, on About only (UX lean). `Person.image` already uses it; SEO effect is small and positive |
| 9 | Phone number on the site | No; keep it in the résumé PDF (UX Q5) |
| 10 | HireTrack repo name | Rename to `hiretrack` (§8 row 4) |
| 11 | ORCID and Stack Overflow accounts | Confirm they are his and wanted before they stay in `sameAs` |
| 12 | Own domain | Not now; revisit at six months (§8) |

### 13.2 Answers to questions addressed to the SEO lead

- **Hero H1 (UX Q3):** confirmed, with four conditions (§3.1).
- **Title suffix (UX Q4):** ` | Mubashir Rehman`, 18 characters, plus the auto-drop rule.
- **`Service` and `ProfessionalService` markup:** not to be used (§3.1, §4.1).
- **Role page indexing (UX §3.7):** index all four (§3.3).
- **FAQ markup value (UX §1.4, Appendix A):** Google reportedly retired the FAQ rich result on 7
  May 2026 [S]; keep FAQ for clarity, treat markup as optional and low priority (§5.4).
- **`/services/` URL (UX Q15) and `/for/erp-hrms/` slug (UX Q7):** keep both.
- **Series (editorial §4):** no series URL at launch. Group series posts on the Writing index with
  "Part n of m" and link previous and next inside posts. Revisit a hub page when a series has four or
  more live parts; a distinct series name can then rank for its own brand query.
- **`seoTitle` and `primaryKeyword` in the post schema (editorial §2.1):** adopted; §7.2 refines the
  primary queries.

### 13.3 Conflicts between other role documents that need a ruling

1. Case-study slugs: UX `dental-ai-front-desk` and `social-intelligence-backend` versus the
   editorial aliases (§3.4). Slugs are permanent once indexed.
2. Section label: UX "Writing" versus editorial "Field notes" (D7).
3. Post opening: UX's 40-word lede plus optional "In brief" versus editorial's 80 to 130 word intro
   plus a TL;DR. Both satisfy SEO. Suggested merge: the lede is the first paragraph, the rest of the
   intro follows, the TL;DR bullets close it.
4. "Any timezone": UX copy uses it; the content bank warns it can read as a work-authorisation
   claim (G18). SEO surfaces should say "Open to remote roles" until it is settled.
5. Bank bios (50 and 150 words) name the vertical the editorial plan wants aliased (D1) and state
   launch facts that are employer-sensitive (G2).
6. The content bank uses an internal project codename in four places (sections 2.4, 2.5, 4.5). The
   public-repo rule and the editorial plan's private-denylist approach say aliases only; replace it.
   Separately, `docs/journal-post-drafts.md` (superseded) and the `id` fields in
   `src/data/projects.json` and `roles.json` carry a project id that is an internal product name:
   delete or scrub the drafts, and rename ids before any slug or anchor derives from them.
7. UX's case-study data allows one related post per case study; a hub with many spokes needs a list
   (§7.3).

### 13.4 Limits of this document

- No keyword-tool data: every volume and difficulty rating is judgement. Re-rate §2.2 once Search
  Console has data or an SEO tool is connected.
- The production site was unreachable from the sandbox: HTTPS enforcement, redirects, headers, the
  real 404 status and Search Console state are unverified.
- Google's developer documentation and the Springer page could not be opened; Google-policy
  statements come from search summaries and are marked [S].
- Rich Results Test and Schema Markup Validator were not run.
- The master-resume record was not available to me; all facts come from the content bank and the
  site's data files, and every drafted string awaits the content lead's claims check.
- The repository was moving while this was written (journal content collections, data edits). The
  audit baseline is commit `10eb841`.
- Lighthouse numbers are local and simulated, useful as a baseline only.
