# Redesign plan

Role: senior portfolio designer / creative director. This file sets direction and scope with
breadth. The specialist roles go deep in their own documents (see §10). Read `00-brief.md` first.

---

## 1. Objective

Turn the site from "résumé as a website" into **proof of engineering ability**, so that:

| Audience | Should think, in this order |
|---|---|
| Recruiter | "Matches the role. Easy to shortlist. Résumé is one click away." |
| CTO / hiring manager | "This person builds things. Understands systems. Owns outcomes. I want to see how they built this." |
| Founder / client | "He could fix our messy workflow, and he'd explain it clearly." |
| Answer engines | "Mubashir Rehman: backend and AI automation engineer, Lahore. Here are his facts." |

### Success measures

Leading indicators (visible within days):
- Résumé PDF downloads, contact clicks (email, LinkedIn), case-study read depth.
- Lighthouse ≥ 95 on every template, mobile and desktop. CLS 0. Zero axe violations.
- Every page passes the SEO smoke test in `CLAUDE.md`.

Lagging indicators (weeks):
- Interview calls and inbound messages. **Caveat:** a few days is too short to judge the
  verified-only claims test, and calls depend on channel and market more than the site.
  Log application dates alongside site changes so cause and effect can be separated later.
- Search Console impressions and clicks for name, role and problem queries.
- Appearances of the site in AI answers for name and role queries (spot-checked monthly).

Needs a decision: a privacy-friendly analytics tool to measure the leading indicators
(see §12).

---

## 2. Positioning

**One line:** Backend engineer who turns messy, multi-system workflows into reliable software,
with AI and automation where they earn their place.

**Three pillars** (every page, project and post should reinforce at least one):

1. **Systems:** APIs, data, queues, integrations, infrastructure, and what happens when they fail.
2. **Applied AI:** agents, LLM integrations, self-hosted inference, AI layered onto existing
   systems of record.
3. **Ownership:** end-to-end delivery, architecture and specs, incidents, leading and mentoring.

**Role tracks** for recruiter landing pages: Backend, AI Backend, Full-stack (backend-heavy),
ERP + AI. (Existing `/for/[role]/` pages; the SEO lead validates naming against search demand.)

---

## 3. Audience journeys

| Audience | Arrives from | First 10 seconds | Next 2 minutes | Exit action |
|---|---|---|---|---|
| Recruiter | LinkedIn, résumé link, job portal | Name, role, years, location/remote, stack, availability | Role page matching the job title | Download résumé, email |
| CTO / EM | Résumé link, GitHub, a blog post | Hero line + three flagship builds | One case study end to end, one post | Email, LinkedIn, GitHub |
| Founder / client | Search, a post, word of mouth | "Problems I solve" in plain language | One relevant case study | Short contact form or email |
| Answer engine | Crawl | Structured facts, FAQ, `llms.txt` | Case studies, posts | Citation |

Design implication: the home page routes each audience within one screen, without making
anyone read content meant for someone else.

---

## 4. Information architecture (hypothesis; the UX lead validates or replaces it)

| Route | Purpose | Status |
|---|---|---|
| `/` | Workbench: statement, proof, three flagship builds, audience routing | Rebuild |
| `/projects/` | Work index, filterable by pillar/track | Rebuild |
| `/projects/[slug]/` | **New.** One page per flagship case study | New: biggest depth, SEO and GEO gain |
| `/about/` | Story, timeline, how I work | Rebuild |
| `/how-i-work/` | **Candidate.** Numbered principles. May fold into `/about/` | UX lead decides |
| `/journal/`, `/journal/[slug]/` | Writing: incident reports, lab notes | Rebuild design, keep URLs |
| `/for/[role]/` | Recruiter landing per role track | Keep URLs, rebuild |
| `/services/` | Low-profile client path ("problems I solve") | Keep URL, reframe |
| `/contact/` | Contact | Rebuild |
| `/404` | Not found | Restyle |
| `/resume/*.pdf` | Résumés | **Regenerate from master-resume; current PDFs may carry retired claims** |

URL rule: no existing URL disappears without a redirect (Astro `redirects` emits meta-refresh
pages on static hosts).

---

## 5. Design direction (hypothesis; the UI lead owns the final system)

