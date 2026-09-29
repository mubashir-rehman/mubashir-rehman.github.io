# 20 UX blueprints: journeys, IA and page specs

Role: UX strategist / information architect. Reads: `00-brief.md`, `01-plan.md`, the route list, the
shape of `src/data/*.json`, and the master-resume triage tables (as a content inventory only).
Not consulted, by rule: current styling, tokens, components, layouts, the live site.

Nothing here is code. Everything here is public: no client or internal product names (only
The Quetta Tea 2.0 and HireTrack may be named), no colleague names, nothing about side work.

Tags used throughout: **[E]** backed by external evidence (Appendix A), **[J]** my judgement,
**[T]** an assumption to test after the build.

---

## Decisions at a glance

1. **IA is four links and one action.** Nav: Work, Writing, About, Contact, plus a Résumé
   button. Existing URLs are unchanged. New: `/projects/[slug]/`. Three small redirects (§2.3).
2. **Plan §4 is validated with four changes:** (a) no `/how-i-work/` page, the rules live in
   About; (b) no filters on the work index at launch; (c) `/services/` stays but leaves the nav
   and becomes "Problems I solve"; (d) the role-track router lives in the home hero, and there is
   no `/for/` index page.
3. **Home order:** Hero (with track router) → Selected work (3) → Latest writing (2) → Ask →
   Close. About 295 words in `main`.
4. **Signature interaction: one explorable system diagram, on case studies only.** Phase 2 adds
   a "break it" failure toggle to it. Every other page has none. Ranking in §5.3.
5. **Case studies are capped at 850 words** and have a fixed order that puts "What broke" before
   "Outcome". A build with no honest failure and no rejected alternative does not get a page.
6. **The client path is never in the nav, the home hero, or the role pages.** It is reached
   from problem-shaped search results, a one-line note at the end of case studies and posts, the
   footer link "Problems I solve", and the Contact page (§2.5).
7. **Mobile nav is visible, not a hamburger** [E]. A two-row, non-sticky header. No fixed bars.
8. **Two things I need changed outside my remit:** the title suffix (it contains an em dash and
   eats 36 of the 60 title characters), and the JS-router view transitions (§5.4, §8).

---

## 1. Audience models

### 1.1 Recruiter / HR