- **Dark-first.** Black ~70% of the surface, purple ~20% (identity, primary action), blue ~10%
  (live/interactive/system signals: links in diagrams, focus, status, data flow). A light theme
  is still required (recruiters in bright offices, printing) and must feel like the same brand.
- **Workshop / lab notebook** as a mood, expressed mainly through typography and diagrams.
  Avoid the generated-design defaults listed in the `frontend-design` skill (monospace data
  labels, 01/02/03 markers on non-sequences, ALL-CAPS eyebrows, tinted near-black standing in
  for black, identical rounded cards). Numbering only where content really is a sequence.
- **Interaction budget:** at most one "signature" interactive element per page (e.g. an
  explorable architecture diagram on a case study) and light micro-interactions elsewhere
  (hover, focus, reveal). Nothing auto-plays, nothing blocks reading, everything respects
  `prefers-reduced-motion`, everything works without JavaScript.
- **Flavour:** implicit only (see brief). At most two devices.
- **One system for everything:** pages, diagrams, social cards, résumé PDF styling, favicon.

---

## 6. Content system

- **Case-study template** (fixed order, strict budgets): one-line summary (≤ 20 words, for
  recruiters) → Problem → System (diagram) → Key decisions and trade-offs → What broke / what I
  got wrong → Outcome (verified facts only) → Stack (as tags, at the end, not the start).
- **Word budgets** per section, set by the UX lead, enforced by the content lead.
- **Voice rules:** the brief's. No em dashes. Banned-word list checked in CI.
- **Sources of truth:** `src/data/*` (or content collections) for the site; the master-resume
  record for facts. No positioning copy hand-duplicated across files.
- **Chatbot (AskMe):** keep as an interactive "ask about my work" element, but its facts come
  only from the new verified data. Separately, move the Groq key behind a proxy (security).

---

## 7. Search strategy overview (the marketing lead goes deep)

- **SEO:** intent map (name, role + location, role + stack, problem queries), per-page
  title/description, internal linking between case studies, posts and role pages, Core Web
  Vitals, sitemap, Search Console and Bing Webmaster setup.
- **AEO:** question-shaped headings, concise answer-first paragraphs, FAQ blocks with
  `FAQPage` schema where honest, `HowTo`/`Article` where they fit.
- **GEO:** one consistent entity (same name, role line and links everywhere: site, LinkedIn,
  GitHub, Scholar), `Person` + `sameAs`, quotable factual sentences, `llms.txt`,
  original material others cite (incident write-ups, diagrams).
- **Off-site levers** (Mubashir's, not the site's): LinkedIn headline and featured links,
  GitHub profile README, cross-posting with canonical links, the Springer paper's author page.

---

## 8. Engineering plan (after design approval)

1. Content collections with Zod schemas (journal as Markdown files; profile, projects, roles as
   data collections). Schema limits enforce the SEO rules at build time.
2. Fresh design tokens and a small component set built from the UI spec. Old tokens removed.
3. Rebuild templates: home, work index, case study, about, journal index and post, role page,
   services, contact, 404.
4. Build-time OG image per page and post, in the design language.
5. Post-build CI gate: one `<h1>`, canonical equals sitemap `<loc>`, title/description length,
   banned words and em dashes in copy, broken internal links.
6. Remove unused dependencies (Radix, react-router, helmet, giscus, react-query, etc.).
7. Performance budget: ≤ 50 KB JS on content pages (chatbot loads on interaction), LCP ≤ 1.5 s.
8. Fix the test and lint setup so the gate means something.

---

## 9. Phases and gates

| Phase | Output | Gate (who approves) |
|---|---|---|
| 0. Brief + plan | `00-brief.md`, this file | Mubashir |
| 1. Discovery (parallel, §10) | Content bank, IA + blueprints, design system + specimen, search strategy, editorial plan | Creative director synthesis |
| 2. Synthesis | `02-decisions.md`: resolved conflicts, the chosen direction, open questions | **Mubashir: palette, hero, IA** |
| 3. Build | Tokens, components, templates, content, OG images, CI gate | Visual QA + SEO smoke test |
| 4. QA | Screenshots (3 widths × 2 themes), axe, Lighthouse, keyboard pass, copy audit | Creative director |
| 5. Launch | Merge to `main`, Search Console resubmission, résumé PDFs updated | Mubashir |
| 6. Content cadence | First 3 to 5 posts, then a steady rhythm | Ongoing |