| | |
|---|---|
| **Context** | Screening many candidates against one requisition. Arrives from a LinkedIn profile link, a link inside the résumé PDF, a job-portal field, or an email signature. Often forwards the link to a hiring manager, so the page must make sense to a second person cold. |
| **Device** | Phone first (LinkedIn's in-app browser), desktop second for ATS review. Mobile is the majority of LinkedIn traffic, 57 to 70% by one vendor blog, so directional only **[T]** |
| **Time budget** | First pass is roughly 6 to 7.4 seconds. That figure is from résumé eye-tracking (30 recruiters, 2018) [E], not from portfolio sites. Treat it as a design ceiling for the hero, not a measured site statistic. |
| **Questions, in order** | 1. What is this person (title, does it match my req)? 2. How many years, and at what level? 3. Where, and can they work remote or in my timezone? 4. Core stack (keywords from the req)? 5. Current and previous employer, dates, progression? 6. Available? 7. Where is the résumé? |
| **Deal-breakers** | Role unclear after 6 seconds. No résumé within one click. Location or remote status ambiguous. A poetic hero with no plain identity line. Slow load in an in-app browser. Walls of text. Overlays, chat bubbles, cookie banners. Claims that contradict the PDF. |
| **Exit action** | Download the résumé PDF (primary). Email. Forward the role page URL to the hiring manager. |

Eye-tracking detail that shapes the hero: recruiters read current title and company first, then
the previous one, then dates, and they penalise cluttered, multi-column, long-sentence layouts [E].

### 1.2 CTO / hiring manager / tech lead

| | |
|---|---|
| **Context** | Deciding whether to interview and what to probe. Arrives via the résumé link, GitHub, a recruiter's forward, or a post found through search. Will cross-check facts against the résumé and LinkedIn. |
| **Device** | Laptop or desktop **[T]**. Phone when the link arrives in chat. |
| **Time budget** | 2 to 10 minutes. Realistic shape: a 30-second skim of home, about 2 minutes in one case study, then a repo or one post. |
| **Questions, in order** | 1. Is any of it real production work, not tutorials? 2. What exactly was *his* part (solo, top contributor, lead)? 3. Depth: architecture, trade-offs, alternatives rejected. 4. How did it fail, and what did he do? 5. Judgement and honesty: are numbers sourced, is anything overclaimed? 6. Can he write and explain? 7. Is there public code? 8. What would I ask in the interview? |
| **Deal-breakers** | Vague claims ("scalable", "robust"). Numbers with no source. All "we", no "I decided". No failure story. A diagram that is only logos. Flashy interaction that hides content. Facts that differ between site, résumé and LinkedIn. A janky or slow page. |
| **Exit action** | Email or LinkedIn message. Open GitHub. Forward the case study to the interview panel. |

Hiring-manager guidance converges (qualitatively) on case studies over project lists, mastery
over breadth, and candidates who write honestly about what went wrong standing out [E, weak
sources, see Appendix A]. I use that as support for the template, not as a statistic.

### 1.3 Founder / client (low-profile path)

| | |
|---|---|
| **Context** | Has a messy workflow, not a job opening. Arrives by searching a problem in plain words, from a post, or by referral. May be non-technical. |
| **Device** | Mixed. A referral link often lands on a phone. |
| **Time budget** | 1 to 3 minutes. |
| **Questions, in order** | 1. Does he understand a problem like mine? 2. Has he done something like it, in words I can follow? 3. Can he explain clearly (a writing sample)? 4. Is he real and reliable? 5. How do we start? |
| **Deal-breakers** | Jargon with no plain-language gloss. Sales-funnel feel: pricing tables, packages, testimonials, logo walls, booking widgets, stock imagery. No evidence. A CV-shaped site with nothing addressed to a problem. |
| **Exit action** | One short email describing the problem. |

Constraint from the brief: this path stays quiet. Wherever it appears, the language must also be
harmless to a recruiter who reads it.

### 1.4 Search and answer engines

| | |
|---|---|
| **Context** | Crawlers (Google, Bing, and AI crawlers) and live fetches by assistants answering "who is Mubashir Rehman", "backend engineer in Lahore", or problem queries. |
| **Device** | None. Most parse server-rendered HTML with little or no JavaScript **[T]**. |
| **Time budget** | Token-limited. The first screen of text and the structured data carry the weight. |
| **Questions, in order** | 1. Which entity is this (the name is common, so role, city and handles must disambiguate)? 2. Canonical facts: role, employer, place, years, links. 3. What is he an authority on? 4. Is there a quotable answer to this query? 5. Is it dated and fresh? 6. Do other sources agree? |
| **Deal-breakers** | Facts that exist only behind JavaScript (for example, only in the chatbot). Inconsistent facts across pages. Undated posts. Blocked crawlers. PDF-only content. Keyword-stuffed or duplicated positioning copy. |
| **Exit action** | Cite or quote, with a link. |

Structural consequences, all inside my remit: one visible **Facts block** (a definition list)
on Home and About, fed from one data source; an **answer-first first paragraph** on every post
and case study; **question-shaped or problem-shaped H2s** where honest; visible dates and
"updated" dates. Schema, `sameAs` and `llms.txt` belong to the SEO lead. Vendor claims that FAQ
markup multiplies AI citations come from marketing blogs and I do not rely on them [E, weak]. As
I recall, Google narrowed FAQ rich results to a few authority sectors in 2023, so the value of
FAQ *content* is clarity for humans, not a rich result. The SEO lead should verify **[T]**.

### 1.5 What the four models jointly demand

- One screen must let a recruiter identify him and let a CTO see the work. The desktop home
  does both above the fold (§3.1).
- The same facts appear identically everywhere, from one source (`profile` data).
- Each audience's *exit action* is a plain link, present without JavaScript.
- No audience has to read copy addressed to another. Recruiters get the track router, CTOs get
  case studies, founders get problem-shaped headings deeper in.

---

## 2. Final IA and navigation

### 2.1 Verdict on the plan's §4 hypothesis

Validated: `/projects/[slug]/` as the biggest new asset, keeping `/journal/`, `/for/[role]/`,
`/services/`, `/contact/`, and never losing a URL without a redirect.

Changed:

| Plan said | I recommend | Why |
|---|---|---|
| `/how-i-work/` candidate | **Fold into `/about/`** as numbered working rules | Nav stays at 4 links. A rules page without evidence reads as platitudes; in About each rule links to the case study or post that earned it. A standalone page is a thin page until several posts carry a "rule I took from this". Promotion trigger: 5 or more posts with a rule. |
| Work index filterable by pillar/track | **No filter at launch** | 5 case studies plus at most 8 smaller builds. A filter is interaction cost for no gain. Pillar tags on each row do the job. Revisit at 10 or more case studies. |
| `/services/` "keep, reframe" | Keep the URL, **remove from nav**, title "Problems I solve" | HR should not meet it by scanning. Founders arrive from search or a post, not from a nav (§2.5). |
| Role pages, no index | Router in the hero, footer links, no `/for/` page | Avoids a near-empty index page. A soft redirect covers trimmed URLs (§2.3). |
| `/projects/` as the URL | Keep `/projects/`, label it **Work** in the UI | Search equity and inbound links beat label-URL parity. The cost is a small mismatch, acceptable. |

### 2.2 Sitemap

```
/                              Home
|-- /projects/                 Work (index)
|   `-- /projects/{slug}/      Case study   (5 at launch, 3 queued)
|-- /about/                    About (bio, working rules, timeline, teaching)
|-- /journal/                  Writing (index)
|   `-- /journal/{slug}/       Post
|-- /contact/                  Contact
|-- /for/backend/              Role page   (not in nav)
|-- /for/ai-backend/           Role page   (not in nav)
|-- /for/full-stack/           Role page   (not in nav)
|-- /for/erp-hrms/             Role page   (not in nav; label "ERP + AI", see §8 Q7)
|-- /services/                 Problems I solve   (not in nav)
`-- /404                       Not found

Files: /resume/{track}.pdf (4, names unchanged), /rss.xml, /sitemap-index.xml,
       /sitemap-0.xml, /robots.txt, /llms.txt
```

Launch case-study slugs are working titles for the content lead. Rule: names the *function*,
never a product or client, lower-case, hyphenated, at most four words.

| Working slug | Function it describes | Pillar |
|---|---|---|
| `/projects/dental-ai-front-desk/` | AI front desk for dental clinics, production hardening, cloud deployment, incidents | Ownership, Applied AI |
| `/projects/erp-agent-layer/` | LLM agent with tool-calling over a live multi-company ERP | Applied AI |
| `/projects/multi-tenant-saas-architecture/` | Multi-tenant SaaS designed from spec (SRS and architecture authored solo) | Systems |
| `/projects/hiretrack/` | HireTrack, open-source job pipeline tracker (public code a stranger can read) | Systems, Applied AI |
| `/projects/social-intelligence-backend/` | Real-time ingestion, vector search and alerting backend, built solo | Systems |
| queued: HL7 operations tool (PHI-access auditing), prompt-management platform, HRMS biometric integration | | |

Eligibility test for a case-study page **[J]**: at least two real decisions with a named rejected
alternative, at least one real failure, and at least one verifiable fact. A build that fails the
test stays a one-line row under "Smaller builds". Verified-only content feels thin when padded,
so do not pad.

Existing data ids in `projects.json` may look like internal product names. Audit them before
they become URL slugs or anchor ids.

### 2.3 URL map and redirects

| URL | Status | In nav | Linked from | Note |
|---|---|---|---|---|
| `/` | keep, rebuild | logo | everywhere | |
| `/projects/` | keep, rebuild | Work | nav, home, footer | label "Work" |
| `/projects/{slug}/` | **new** | no | home, work index, role pages, posts | 5 at launch |
| `/about/` | keep, rebuild | About | nav, footer | holds working rules |
| `/journal/` | keep, rebuild | Writing | nav, home, footer | label "Writing" |
| `/journal/{slug}/` | keep | no | index, related links | see redirects for 2 posts |
| `/contact/` | keep, rebuild | Contact | nav, footer, every CTA | |
| `/for/{role}/` x4 | keep, rebuild | no | hero router, footer, résumé PDFs, LinkedIn | slugs unchanged |
| `/services/` | keep, reframe | **no** | footer, contact, page-end notes | title "Problems I solve" |
| `/404` | keep, restyle | no | | `noindex` |
| `/resume/*.pdf` | keep filenames | header action, role pages, about | | content regenerated in phase 5 |
| `/rss.xml`, `/llms.txt` | keep | no | journal index, `<head>` | `llms.txt` regenerated from data |

Proposed redirects (Astro `redirects`, emitted as meta-refresh pages on GitHub Pages, so the
equity transfer is weaker than a 301, which is one more reason to keep every other URL):

| From | To | Reason | Decider |
|---|---|---|---|
| `/journal/welcome/` | `/about/` | 82 words, stale claims, superseded by About | Editorial lead |
| `/journal/flowers-of-multan/` | `/journal/` | Personal essay. The brief says the site is fully professional and personal flavour is implicit only. Alternative: keep it published but unlisted. This is Mubashir's writing, so his call. | **Mubashir** |
| `/for/` (new, soft) | `/` | So a trimmed URL does not 404 | UX |

Also needed: `/journal/rebuilding-for-mobile/` describes a design that will no longer exist.
Editorial lead to either refresh it as a dated build log or fold it into a redesign write-up at
the same URL. Do not redirect it blindly. Post-build check: redirect source URLs must not appear
in `sitemap-0.xml`.

Housekeeping: `public/resume/Mubashir-Rehman-Full-Stack.md` is a stray markdown file served
publicly. Confirm it is intended, otherwise remove.

### 2.4 Navigation

**Primary nav (5 items maximum, all visible at every width):**

| Position | Item | Target | Note |
|---|---|---|---|
| 1 | Work | `/projects/` | |
| 2 | Writing | `/journal/` | |
| 3 | About | `/about/` | |
| 4 | Contact | `/contact/` | |
| action | **Résumé (PDF)** | default track PDF | button styled as the site's primary action. On a role page it points to *that* track's PDF and its accessible name says so. |

Also in the header: wordmark "MR" (links home) and the theme toggle. No search (static site,
fewer than 30 pages). No dropdowns. No mega menus.

**Mobile pattern [E, J]:** hidden navigation cuts discoverability and slows tasks (NN/g, 179
participants: about 20% lower discoverability, 15% slower on mobile, 39% slower on desktop) [E].
With only four destinations there is nothing to hide. So:

- Header is **two rows, in flow, not sticky**. Row 1 (48px): wordmark left; theme toggle and
  Résumé button right. Row 2 (44px): the four links spread evenly, each a 44px-tall target.
- No hamburger, no drawer, no fixed bottom bar. A fixed bar costs ~56px of a 640px viewport,
  collides with the browser's own bottom toolbar, and can obscure focused elements (WCAG 2.2
  2.4.11) [E]. Long pages end with a next-link and the footer repeats the nav, so there is no
  dead end.
- **[T]** If tests show people lose orientation on long case studies, add a sticky bottom bar in
  a later iteration, with `scroll-padding-bottom` set.

**Desktop:** a single row. Wordmark, then the four links, then (right-aligned) toggle and
Résumé. Not sticky. Case studies and long posts add a sticky in-page contents rail (§3.3).

**Footer (every page, about 55 words):**

| Group | Content |
|---|---|
| Identity | Name, "Backend engineer, Lahore", one line: "Open to remote roles, any timezone. On-site in Lahore." |
| Site | Work, Writing, About, Contact, Problems I solve |
| For roles | Backend, AI backend, Full-stack, ERP + AI (links to the four role pages, order per §8 Q7) |
| Elsewhere | Email, LinkedIn, GitHub, RSS, Résumé (PDF) |
| Legal | © year, one line on licence if wanted |

Every link in the footer is a 44px-tall row. The email address is in the same place on every
page (WCAG 3.2.6 Consistent Help) [E].

### 2.5 How the low-profile client path is reached

Never in the nav, the home hero, the home closing band, the role pages, or the footer identity
line. Five quiet entrances, in order of expected traffic:

1. **Search.** Case studies and posts carry problem-shaped headings in plain words (for example,
   "Our data lives in an ERP and we want AI on top. What does that take?"). This is the real
   front door.
2. **Page-end note** on every case study and post, one sentence: "Working on something similar?
   Email me." It is equally natural for an employer.
3. **Footer link "Problems I solve"** to `/services/`.
4. **Contact page**, one line: "Have a problem rather than a role? Read how I approach it."
5. **The phrase "open to select engagements"** appears only on Contact and `/services/`. Never
   elsewhere. That is the brief's ceiling.

Guardrails: the Contact email link takes a `?topic=` value only to set the mailto subject.
No `Service` or `ProfessionalService` structured data (SEO lead to confirm). No pricing, rates,
packages, testimonials, logo walls, booking widgets, or anything the brief's client-path ban
covers.

### 2.6 Page inventory and word budgets (main content only)

| Page | Target | Hard cap |
|---|---|---|
| Home | 295 | 330 |
| Work index | 380 | 420 |
| Case study | 725 | 850 |
| About | 450 | 500 |
| Journal index (launch, up to 8 posts) | 300 | 350 |
| Journal post | 500 to 1,200 by type | 1,500 |
| Role page | 285 | 320 |
| Services | 290 | 330 |
| Contact | 70 | 90 |
| 404 | 25 | 35 |
| Header chrome | 8 | 12 |
| Footer chrome | 55 | 65 |

A build-time gate (engineering plan §8.5) should fail on any page over its cap, on em dashes,
and on the banned-word list.

---

## 3. Page blueprints

### 3.0 Conventions used below

- **Fold, phone:** 375 x 640 CSS px (a realistic worst case once browser chrome is subtracted).
  Hard rule for Home: the Résumé button is fully visible by y = 560 on a 375-wide viewport.
- **Fold, desktop:** 1440 x 800.
- **Primary CTA:** exactly one per page, visually dominant, present without JavaScript.
- **Content source names:** "profile" = `profile.json`, "case study" = the new case-study
  collection (successor to `projects.json`), "post" = the journal collection, "roles" =
  `roles.json`. Nothing in this document is hand-copied into more than one file; positioning copy
  comes from one `positioning` field (used by the Home lede, meta descriptions, JSON-LD, the OG
  card and the AskMe prompt), as `CLAUDE.md` already requires.
- **Layout constraint, all templates:** prose column 60 to 72 characters. Never a horizontal page
  scroll at 320px. Cards are avoided: the pattern is ruled rows and numbered sections (notebook
  entries), not boxes.
- **Wireframe notation:** `[ ]` button, `( )` toggle, `->` link, `v` disclosure, `{ }` content
  to be filled from a verified source. Wireframes carry no invented facts.

---

### 3.1 Home

| | |
|---|---|
| **Goal** | In one screen, identify him to a recruiter and show the work to a CTO. |
| **Primary audience** | Recruiter, then CTO. |
| **Primary CTA** | **Résumé (PDF)** |
| **Secondary** | Email me; track chips (Backend, AI backend, Full-stack, ERP + AI); "All work"; "All writing". |

**Section order**

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 0 | Header | Wayfinding. Résumé one click away. | nav config; profile résumé default | 8 |
| 1 | **Hero** | Name, role, years, place, current employer, stack, availability, primary action, track router | profile: name, role line, `yearsFullTime`, location, currentRole, availability; hero line and `positioning` | 75 |
| 2 | **Selected work** | Prove it. Three builds, one per pillar (Systems, Applied AI, Ownership), as numbered ruled rows. Each row: pillar label, function-based title, one-line summary (max 20 words), role on it, year, arrow. No stack tags on Home. | case studies with `flagship: true` | 120 |
| 3 | **Latest writing** | Second proof, and freshness. Two posts: title, short answer (max 25 words), date. Renders only when at least 2 posts have a short answer. | 2 newest posts | 60 |
| 4 | **Ask** | Optional Q&A entry: "Questions about my work? Ask." Opens the chat dialog. Inline, never a floating bubble. | static string | 15 |
| 5 | **Close** | Exit actions in one row: Résumé, Email, LinkedIn, GitHub. | profile | 25 |
| 6 | Footer | | | (55) |

Hero contents in reading order: mono eyebrow with name; second eyebrow line "Backend engineer
· 3+ yrs · Lahore · Remote"; the hero line as the `<h1>`; lede (max 22 words, starts with the
current employer as an anchor for scanning recruiters); a single mono line of core stack; CTAs;
availability line; track chips. The lede pattern is "Software Engineer at TransData. {positioning}".

**Above the fold**

- **375px phone:** header (92px), name and identity eyebrow, hero line, lede, stack line, the
  Résumé button (bottom edge by ~500px). "Email me" and the availability line may sit just under.
  Track chips and the first work row begin below the fold, with the first row's title peeking
  as a scroll cue.
- **1440px desktop:** a two-column composition. Left: identity, hero line, lede, stack, CTAs,
  track chips, availability. Right: the three Selected-work rows. So a recruiter and a CTO each
  find their content without scrolling. DOM order stays Hero, then Selected work; only the grid
  places them side by side. Requirement: all three titles and one-liners visible at 1440 x 800.

**Signature interaction:** none, on purpose. The hero is typography. The chat entry is a
user-initiated utility, not a signature element.

**Wireframe, 375px**

```
 375px wide                                  fold = 640px
+--------------------------------------+
| MR                     (dark) [Résumé]|  row 1, 48px
| Work    Writing    About    Contact   |  row 2, 44px
+--------------------------------------+
| MUBASHIR REHMAN                      |  mono, small
| Backend engineer · 3+ yrs            |
| Lahore · Remote                      |
|                                      |
| I like difficult systems.            |
| I like figuring out why they         |
| break. Then I like making            |
| them boring.                         |  <h1>, ~28px
|                                      |
| Software Engineer at TransData. I    |
| turn messy multi-system workflows    |
| into reliable software, with AI      |
| where it earns its place.            |  lede
|                                      |
| Python · Django · FastAPI · Postgres |  mono stack line
|                                      |
| [ Résumé (PDF)                     ] |  primary, full width, 48px  (y ~ 500)
|  Email me ->                         |  44px target
|  Open to remote roles, any timezone  |
- - - - - - - - - FOLD ~640 - - - - - - -
|  Hiring for a specific track?        |
|  [Backend]        [AI backend]       |
|  [Full-stack]     [ERP + AI]         |
|                                      |
| 01  SELECTED WORK          All work ->|
|--------------------------------------|
| SYSTEMS                         {yr} |
| {Function-based title}               |
| {One-line summary, max 20 words}     |
| {Role on it}                       ->|
|--------------------------------------|
| ... rows 02, 03 ...                  |
|                                      |
| 02  LATEST WRITING        All writing->|
| {title}                              |
| {short answer, max 25 words}         |
| {date}                               |
| ... second post ...                  |
|                                      |
| Questions about my work? [ Ask ]     |
|                                      |
| Résumé (PDF) · Email                 |
| LinkedIn · GitHub                    |
+--------------------------------------+
| footer                               |
+--------------------------------------+
```

**Wireframe, 1440px**

```
 1440px wide                                                                          fold = 800px
+------------------------------------------------------------------------------------------------+
| MR    Work   Writing   About   Contact                                (dark)   [ Résumé (PDF) ]|
+------------------------------------------------------------------------------------------------+
|                                                                                                |
|  MUBASHIR REHMAN                                   01  SELECTED WORK                All work ->|
|  Backend engineer · 3+ yrs · Lahore · Remote       -------------------------------------------|
|                                                    SYSTEMS                              {yr}   |
|                                                    {Function-based title}                      |
|  I like difficult systems.                         {One-line summary, max 20 words}            |
|  I like figuring out why they break.               {Role on it}                            ->  |
|  Then I like making them boring.                   -------------------------------------------|
|                                                    APPLIED AI                           {yr}   |
|  Software Engineer at TransData. I turn messy      {Function-based title}                      |
|  multi-system workflows into reliable software,    {One-line summary}                          |
|  with AI where it earns its place.                 {Role on it}                            ->  |
|                                                    -------------------------------------------|
|  Python · Django · FastAPI · PostgreSQL            OWNERSHIP                            {yr}   |
|                                                    {Function-based title}                      |
|  [ Résumé (PDF) ]    Email me ->                   {One-line summary}                          |
|                                                    {Role on it}                            ->  |
|  Hiring for a track?  Backend · AI backend ·       -------------------------------------------|
|  Full-stack · ERP + AI                                                                         |
|  Open to remote roles, any timezone.                                                           |
|                                                                                                |
- - - - - - - - - - - - - - - - - - - - - - - -  FOLD 800  - - - - - - - - - - - - - - - - - - - -
|  02  LATEST WRITING                                                            All writing ->  |
|  {post title}                          {post title}                                            |
|  {short answer, max 25 words}          {short answer, max 25 words}                            |
|  {date}                                {date}                                                  |
|                                                                                                |
|  Questions about my work?  [ Ask ]                                                             |
|------------------------------------------------------------------------------------------------|
|  Résumé (PDF)   Email   LinkedIn   GitHub                                                      |
+------------------------------------------------------------------------------------------------+
| footer                                                                                         |
+------------------------------------------------------------------------------------------------+
```

Flag for the SEO lead: the `<h1>` is the hero line, so the entity and keywords live in the
eyebrow, the `<title>` and the Person data. If that proves too weak, the fallback is an `<h1>`
of "Mubashir Rehman, backend engineer" with the hero line as a large paragraph. I recommend the
first, because the hero line is the brief's centrepiece **[J]**.

---

### 3.2 Work index (`/projects/`)

| | |
|---|---|
| **Goal** | Let a CTO pick one case study in under 10 seconds; show recruiters the breadth. |
| **Primary audience** | CTO. |
| **Primary CTA** | Open a case study. The first row carries a quiet "Start here" mark. |
| **Secondary** | Résumé, Contact (both in header and footer). |

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 1 | Intro (`<h1>` "Work") | Orientation in one line: "Five case studies, then smaller builds. Each case study: problem, system, decisions, what broke." | static | 25 |
| 2 | **Case studies** (5 ruled rows) | Row: number, function-based title, one-line summary (max 20 words), role on it, pillar tag, year. Ordered by recommended reading order, not date. No stack tags (they live inside the page). | case study frontmatter | 200 |
| 3 | **Smaller builds** (max 8 lines) | Breadth without page cost. One line each: name (function-based; QT20 and HireTrack-adjacent items may be named), max 12 words, year, and repo or demo links where public. Includes one line for this site, one for the published research, one for academic systems work. | `smallerBuilds` list | 130 |
| 4 | Note and next | "Work under NDA is described by function." Then a link to About. | static | 25 |

Not on the site: games and coursework that do not support the backend and AI positioning. They
stay on the résumé.

- **375px above the fold:** header, `<h1>`, intro line, first row in full, second row's title.
- **1440px above the fold:** `<h1>`, intro, rows 1 to 4. Row layout on desktop is a table-like
  grid: number, title and summary, role, year.
- **Signature:** none. **Micro:** row hover shifts the arrow 4px (off under reduced motion).

---

### 3.3 Case study (`/projects/[slug]/`)

| | |
|---|---|
| **Goal** | Prove judgement in about 2 minutes of skimming, and reward a full 4-minute read. |
| **Primary audience** | CTO / hiring manager; recruiters read only the header. |
| **Primary CTA** | **Email me about this build** (mailto with the case-study title in the subject). |
| **Secondary** | Next case study; related post; GitHub or demo link (only where public); Résumé in header. |

Order is fixed (plan §6, with a change: "What broke" precedes "Outcome" so the honest part is
not buried after the victory lap). Budgets per section are in §7.1.

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 0 | Breadcrumb | Orientation. "Work / {short title}" | route | 0 |
| 1 | **Header** | `<h1>` function-based title. One-line summary (max 20 words, the recruiter line). Facts row: Role on it, Period, Status, one verified Outcome fact. Public links if any. | frontmatter | 50 |
| 2 | **Problem** | Whose problem, why messy, constraints. No identifying detail. | body | 90 |
| 3 | **System** | The signature diagram, plus a numbered legend list of 4 to 6 components (the no-JS text equivalent). | `diagram` spec | 120 |
| 4 | **Decisions and trade-offs** | Three decision records: choice, alternative rejected, why, cost accepted. | `decisions[]` | 240 |
| 5 | **What broke, and what I got wrong** | One or two real incidents: symptom, root cause, fix, the rule. Links to the post if one exists. | `broke[]` | 130 |
| 6 | **Outcome** | Verified or claimed facts only, each with an evidence reference in the data. Where no number exists, say what is known ("live since", "adopted by the team"). | `outcome[]` | 50 |
| 7 | **The rule I took from this** | One line, numbered, linking to the rule in About. | `rule` | 20 |
| 8 | **Stack** | Tags only, max 12, no prose. | `stack[]` | 0 |
| 9 | **Next** | Page-end note ("Working on something similar? Email me."), next case study, related post. | related | 25 |

- **375px above the fold:** breadcrumb, `<h1>` (max 3 lines), summary (max 3 lines), the four
  facts as a label/value list, and a collapsed "On this page" disclosure. "01 Problem" starts at
  the fold. A recruiter has role, period, status and outcome without scrolling.
- **1440px above the fold:** left rail "On this page" (Problem, System, Decisions, What broke,
  Outcome), then `<h1>`, summary, facts row. At 1200px and wider, Problem and System sit
  side by side (Problem in the narrow column, the diagram in the wide one) so the diagram
  is visible without scrolling. DOM order is unchanged (Problem, then System).
- **Signature:** the explorable system diagram (§5).
- **Rail behaviour:** the "On this page" rail is sticky on desktop with the active section
  marked (a JS-enhanced state; plain anchor links without JS). On phone it is a native
  `<details>`.

**Wireframe, 375px**

```
 375px wide                                  fold = 640px
+--------------------------------------+
| MR                     (dark) [Résumé]|
| Work    Writing    About    Contact   |
+--------------------------------------+
| Work / {short title}                 |  breadcrumb
|                                      |
| {Function-based title, e.g.          |
|  "An AI front desk for dental        |
|  clinics"}                           |  <h1>
|                                      |
| {Summary, max 20 words}              |
|                                      |
| ROLE      {Sole backend engineer}    |
| PERIOD    {2026}                     |
| STATUS    {Live in production}       |
| OUTCOME   {one verified fact}        |
|                                      |
| [ On this page                    v ] |  <details>, 44px
- - - - - - - - - FOLD ~640 - - - - - - -
| 01  PROBLEM                          |
| {~90 words}                          |
|                                      |
| 02  SYSTEM                           |
| +----------------------------------+ |
| |  [ Client ]                      | |
| |      |                           | |
| |  [ API ]--[ Queue ]              | |  vertical-first,
| |      |         |                 | |  nodes are buttons
| |  [ Store ]  [ Worker ]           | |
| +----------------------------------+ |
| Selected: {component name}           |
| {max 40 words: what it does, why,    |
|  how it fails}                       |
| 1. Client  2. API  3. Queue ...      |  legend list (no-JS text)
|                                      |
| 03  DECISIONS                        |
| 3.1 {decision title}                 |
|   Chose / Rejected / Why / Cost      |
| ...                                  |
| 04  WHAT BROKE                       |
| 05  OUTCOME                          |
| Rule 04: {one line}                  |
| Stack: {tag} {tag} {tag}             |
| Working on something similar?        |
| Email me. · Next: {case study} ->    |
+--------------------------------------+
```

**Wireframe, 1440px**

```
 1440px wide                                                                          fold = 800px
+------------------------------------------------------------------------------------------------+
| MR    Work   Writing   About   Contact                                (dark)   [ Résumé (PDF) ]|
+------------------------------------------------------------------------------------------------+
|  Work / {short title}                                                                          |
|                                                                                                |
|  ON THIS PAGE       {Function-based title}                                                     |
|  > Problem          {Summary, max 20 words}                                                    |
|    System           ROLE {..}   PERIOD {..}   STATUS {..}   OUTCOME {one verified fact}        |
|    Decisions        ----------------------------------------------------------------------     |
|    What broke       01 PROBLEM              |  02 SYSTEM   (select a component)                |
|    Outcome          {~90 words}             |  +--------------------------------------------+  |
|                                             |  |  [Client]-->[API]-->[Queue]-->[Worker]     |  |
|  (sticky rail)                              |  |               |                  |         |  |
|                                             |  |            [Store]<-------[Model host]     |  |
|                                             |  +--------------------------------------------+  |
|                                             |  Selected: {component}                           |
|                                             |  {max 40 words: what, why, how it fails}         |
- - - - - - - - - - - - - - - - - - - - - - - -  FOLD 800  - - - - - - - - - - - - - - - - - - - -
|                     03 DECISIONS   (single 68ch column)                                        |
|                     04 WHAT BROKE                                                              |
|                     05 OUTCOME                                                                 |
|                     Rule 04 · Stack · Next                                                     |
+------------------------------------------------------------------------------------------------+
```

---

### 3.4 About (`/about/`)

| | |
|---|---|
| **Goal** | Answer "what is he like to work with" with evidence, and let a recruiter verify the timeline. |
| **Primary audience** | CTO / hiring manager, then recruiter. |
| **Primary CTA** | **Email me** |
| **Secondary** | Résumé (PDF), LinkedIn, GitHub, the Springer DOI. |

**"How I work" is not its own page** (§2.1). It is section 3 here.

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 1 | `<h1>` and bio | Answer-first: who, what, where, how long. Optional portrait (176px, `astro:assets`) if Mubashir says yes. | profile bio | 90 |
| 1b | **Facts block** (definition list) | Role, based in, works, years (full-time), current employer, published. Identical fields to the Home hero. | profile | 30 |
| 2 | **Working rules** | 5 to 7 numbered rules, each max 20 words, each with one evidence link (a case study or a post). Stable anchors `#rule-1`, so posts and case studies can link to them. Shape only, copy is the content lead's: "Rule N. {imperative sentence, max 15 words}. Evidence: {link}." | `rules[]` in profile | 140 |
| 3 | **Timeline** | 4 rows, reverse chronological: TransData (2025 to now), VeritusLabs (2023 to 2025, engineer then team lead), ITU teaching assistant (2022 to 2025, part-time, alongside), GameBole (2022). Each: title, dates, max 25 words of scope. Concurrent work is labelled so it never contradicts the "3+ years full-time" rule. Link to the résumé. | profile experience | 110 |
| 4 | **Teaching and research** | Five semesters as an OS teaching assistant; the Springer paper with DOI. | profile | 50 |
| 5 | **Elsewhere** | Contact routes. | profile | 25 |

- **375px above the fold:** `<h1>`, first two lines of the bio, the Facts block begins (or
  the portrait and name, if a photo is used).
- **1440px above the fold:** `<h1>` and bio on the left (68ch), Facts block on the right,
  first rule visible below.
- **Signature:** none. **Micro:** each rule's evidence links are plain links, no disclosure.

---

### 3.5 Journal index (`/journal/`)

| | |
|---|---|
| **Goal** | Show that he writes and thinks, and make one post easy to pick. |
| **Primary audience** | CTO; answer engines (a clean, dated list). |
| **Primary CTA** | Read the pinned "Start here" post. |
| **Secondary** | RSS; Contact. |

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 1 | Intro (`<h1>` "Writing") | "Incident write-ups and lab notes. Short answer first." | static | 20 |
| 2 | **Start here** | One pinned post, chosen by the editorial lead. | `pinned` | 35 |
| 3 | **All posts**, reverse chronological | Row: type label (Incident, Lab note, Build log), title, short answer (max 25 words), date, reading time. Series shown as a group with part numbers ("Part 2 of 4"). | posts | 35 per post |
| 4 | Feed line | "RSS" link and one line on cadence if it is real. | static | 10 |

No filters and no pagination until 15 or more posts; then type filters as plain links.
- **375px above the fold:** `<h1>`, intro, the pinned post in full.
- **1440px above the fold:** `<h1>`, intro, pinned post, first three rows.
- **Signature:** none.

---

### 3.6 Journal post (`/journal/[slug]/`)

| | |
|---|---|
| **Goal** | Be quotable and prove thinking; convert a reader into a look at the underlying case study. |
| **Primary audience** | CTO, founder arriving from search, answer engines. |
| **Primary CTA** | **Read the case study this came from** (or the next post when none applies). |
| **Secondary** | Email me; RSS; Résumé (header). |

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 0 | Breadcrumb | "Writing / {short title}" | route | 0 |
| 1 | **Header** | `<h1>`; meta line: type, date, updated, reading time. | frontmatter | 15 |
| 2 | **Short answer** | The answer, in 1 to 2 sentences, first. This is what an answer engine quotes. | `shortAnswer` | 40 |
| 3 | **TL;DR** (optional) | 3 bullets, only for posts over 900 words. For incidents: symptom, cause, fix. | `tldr[]` | 45 |
| 4 | **Context** | Why this came up. Only what the reader needs. | body | 100 |
| 5 | **Body** | 2 to 5 H2 sections, each 60 to 200 words; headings are claims or real questions. Code blocks max 25 lines. | body | 300 to 800 |
| 6 | **What I got wrong** | Mandatory for incident posts, encouraged elsewhere. | body | 120 |
| 7 | **The rule I took from this** | One numbered line; links to the About rule if adopted. | `rule` | 25 |
| 8 | **FAQ** (optional) | 2 to 4 real questions, answers max 50 words. | `faq[]` | 150 |
| 9 | **Related** | One case study, one post. | `related` | 20 |
| 10 | Page-end | "Working on something similar? Email me." and RSS. | static | 10 |

- **375px above the fold:** breadcrumb, `<h1>` (max 3 lines), meta line, the whole Short answer
  (max 5 lines). Requirement: the answer is visible without scrolling.
- **1440px above the fold:** `<h1>`, Short answer in the 66ch column; the meta (date, type,
  reading time, tags) sits in the left margin as notebook marginalia. Sidenotes (`<aside>`)
  sit in the right margin at 1200px and above; on smaller widths they inline as a labelled
  callout.
- **Signature:** none by default. Incident posts may opt into the incident-timeline component
  (§5.3, idea 4).

**Wireframe, 375px**

```
 375px wide                                  fold = 640px
+--------------------------------------+
| MR                     (dark) [Résumé]|
| Work    Writing    About    Contact   |
+--------------------------------------+
| Writing / {short title}              |
|                                      |
| {Post title: a claim or a question,  |
|  max 3 lines}                        |  <h1>
|                                      |
| INCIDENT · {date} · 6 min            |  meta, mono
|                                      |
| SHORT ANSWER                         |
| {1 to 2 sentences that answer the    |
|  title. Max 40 words.}               |
|                                      |
- - - - - - - - - FOLD ~640 - - - - - - -
| TL;DR   (only if > 900 words)        |
| - {symptom}                          |
| - {cause}                            |
| - {fix}                              |
|                                      |
| Context                              |
| {max 100 words}                      |
|                                      |
| {H2: a claim or a real question}     |
| {60 to 200 words}                    |
| ...                                  |
| What I got wrong                     |
| {max 120 words}                      |
|                                      |
| RULE 07                              |
| {one line, max 25 words}             |
|                                      |
| Related: {case study} · {post}       |
| Working on something similar?        |
| Email me.                            |
+--------------------------------------+
```

**Wireframe, 1440px**

```
 1440px wide                                                                          fold = 800px
+------------------------------------------------------------------------------------------------+
| MR    Work   Writing   About   Contact                                (dark)   [ Résumé (PDF) ]|
+------------------------------------------------------------------------------------------------+
|                                                                                                |
|  Writing / {short title}                                                                       |
|                                                                                                |
|  INCIDENT             {Post title: a claim or a question}                                      |
|  {date}                                                                                        |
|  Updated {date}       SHORT ANSWER                                                             |
|  6 min                {1 to 2 sentences that answer the title. Max 40 words.}                  |
|  #tag #tag                                                                                     |
|  (marginalia)         TL;DR  (only > 900 words)                                                |
|                       - {symptom}   - {cause}   - {fix}                                        |
|                                                                                                |
|                       Context                                                    | sidenote     |
- - - - - - - - - - - - - - - - - - - - - - - -  FOLD 800  - - - - - - - - - - - - - - - - - - - -
|                       {H2}                                                                     |
|                       {body, 66ch}                                               | sidenote     |
|                       What I got wrong                                                         |
|                       RULE 07  {one line}                                                      |
|                       Related · Email me · RSS                                                 |
+------------------------------------------------------------------------------------------------+
```

---

### 3.7 Role landing page (`/for/[role]/`)

| | |
|---|---|
| **Goal** | Convert a recruiter holding one requisition: confirm fit in 30 seconds and hand over the right résumé. Also legible to the hiring manager it gets forwarded to. |
| **Primary audience** | Recruiter (arrived from an application, LinkedIn, or the résumé PDF). |
| **Primary CTA** | **Résumé, {track}, PDF** |
| **Secondary** | Email me; other tracks (plain links); the case studies in the evidence list. |

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 1 | **`<h1>` and fit line** | Track label as `<h1>`; fit statement (max 30 words): title, years, core stack, ownership scope. | roles `headline`, `fit` | 35 |
| 2 | **Evidence** | Three items, ordered for this track, each max 30 words, each linking to a case study. | roles `featured` + case studies | 90 |
| 3 | **Stack for this track** | Tags only, max 12, matching what a req is likely to name. | roles `skills` | 0 |
| 4 | **Practicalities** (definition list) | Based in, remote (any timezone), on-site (Lahore), current employer, work authorization statement. See §8 Q8. | profile | 40 |
| 5 | **FAQ** | 3 or 4 recruiter questions: remote? primary stack? years? which roles suit? Visible, answer max 30 words each. | roles `faqs` | 120 |
| 6 | Other tracks | Three plain links. | roles | 0 |

- **375px above the fold:** `<h1>`, fit line, Résumé button (full width), start of Practicalities.
- **1440px above the fold:** left column: `<h1>`, fit line, Résumé button, Email link;
  right column: Practicalities and the first evidence item.
- **Signature:** none. The header Résumé button on this page points to this track's PDF.
- Not linked from the primary nav. Linked from the hero router, the footer, the résumé
  PDFs and LinkedIn "Featured".
- Risk: four near-duplicate pages. Unique evidence ordering and per-track FAQ answers keep them
  distinct; the SEO lead decides indexing **[T]**.

---

### 3.8 Services, reframed as "Problems I solve" (`/services/`)

| | |
|---|---|
| **Goal** | Let a founder recognise their problem in plain words and send one email, without the page reading as anything other than a candid statement of what he does well. |
| **Primary audience** | Founder / client. Must be harmless to a recruiter. |
| **Primary CTA** | **Describe the problem** (mailto, subject "A problem worth a look") |
| **Secondary** | Two linked case studies as proof. |

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 1 | `<h1>` "Problems I solve" and lede | Max 25 words. "Workflows that span systems that do not talk to each other. I make them reliable, and add AI where it helps." | static | 30 |
| 2 | **Five problems**, each an `<h2>` in the reader's own words | Symptom (max 15 words as the heading), what I build (max 20 words), one link to a case study. Examples of symptoms: people re-key data between tools; we want AI but our data lives in an ERP; the AI demo works and production does not; the system runs and nobody trusts it; a migration nobody wants to touch. | static + case study links | 200 |
| 3 | **How it starts** | Two lines: send the problem; get back what I see and what I would check first. No SLA, no price. | static | 40 |
| 4 | Close | Email link. The one place besides Contact where "open to select engagements" appears. | profile | 20 |

- **375px above the fold:** `<h1>`, lede, first problem heading.
- **1440px above the fold:** `<h1>`, lede, first two problems.
- **Banned on this page:** pricing, rates, packages, testimonials, logo walls, booking or
  calendar widgets, urgency language, and anything else the brief's client-path ban covers.
- **Signature:** none. Not in nav. Linked from footer, Contact, and page-end notes only.

---

### 3.9 Contact (`/contact/`)

| | |
|---|---|
| **Goal** | Make each audience's exit action a single obvious step. |
| **Primary audience** | All. |
| **Primary CTA** | **Email**, the address shown as text and as a link. |
| **Secondary** | LinkedIn, GitHub, Résumé (PDF); optional short form (§8 Q6). |

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 1 | `<h1>` "Contact" + one line | "Email is fastest. A role or a problem, in two lines, is enough." | static | 20 |
| 2 | **Email** | Address as visible text, a mailto link, and a Copy button (JS-enhanced; the link works without it). | profile | 5 |
| 3 | **Elsewhere** | LinkedIn, GitHub, Résumé per track. Optional phone or WhatsApp per §8 Q5. | profile | 15 |
| 4 | **Where and when** | "Lahore, PKT (UTC+5). Open to remote roles, any timezone. On-site in Lahore. Open to select engagements." | profile | 20 |
| 5 | Problem note | "Have a problem rather than a role? Read how I approach it." links to `/services/`. | static | 12 |
| 6 | Ask | Chat entry: "Quick question about my work?" | static | 8 |

- **375px above the fold:** all of it. **1440px:** all of it, in a single column of
  about 60ch, left-aligned, generous empty space (*ma*).
- **Signature:** none. **Micro:** Copy button, text changes to "Copied", announced politely.
- If a form is used: three fields (name, email, message), visible labels, `autocomplete`
  attributes, native POST that works without JS, spam handled by a honeypot and endpoint
  filtering, never a CAPTCHA.

---

### 3.10 404

| | |
|---|---|
| **Goal** | Recover the visitor in one click. |
| **Primary CTA** | **Go to the home page** |
| **Secondary** | Work, Writing, Contact, Résumé (plain links). |

Content, about 25 words: `<h1>` "Nothing here."; one line ("That page does not exist, or it moved.
These are the ones that do."); the five links. `noindex`. No JavaScript, no search, no chat.
Everything fits in the phone fold and the desktop fold. Absolute asset paths so it renders at
any depth (GitHub Pages serves one `404.html` for every unknown path). Signature: none. A
touch of the workshop voice is allowed (a mono label "ERROR 404 · NOT FOUND"), but no jokes.

---

## 4. The two tests

### 4.1 The 6-second recruiter test

**Pass definition.** A non-engineer shown the phone home screen for 6 seconds can state: his
role, roughly his experience, where he is based and whether he can work remote, one stack item,
and where to tap for the résumé. **[T]** Protocol: five people with hiring or recruiting exposure,
375 x 640 and 390 x 844 screenshots plus the live page over a throttled connection; pass is 4 of 5
on role and place, 5 of 5 on finding the résumé.

**Phone (single column), what the eye does:**

| Seconds | Sees | Why it is there |
|---|---|---|
| 0 to 1 | Top-left "MUBASHIR REHMAN", then "Backend engineer · 3+ yrs", "Lahore · Remote" | First stop is top-left; this is the identity a recruiter is scanning for [E]. |
| 1 to 3 | The hero line as a large block | Establishes voice. It must not be mistaken for the whole message, so the plain identity sits above it. |
| 3 to 5 | "Software Engineer at TransData" and the stack line | Current employer and keywords: the recruiter's match check [E]. |
| 5 to 6 | The full-width Résumé (PDF) button, then "Open to remote roles, any timezone" | The exit action. Above y = 560. |

**Desktop (1440), what the eye does:** F-pattern [E]. Top-left identity line; down the left edge
across the hero line and lede; then a lateral sweep to the right column where the numbered
flagship titles form a second left-aligned scan line; the Résumé button is in the header (top
right) and in the hero (left). After 6 seconds: role, years, place, current employer, three
builds by title.

**Known risk [T]:** a poetic hero can read as "writer" to a 6-second skim. If two or more testers
misread the role, promote the identity line to the same size as the hero line's first sentence,
or move to the fallback `<h1>` in §3.1.

### 4.2 The 2-minute CTO test

**Pass definition.** After 2 minutes the CTO can state (a) what was built, (b) what his part
was, (c) one trade-off he made, (d) one thing that broke, and wants to talk. Proxy signals once
analytics exists (§8 Q10): scroll to "What broke", diagram interaction, GitHub or email click.

| Time | Page | What the eye does |
|---|---|---|
| 0:00 to 0:20 | Home | Hero line, lede, then the three numbered rows on the right (desktop) or below (phone). Picks the one that matches their own domain. |
| 0:20 to 0:35 | Case-study header | Reads summary and the four facts. "Role on it" answers the ownership question. The left rail shows the page's shape at a glance. |
| 0:35 to 1:05 | Problem and System | Reads 90 words, then the diagram. Selects two components; each reveals what it does, why, and how it fails. |
| 1:05 to 1:40 | Decisions and What broke | The rail label "What broke" is literal on purpose: many CTOs jump to failures first. Looks for a rejected alternative and a real root cause. |
| 1:40 to 2:00 | Outcome, Rule, Stack | Checks that claims are modest and sourced. Reads the rule line. Then opens GitHub or a post, or emails. |

The template is built so that this order is also the *scan* order, and skipping is safe: every
section stands alone, and the header carries the recruiter line.

---

## 5. Interaction budget

### 5.1 Principles

- At most **one signature interactive element per page**, and only where it explains
  the work. **Ten KB or less of eager JavaScript** across a content page (plan budget is 50 KB).
- The interactive layer is an enhancement over content that is already complete.
- User-initiated only. Nothing moves until the user acts, except a 150ms fade on theme change.

### 5.2 Per page

| Page | Signature | Allowed micro-interactions |
|---|---|---|
| Home | none | link and button hover and focus states; arrow nudge on rows (max 4px); chat entry button |
| Work index | none | same; row hover |
| Case study | **Explorable system diagram** | rail scroll-spy highlight; decision `<details>` expand; stack tags are static |
| About | none | evidence links; nothing else |
| Journal index | none | row hover |
| Journal post | none (opt-in incident timeline for incident posts) | code-block Copy button; sidenote toggle on phone |
| Role page | none | header Résumé target switches by track |
| Services | none | none |
| Contact | none | Copy-email feedback |
| 404 | none | none |

**Allowed everywhere:** hover and focus colour or underline changes; a visible focus ring;
theme cross-fade of 150ms or less; native `<details>`; Copy buttons with a polite live-region
confirmation. Native cross-document view transitions (a CSS-only crossfade of 150ms or less)
are allowed as an enhancement.

**Reveal-on-scroll:** no text is ever hidden pending an animation. If used at all, it is an
opacity fade of at most 150ms on figures and section rules only, applied after an `html.js`
class exists, never above the fold.

### 5.3 Signature ideas, ranked by value against cost

Value: how well it explains the work to a CTO (1 to 5). Cost: design, build and content effort
(1 to 5). Ratio is a rough guide.

| Rank | Idea | Value | Cost | What it explains | No-JS fallback |
|---|---|---|---|---|---|
| 1 | **Explorable system diagram.** Components are focusable buttons; selecting one opens a panel: what it does, why it is shaped that way, how it fails. Static SVG plus numbered legend generated from the same data so they cannot drift. | 5 | 3 | Architecture and boundaries, the "seams" the brief cares about | The SVG and the legend list are the content. Same words. |
| 2 | **Decision records as disclosures.** ADR-style: chose, rejected, why, cost accepted. Native `<details>`. Not a "signature", but the best ratio, so use it on every case study. | 4 | 1 | Judgement and trade-offs | Open by default without JS; native `<details>` needs none. |
| 3 | **"Break it" toggle** layered on idea 1. Normal state versus one named failure; shows which components go red and which safeguard catches it. | 5 | 4 | Failure modes, incident handling: the brand's "why they break" | A second static diagram plus a paragraph in "What broke". Ship on the first flagship only, then judge. |
| 4 | **Incident timeline stepper** for incident posts. Timestamped log; each step highlights part of an inline diagram. | 3 | 3 | Debugging method | A plain ordered list of `<time>` entries. |
| 5 | **Ask, with sources.** The existing chat, with each answer citing the page or section it came from. Not a signature; a utility. | 3 | 2 (given it exists) | Quick routing for a busy reader | A `<noscript>` line pointing to email. Prerequisite: key behind a proxy (plan §6). |

Rejected: a live "request trace" animation through the stack. High wow, but it needs invented
latencies, which breaks the no-invented-metrics rule, and costs the most.

**Recommendation:** ship idea 1 on all case studies with one shared component fed by a diagram
spec in the frontmatter (nodes, edges, per-node text). Use idea 2 everywhere. Add idea 3 to the
first flagship in phase 2. Keep idea 5 as a utility with a decision on the proxy first.

### 5.4 Banned

Autoplay of anything (video, carousels, marquees, typewriter or rotating text); parallax and
scroll-jacking; cursor followers and custom cursors; 3D, WebGL, particle backgrounds; splash
screens and preloaders; modals on load; cookie banners (not needed if analytics is
cookieless); floating chat bubbles or any fixed overlay; hover-only content; infinite scroll;
sound; confetti; skeleton shimmer; animated number counters; carousels or tabs for essential
content; hamburger menus; bouncing "scroll down" arrows; exit-intent anything. The JS-based
router view transitions used today are also out (extra JS, focus and announcement handling,
interference with the chat and analytics) **[J]**. Engineering to confirm.

### 5.5 No-JS behaviour, per feature

| Feature | Without JavaScript |
|---|---|
| Navigation, all CTAs, résumé links | Plain links. Fully working. |
| Theme | Follows `prefers-color-scheme`. The toggle is hidden until JS runs. |
| System diagram | Static SVG plus legend list containing identical text. |
| Rail "On this page" | Anchor links; no active state. |
| Copy email / Copy code | Button hidden; the mailto link and the code stay selectable. |
| Chat | A `<noscript>` line: "Chat needs JavaScript. Email me instead." |
| Form (if any) | Native POST. |
| Latest-writing and other lists | Rendered at build time. |

### 5.6 Reduced motion and other user preferences

`prefers-reduced-motion: reduce`: every transition and animation removed except an instant state
change; no smooth scrolling; no arrow nudge; theme changes instantly; diagram selection is shown
by outline weight and a text label, never by motion. Also honour `forced-colors` (diagram
strokes use `currentColor` or system colours), `prefers-contrast: more` (thicker rules), and a
print stylesheet (light theme, nav, footer and chat hidden, link URLs shown for the résumé
and role pages).

---

## 6. Accessibility decisions (WCAG 2.2 AA, both themes)

### 6.1 Landmarks

| Landmark | Rule |
|---|---|
| `header` (banner) | wordmark, `<nav aria-label="Primary">`, Résumé action, theme toggle |
| `main id="main"` | one per page; skip-link target with `tabindex="-1"` |
| `nav aria-label="Breadcrumb"` | case study and post only; last item `aria-current="page"` |
| `nav aria-label="On this page"` | case study and long posts; `<details>` on phone |
| `article` | case study body, post body |
| `aside` | sidenotes; the selected-component panel is a labelled region, not an `aside` |
| `figure` and `figcaption` | the diagram, with SVG `<title>` and `<desc>`, and the legend list as the text equivalent |
| `footer` (contentinfo) | one `<nav aria-label="Footer">` |
| `<dialog>` | chat, opened with `showModal()` so background inertness, Esc and focus return come from the platform |

`lang="en"` on `<html>`. Unique `<title>` per page. Meaningful link text: never "Read more";
use "Read the case study: {title}". PDF links say "(PDF)" and the file name, for example
"Résumé, AI backend, PDF". External links say so.

### 6.2 Heading outline per template

| Template | Outline |
|---|---|
| Home | h1 hero line; h2 Selected work (h3 per row); h2 Latest writing (h3 per post); h2 Ask; h2 Contact |
| Work | h1 Work; h2 Case studies (h3 per row); h2 Smaller builds (list, no headings) |
| Case study | h1 title; h2 Problem; h2 System; h2 Decisions (h3 per decision); h2 What broke; h2 Outcome; h2 The rule I took from this; h2 Stack; h2 Next |
| About | h1 About; (bio is a paragraph, no heading); h2 Working rules; h2 Timeline (h3 per employer); h2 Teaching and research; h2 Elsewhere |
| Journal index | h1 Writing; h2 Start here; h2 All posts (h3 per post) |
| Post | h1; h2 per section; h2 What I got wrong; h2 The rule I took from this; h2 FAQ (h3 per question); h2 Related |
| Role | h1 track; h2 Evidence; h2 Stack; h2 Practicalities; h2 FAQ (h3 per question) |
| Services | h1 Problems I solve; h2 per problem (five) ; h2 How it starts |
| Contact | h1 Contact; h2 Elsewhere |
| 404 | h1 |

Exactly one `<h1>` per page and no skipped levels.

### 6.3 Focus order, skip links, keyboard

- **Order = DOM = visual order:** skip link, wordmark, four nav links, Résumé, theme toggle,
  main content in reading order, footer. Where a layout places two sections side by side
  (Home hero and work, case-study Problem and System), the DOM order is the reading order and
  only CSS grid moves them.
- **One skip link,** first in the DOM, "Skip to content", visible on focus, target `#main`.
  The contents rail is at most five links and is a `<details>` on phone, so a second skip link
  is not needed.
- **Diagram keyboard pattern:** components are real `<button>`s in reading order, so Tab moves
  through them (4 to 8 stops, no roving tabindex to get wrong). Enter or Space selects. Esc clears
  the selection and returns to the overview. The selected state uses `aria-pressed="true"`, a
  thicker outline, and a text label; never colour alone. The result panel is a labelled
  region with `aria-live="polite"`, updated once per selection.
- **Chat:** input has a visible label; a response is announced once complete, never token by
  token; Esc closes; focus returns to the trigger.
- **Sticky rail** must not hide focus (2.4.11 Focus Not Obscured) [E]: set `scroll-padding-top`
  and keep no other fixed element.

### 6.4 Touch and pointer

Design target 44 x 44px for the nav links, the Résumé button, chips, footer link rows, diagram
nodes and Copy buttons. The AA minimum is 24 x 24px with spacing exceptions [E]; we aim above
it because the primary audience is on a phone. Diagram node hit areas are padded in the SVG. No
hover-only content. No path-based or multi-finger gestures (Dragging Movements 2.5.7).

### 6.5 Reading and layout

Body at least 16px, 18px on reading templates at 1024px and above; line height 1.6; prose
column 60 to 72 characters. Reflow to 320px with no horizontal page scroll (1.4.10); text
spacing overrides must not break layouts (1.4.12); 200% zoom usable. Code blocks scroll inside
their own box, are focusable (`tabindex="0"`), and never widen the page. Diagram text stays
at 12px or larger at its rendered size, which is why diagrams are designed vertical first.

### 6.6 Motion

No flashing content (2.3.1). Section 5.6 for reduced motion.

### 6.7 Theme

Default follows `prefers-color-scheme`; if it is not set, dark **[J, see §8 Q9]**. The toggle is
a `<button>` with `aria-pressed` and a fixed accessible name ("Dark theme"); the choice persists
in `localStorage`, guarded by try and catch, and an inline pre-paint script prevents a flash. A
`<meta name="theme-color">` per theme. Both themes must meet: text 4.5:1, large text and UI
components 3:1 (1.4.11), and a focus indicator at least 2px, 3:1 against adjacent colours.
Links keep an underline: colour is never the only cue. The purple-on-black link pair and the
blue system-signal colour are checked in both themes before the design system is approved.

### 6.8 Forms and authentication

If a form exists: labels always visible, `autocomplete` set, errors linked with
`aria-describedby`, no CAPTCHA and no cognitive test (3.3.8) [E]. Nothing else on the site
requires login.

---

## 7. Content-structure specs

### 7.1 Case-study template

| # | Section | Purpose | Target | Max | Hard rules |
|---|---|---|---|---|---|
| H | Summary line | The recruiter line | 20 | 20 | Verb first. No adjectives. Function, not product name. |
| H | Facts row | Role on it, period, status, one outcome fact | 30 | 40 | Outcome fact must have an evidence reference. |
| 1 | Problem | Whose, why messy, constraints | 90 | 110 | No identifying detail. No client or product names. |
| 2 | System | Diagram plus 4 to 6 legend items | 120 | 150 | Each legend item max 25 words: what, why, how it fails. |
| 3 | Decisions | Three records | 240 | 270 | Each: chose, rejected, why, cost accepted. At least one rejected alternative is real. |
| 4 | What broke | One or two incidents | 130 | 160 | Symptom, root cause, fix, rule. "I got wrong" is first-person. |
| 5 | Outcome | Verified or claimed facts | 50 | 70 | Each fact has `evidence: verified or claimed`. No invented number. Empty state allowed. |
| 6 | Rule | One numbered line | 20 | 25 | Links to About `#rule-n`. |
| 7 | Stack | Tags | 0 prose | 12 tags | At the end, never the start. |
| 8 | Next | Page-end note and links | 25 | 30 | The only place a client-shaped sentence appears. |
| | **Total** | | **725** | **850** | |

**Frontmatter fields** (all enforced by the content schema):

```yaml
title:        # function-based, no product or client name; max 45 chars
slug:         # function-based, max 4 words
summary:      # max 20 words
role:         # enum: sole | lead | top-contributor | architect | contributor
period:       # "2026" or "2025 to 2026"
status:       # enum: live | shipped | handed-off | in-progress
outcomeFact:  # one line + evidence reference
pillars:      [systems, applied-ai, ownership]
tracks:       [backend, ai-backend, full-stack, erp-hrms]
flagship:     false          # true for the three on Home
stack:        []             # max 12
diagram:      { nodes: [ { id, label, text, failure } ], edges: [ [from, to] ] }
decisions:    [ { title, chose, rejected, why, cost } ]      # exactly 3
broke:        [ { symptom, cause, fix, rule } ]               # 1 to 2
outcome:      [ { text, evidence } ]                          # max 4
rule:         { n, text }
related:      { post, next }
links:        { repo, demo }   # only where public
ndaReviewed:  true             # content lead sign-off for identifying detail
```

**Build-time checks:** summary max 20 words; total words within the cap; three decisions; every
outcome has evidence; no em dash; banned words absent; `ndaReviewed` true; each diagram node
has `text` (so the legend and the panel are generated from one source).

### 7.2 Journal post template

Types and budgets:

| Type | Purpose | Words |
|---|---|---|
| Incident | What broke, how it was found, what changed | 700 to 1,200 |
| Lab note | One question tested, with the answer | 500 to 800 |
| Build log | A decision sequence on one build | 600 to 1,000 |

Hard cap 1,500. Anything longer becomes a series with parts.

**Skeleton (markdown body plus frontmatter):**

```markdown
---
title:         # a claim or a real question; max 45 chars
description:   # max 155 chars; may equal the short answer, trimmed
type:          # incident | lab-note | build-log
date:
updated:
shortAnswer:   # 1 to 2 sentences, max 40 words: the answer, first
tldr:          # optional, 3 bullets, only if > 900 words
rule:          # max 25 words; the rule I took from this
series:        # optional: { name, part, of }
related:       { caseStudy, post }
faq:           # optional, 2 to 4 real questions, answers max 50 words
---

## Context                       (max 100 words)
## {Claim or question}           (60 to 200 words; 2 to 5 of these)
## What I got wrong              (max 120 words; mandatory for incidents)
## The rule I took from this     (rendered from `rule`, not written in the body)
```

**Style rules, checked in review:** the first paragraph answers the title; one idea per
paragraph; the first sentence of each section can stand alone (so it can be quoted); numbers
carry their unit and source; no adjectives standing in for evidence; first person for decisions
("I chose"); dated, and updated when changed.

### 7.3 Facts block (one source, shown on Home and About)

Fields: name; role line; based in; work arrangement; full-time experience ("3+ years"); current
employer and title; publication with DOI. Rendered as a `<dl>`. Machine-readable through the
Person data (SEO lead). The years figure follows the master-resume rule: full-time professional
engineering only.

### 7.4 Working rules (About)

Data shape: `{ n, text, evidence: [caseStudySlug or postSlug] }`, text max 20 words, imperative,
each backed by at least one link. A rule with no evidence is not published.

---

## 8. Open questions for the creative director

Each has my recommendation and the cost of being wrong.

1. **Flagship trio and launch count.** Recommend the three cover the three pillars and at
   least one is publicly verifiable: the dental front desk (Ownership), the ERP agent layer
   (Applied AI), and HireTrack (Systems, public code). The multi-tenant architecture study
   is the strongest Systems evidence but is in progress. The content lead decides after the
   eligibility test. Wrong choice costs the home page's credibility.
2. **Labels versus URLs.** Recommend "Work" over `/projects/` and "Writing" over `/journal/`.
   Alternative: "Projects" and "Journal" for parity. Low stakes.
3. **Hero `<h1>`.** Recommend the hero line as `<h1>` (§3.1). The SEO lead should confirm the
   entity signals are enough elsewhere.
4. **Title suffix.** `CLAUDE.md` says the layout appends " | Mubashir Rehman — Backend Engineer"
   to every title. That suffix contains an em dash, breaks the brief's voice rule, and uses 36
   of the 60 permitted characters. Recommend " | Mubashir Rehman" (18 characters). Needs the
   engineering and SEO leads.
5. **Photo, and phone number.** Photo: yes or no (plan §12 Q4); my lean is yes on About only,
   not on Home, to keep the hero typographic. A public phone or WhatsApp number invites spam
   and is a recruiter convenience; recommend the number lives in the résumé PDF, not the site.
6. **Contact form.** A form needs a third-party endpoint and adds a data processor. Recommend
   email only at launch; add a form only if inbound volume justifies it.
7. **Track naming and order.** Profile notes leave the ranking of "AI backend" versus
   "ERP + AI" as Mubashir's targeting decision. The chip order on Home and the footer follows
   it. Also: keep the slug `/for/erp-hrms/` (equity) with the label "ERP + AI", or add
   `/for/erp-ai/` with a redirect. Recommend keeping the slug.
8. **Work authorization and location, stated plainly on role pages.** Recruiters ask this
   first; hiding it wastes both sides' time. Recommend a factual line in Practicalities. The
   wording is Mubashir's.
9. **Default theme.** Recommend following the visitor's system setting, and dark only when there
   is no signal. Alternative: always dark first. The risk is a recruiter in a bright room on a
   dark page.
10. **Analytics.** Both tests in §4 need at least résumé, email, GitHub and "What broke" events.
    Without a privacy-friendly tool these are unmeasurable (plan §12 Q1).
11. **The personal essay and the two stale posts** (§2.3). Redirect, keep unlisted, or keep
    listed? My recommendation is in the table. Mubashir decides.
12. **Chat.** Keep, as an inline entry rather than a floating bubble, after the key is behind a
    proxy. Alternative: drop it and remove its JS entirely. Wrong choice costs either a security
    incident or a differentiator.
13. **Default résumé.** The header button points to one PDF. Recommend the Backend PDF as the
    default, with role pages switching it. Alternative: a single master résumé.
14. **JS-router view transitions.** Recommend dropping them for native cross-document
    transitions. Engineering to confirm the saving.
15. **`/services/` URL.** Recommend keeping it, with the neutral title. If Mubashir prefers
    `/problems/`, a meta-refresh redirect works at some equity cost.

---

## Appendix A: Sources and confidence

Direct page fetches were blocked in this environment, so items marked "summary" rest on search
result summaries, not on reading the full source.

| Claim used | Source | Confidence |
|---|---|---|
| Recruiters skim a résumé for about 7.4 seconds on average (6 seconds in the 2012 version); 30 recruiters, 10 weeks; they read current title and company, then previous, then dates, then education; simple layouts and white space performed better | Ladders eye-tracking study, 2018: <https://www.theladders.com/career-advice/you-only-get-6-seconds-of-fame-make-it-count> · PDF <https://www.theladders.com/static/images/basicSite/pdfs/TheLadders-EyeTracking-StudyC2.pdf> · HR Dive: <https://www.hrdive.com/news/eye-tracking-study-shows-recruiters-look-at-resumes-for-7-seconds/541582/> | Medium. Applies to résumés, not sites. Small sample. A recruiter-side critique exists (<https://spectacletalentpartners.com/is-the-6-second-resume-scan-a-myth/>) which I could not read. |
| Hidden navigation: about 20% lower discoverability, 39% slower tasks on desktop, 15% on mobile, 179 participants, 6 sites | NN/g, "Hamburger Menus and Hidden Navigation Hurt UX Metrics": <https://www.nngroup.com/articles/hamburger-menus/> (summary) | Medium to high |
| Users scan in an F-pattern; front-load the point; inverted pyramid | NN/g, "F-Shaped Pattern For Reading Web Content": <https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/> (summary) | Medium to high. The pattern varies by page type. |
| WCAG 2.2: Target Size Minimum 24 x 24 CSS px (AA); Focus Not Obscured (AA); Accessible Authentication (AA); Consistent Help; Dragging Movements | W3C, WCAG 2.2: <https://www.w3.org/TR/WCAG22/> (via search summaries) | High |
| Mobile is the majority of LinkedIn traffic (57 to 70%) | <https://salesso.com/blog/linkedin-hiring-statistics/> (vendor blog) | Low. Directional only. |
| Hiring managers favour case studies over lists, mastery over breadth, honest failure writing | <https://dev.to/brianyoung/how-to-write-developer-project-case-studies-recruiters-can-actually-understand-4oe4> · <https://hakia.com/skills/building-portfolio/> | Low. Anecdotal blogs. I did **not** use their survey percentages, which I could not trace to a primary source. Used only for the qualitative agreement with the template. |
| FAQ markup and answer-first structure raise AI citation | <https://searchatlas.com/blog/schema-for-aeo/> and similar | Low. Vendor marketing. I use only "answer-first, clear structure" because it helps human readers regardless. |
| Exemplary engineer sites (jvns.ca, simonwillison.net, overreacted.io) | Named as commonly cited in a search summary; lessons below are from my own familiarity with them, not fetched today | Medium. Lessons taken, not designs: answer-first titles, dated and linkable posts, very low chrome, RSS, series for long arcs. |
| Google narrowed FAQ rich results in 2023 | My recollection, not fetched | Low to medium. SEO lead to verify. |

Everything not tagged above is design judgement, to be tested with the two tests in §4 once a
build exists.