Nothing ships to `main` without Mubashir's approval.

---

## 10. The agency: roles, inputs, outputs

| Role | Owns | Reads | Writes | Must not |
|---|---|---|---|---|
| **Creative director / senior portfolio designer** (lead session) | Brief, plan, synthesis, final calls, integration | Everything | `00`, `01`, `02` docs | Build before the gate |
| **Content strategist** | Verified content bank, case-study raw material, copy rules | master-resume record | `docs/redesign/10-content-bank.md` (NDA-safe) | Put internal names in the repo |
| **UX strategist / information architect** | Journeys, IA, page blueprints, word and interaction budgets | Brief, plan, content inventory | `20-ux-blueprints.md` | Look at current site styling |
| **Senior UI designer** | Design language: palette, type, grid, components, motion, diagrams, social cards | Brief, plan | `30-design-system.md` + rendered specimen | Look at current site styling or tokens |
| **SEO / AEO / GEO lead** | Technical audit, intent map, schema plan, entity plan, off-site levers | Repo, built output, web | `40-search-strategy.md` | Change code yet |
| **Editorial lead** | Blog strategy, story selection, titles, outlines, one sample post | master-resume evidence, brief | `50-editorial-plan.md` | Name NDA products; include colleagues' names |
| **QA lead** (phase 4) | Visual, accessibility, performance, copy audit | Built site | `60-qa-report.md` | Fix without reporting |

**Skills each role uses** (Anthropic's official plugins; in cloud sessions, cloned from
`anthropics/claude-plugins-official` and `anthropics/knowledge-work-plugins`):

| Role | Skills |
|---|---|
| UI designer | `frontend-design`, `design:design-system`, `design:design-critique` |
| UX strategist | `design:accessibility-review`, `design:ux-copy`, `frontend-design` (principles) |
| Content strategist | `design:ux-copy`, `frontend-design` (writing) |
| SEO / AEO / GEO lead | `marketing:seo-audit` |
| Editorial lead | `marketing:content-creation`, `marketing:brand-review` |
| QA lead | `design:accessibility-review`, `design:design-critique`, `marketing:seo-audit` |
| Build | `frontend-design`, `design:design-handoff` |

**Anti-anchoring rule:** the UX and UI roles work from the brief, not from the current design.
They do not open `src/index.css`, `tailwind.config.ts`, `design-system/`, component or layout
styling, and do not screenshot the current site. The current site is only an inventory of
routes and content.

**Confidentiality rule:** anything written into this repo is public. Internal product names,
client names, colleagues' names, compensation and credentials stay
out. Raw working notes that need them go to the session scratchpad, not the repo.

---

## 11. Risks

| Risk | Mitigation |
|---|---|
| Design anchored on the old site | Anti-anchoring rule above |
| Dark-first reads as "gamer" or hurts recruiter legibility | Light theme of equal quality, AA contrast in both, recruiter test on a phone |
| Interactivity overwhelms or slows | One signature element per page, no-JS fallback, JS budget |
| NDA leak through detail (client identifiable from specifics) | Function-only descriptions; content lead reviews for identifying detail, not just names |
| Search equity lost in the rebuild | Keep URLs, redirects for any change, re-submit sitemap |
| Verified-only content feels thin | Lead with scope, ownership, decisions and incidents; use every verified number that exists |
| Old résumé PDFs contradict the new site | Regenerate from master-resume in phase 5 |
| Chatbot says something the site no longer claims | Prompt generated from the new data only |
| Scope creep | Phases and gates; blog cadence starts after launch |

---

## 12. Decisions needed from Mubashir (by the phase 2 gate)

1. Analytics: none, or a privacy-friendly one (GoatCounter or Cloudflare Web Analytics).
2. Which three builds are the flagships on the home page (the content lead will recommend).
3. Keep the chatbot? (Recommended: yes, rebuilt on verified data.)
4. Photo of himself on the site: yes or no. (Helps recruiters and trust; optional.)
5. Approve palette, hero line and IA from the phase 2 synthesis.
