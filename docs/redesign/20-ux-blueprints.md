# 20 UX blueprints: journeys, IA and page specs

Role: UX strategist / information architect. Reads: `00-brief.md`, `01-plan.md`, the route list, the
shape of `src/data/*.json`, and the master-resume triage tables (as a content inventory only).
Not consulted, by rule: current styling, tokens, components, layouts, the live site.

Revision 2 applies the creative director's three design skills: accessibility review (§6), UX copy
(§7.5) and frontend-design principles (§3.0, §3.1, §3.3, §5).

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
   and becomes "Problems I solve"; (d) the role router lives in the home hero, and there is no
   `/for/` index page.
3. **Home order:** Hero (with role router), then Selected work (3), then Latest writing (2),
   then Ask. The footer carries the exit actions. About 265 words in `main`.
4. **The hero opens with the subject's own material, not stats.** The hero line, plus a slim
   figure of the five seams the brief names (API, database, queue, model, external service)
   that goes from tangled to straight once on load. No metric tiles, counters or stat rows
   anywhere on the site (§3.1).
5. **Signature interaction: one explorable system diagram, on case studies only.** It carries
   the case study's single motion moment (the request path draws once). Phase 2 adds a "break
   it" failure toggle. Ranking in §5.3.
6. **Motion budget: one orchestrated moment per template that has one** (Home hero, case-study
   diagram). Everything else moves only in answer to a person's action. No scattered hover or
   reveal effects (§5).
7. **Numbered markers only for real sequences and citation keys.** Sentence-case labels. No
   arrows appended to link text. Cards avoided (§3.0).
8. **Case studies are capped at 850 words**, fixed order, "What broke" before "Outcome". A build
   with no honest failure and no rejected alternative does not get a page.
9. **The client path is never in the nav, the home hero, or the role pages.** It is reached from
   problem-shaped search results, a one-line note at the end of case studies and posts, the
   footer link "Problems I solve", and the Contact page (§2.5).
10. **Mobile nav is visible, not a hamburger** [E]. Two rows, in flow, not sticky. No fixed bars.
11. **Two things I need changed outside my remit:** the title suffix (it contains an em dash and
    uses 36 of the 60 title characters), and the JS-router view transitions (§5.4, §8).

---

## 1. Audience models

### 1.1 Recruiter / HR

| | |
|---|---|
| **Context** | Screening many candidates against one requisition. Arrives from a LinkedIn profile link, a link inside the résumé PDF, a job-portal field, or an email signature. Often forwards the link to a hiring manager, so the page must make sense to a second person cold. |
| **Device** | Phone first (LinkedIn's in-app browser), desktop second for ATS review. Mobile is the majority of LinkedIn traffic, 57 to 70% by one vendor blog, so directional only **[T]** |
| **Time budget** | First pass is roughly 6 to 7.4 seconds. That figure is from résumé eye-tracking (30 recruiters, 2018) [E], not from portfolio sites. Treat it as a design ceiling for the hero, not a measured site statistic. |
| **Questions, in order** | 1. What is this person (title, does it match my req)? 2. How many years, and at what level? 3. Where, and can they work remote or in my timezone? 4. Core stack (keywords from the req)? 5. Current and previous employer, dates, progression? 6. Available? 7. Where is the résumé? |
| **Deal-breakers** | Role unclear after 6 seconds. No résumé within one click. Location or remote status ambiguous. A poetic hero with no plain identity sentence. Slow load in an in-app browser. Walls of text. Overlays, chat bubbles, cookie banners. Claims that contradict the PDF. |
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
- No audience has to read copy addressed to another. Recruiters get the role router, CTOs get
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
| Work index filterable by pillar/track | **No filter at launch** | 5 case studies plus at most 8 smaller builds. A filter is interaction cost for no gain. Revisit at 10 or more case studies. |
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
|-- /for/erp-hrms/             Role page   (not in nav; label "ERP and AI", see §8 Q7)
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
| `/` | keep, rebuild | wordmark | everywhere | |
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
| action | **Résumé** | default role PDF | The site's primary-action button. On a role page it points to *that* role's PDF and its accessible name says so. |

Also in the header: the wordmark (the full name "Mubashir Rehman", linking home, so the name
is the first thing top-left at every width) and the theme toggle. No search (static site, fewer
than 30 pages). No dropdowns. No mega menus.

**Mobile pattern [E, J]:** hidden navigation cuts discoverability and slows tasks (NN/g, 179
participants: about 20% lower discoverability, 15% slower on mobile, 39% slower on desktop) [E].
With only four destinations there is nothing to hide. So:

- Header is **two rows, in flow, not sticky**. Row 1 (48px): wordmark left; theme toggle and
  Résumé button right. Row 2 (44px): the four links spread evenly, each a 44px-tall target.
- No hamburger, no drawer, no fixed bottom bar. A fixed bar costs about 56px of a 640px
  viewport, collides with the browser's own bottom toolbar, and can obscure focused elements
  (WCAG 2.2 2.4.11) [E]. Long pages end with a next-link and the footer repeats the nav, so
  there is no dead end.
- **[T]** If tests show people lose orientation on long case studies, add a sticky bottom bar in
  a later iteration, with `scroll-padding-bottom` set.

**Desktop:** a single row. Wordmark, then the four links, then (right-aligned) toggle and
Résumé. Not sticky. Case studies and long posts add a sticky in-page contents rail (§3.3).

**Footer (every page, about 55 words). It is also the page's closing exit strip.**

| Group | Content |
|---|---|
| Actions (first) | Download résumé (PDF), Email me |
| Identity | Name, "Backend engineer in Lahore", "Open to remote roles, any timezone. On-site in Lahore." |
| Site | Work, Writing, About, Contact, Problems I solve |
| Roles | Backend, AI backend, Full-stack, ERP and AI (order per §8 Q7) |
| Elsewhere | LinkedIn, GitHub, RSS |
| Legal | © year, one line on licence if wanted |

Every link in the footer is a 44px-tall row. The email address is in the same place on every
page (WCAG 3.2.6 Consistent Help) [E].

### 2.5 How the low-profile client path is reached

Never in the nav, the home hero, the role pages, or the footer identity line. Five quiet
entrances, in order of expected traffic:

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
| Home | 265 | 300 |
| Work index | 350 | 400 |
| Case study | 725 | 850 |
| About | 450 | 500 |
| Journal index (launch, up to 8 posts) | 300 | 350 |
| Journal post | 500 to 1,200 by type | 1,500 |
| Role page | 285 | 320 |
| Services | 290 | 330 |
| Contact | 80 | 90 |
| 404 | 25 | 35 |
| Header chrome | 8 | 12 |
| Footer chrome | 55 | 65 |

A build-time gate (engineering plan §8.5) should fail on any page over its cap, on em dashes,
and on the banned-word list.

---

## 3. Page blueprints

### 3.0 Conventions used below

- **Fold, phone:** 375 x 640 CSS px (a realistic worst case once browser chrome is subtracted).
  Hard rule for Home: the "Download résumé" button is fully visible by y = 560.
- **Fold, desktop:** 1440 x 800.
- **Primary CTA:** exactly one per page, visually dominant, present without JavaScript. List
  pages (Work, Writing) have no primary CTA: the list is the action.
- **Content source names:** "profile" = `profile.json`, "case study" = the new case-study
  collection (successor to `projects.json`), "post" = the journal collection, "roles" =
  `roles.json`. Nothing in this document is hand-copied into more than one file; positioning copy
  comes from one `positioning` field (Home lede, meta descriptions, JSON-LD, OG card, AskMe
  prompt), as `CLAUDE.md` already requires.
- **Layout constraint, all templates:** prose column 60 to 72 characters (under 80 always).
  Never a horizontal page scroll at 320px.

**Structure rules (information design, from the frontend-design principles). The UI lead owns
the look; these constrain the structure:**

1. **Numbered markers only for real sequences or citation keys.** Allowed: the timeline, the
   diagram's path numbers and their legend, the two-step "how it starts", numbered rules on About
   (a rule number is a citation key: posts and case studies say "Rule 4" and link to it), and
   incident timestamps. Not allowed: numbering on Home sections, case-study section headings,
   work rows or footer groups.
2. **Sentence-case labels.** No all-caps eyebrows, no small label above a heading that only
   restates it. A label is allowed where it is the key of a real key/value pair (Role, Period,
   Status, Outcome).
3. **No stat tiles, big-number-plus-caption, counters or "years" badges.** The numbers that
   exist ("3+ years") live in a sentence. `profile.json` currently holds `metrics`; do not render
   them as tiles.
4. **No arrows appended to link or button text.** A link is signalled by underline and position.
   In the wireframes an underscore pair marks a link: `_Email me_`.
5. **Rows, not cards.** Content lists are rows separated first by space; a rule appears only
   where it marks a real boundary. No identical rounded boxes.
6. **Meta lines are stacked or written as short sentences,** not strings joined with middle dots.
7. **One motion moment, not scattered effects** (§5).

**Wireframe notation:** `[ ]` button, `( )` toggle, `_ _` link, `v` disclosure, `{ }` content to
be filled from a verified source. Wireframes carry no invented facts.

---

### 3.1 Home

| | |
|---|---|
| **Goal** | In one screen, identify him to a recruiter and show the work to a CTO. |
| **Primary audience** | Recruiter, then CTO. |
| **Primary CTA** | **Download résumé (PDF)** |
| **Secondary** | Email me; the four role links; "All work"; "All writing"; "Ask about my work". |

**Hero concept.** Open with the most characteristic thing in his world, not a stats treatment.
His world is difficult systems and their seams. The hero is the brief's own line as a large
`<h1>`, followed by a slim figure of five seams named in the brief (API, database, queue, model,
external service). On load, once, the connections between them start as a tangle and resolve into
one straight line, timed to the line's last sentence ("Then I like making them boring").
Constraints:

- Plays once, at most 2 seconds, no loop, never delays text (text is visible at first paint),
  does not replay on back navigation. WCAG 2.2.2 applies only to motion over 5 seconds [E].
- The resting state (the straight line) is the design. It is what shows under reduced motion,
  without CSS animation, in print and in the social card.
- Decorative: `aria-hidden`, carries no information the text lacks. Curves and straight
  lines only. No glow, no gradient, no circuit-board traces, no brains.
- CSS and SVG only, no JavaScript, under 2 KB.
- It sits between the `<h1>` and the lede, so the one moment of motion pulls the eye *down* to
  the lede, where the identity sits. That is a functional use of motion.

**Rejected hero treatments:** a stats row ("3+ years, 60+ endpoints, 8+ systems"), skill bars,
logo strip, a portrait as the hero, a terminal-typing effect, an AI-flavoured background.

**Section order**

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 0 | Header | Wayfinding. Name top-left. Résumé one click away. | nav config; profile résumé default | 8 |
| 1 | **Hero** | `<h1>` hero line; the seam figure; a two-sentence lede that carries role, place, years, remote, current employer and positioning; one plain sentence of core stack; the two actions; the role router line | profile: role, `yearsFullTime`, location, currentRole, availability; `positioning`; hero line | 68 |
| 2 | **Selected work** (`<h2>`) | Prove it. Three builds, one per pillar (Systems, Applied AI, Ownership), as rows. Row: function-based title (the link), one-line summary (max 20 words), role on it and year as one plain line. No tags, no numbers. | case studies with `flagship: true` | 120 |
| 3 | **Latest writing** (`<h2>`) | Second proof and freshness. Two posts: title, lede (max 25 words), date. Renders only when at least 2 posts have a lede. | 2 newest posts | 60 |
| 4 | **Ask** | Optional Q&A entry: "Questions about my work?" and a button "Ask about my work". Inline, never a floating bubble. | static | 15 |
| 5 | Footer | Also the exit strip: résumé, email, elsewhere | | (55) |

Hero copy structure, in reading order:

1. Header wordmark (the name).
2. `<h1>`: the hero line.
3. The seam figure (decorative).
4. Lede paragraph, two sentences. Sentence one is identity, in a heavier weight (weight, not
   colour or caps): "Backend engineer in Lahore with 3+ years in production, open to remote
   work in any timezone." Sentence two: "Now at TransData, turning messy multi-system workflows
   into reliable software, with AI where it earns its place."
5. One plain sentence of stack: "Python, Django, FastAPI, PostgreSQL, Docker."
6. `[ Download résumé (PDF) ]` primary, `_Email me_` secondary.
7. Role router, a sentence: "Hiring for a specific role? _Backend_, _AI backend_, _Full-stack_,
   _ERP and AI_." Each link has a 44px target.

**Above the fold**

- **375px phone:** header (92px), `<h1>` (about 4 lines), the figure (about 40px), the lede
  (about 5 lines), the stack sentence, and the résumé button, whose bottom edge sits near
  y = 525. "Email me" follows. The role router and the first work row start below the fold.
- **1440px desktop:** two columns. Left: `<h1>`, figure, lede, stack, actions, role router.
  Right: the three Selected-work rows. A recruiter and a CTO each find their content without
  scrolling. DOM order stays Hero, then Selected work; only the grid places them side by side.
  Requirement: all three titles and one-liners visible at 1440 x 800.

**Signature interaction:** none. The one motion moment is the hero figure. The chat entry is a
user-initiated utility, not a signature element.

**Wireframe, 375px**

```
 375px wide                                  fold = 640px
+--------------------------------------+
| Mubashir Rehman       (dark) [Résumé]|  row 1, 48px
| Work    Writing    About    Contact   |  row 2, 44px
+--------------------------------------+
|                                      |
| I like difficult systems.            |
| I like figuring out why they         |
| break. Then I like making            |
| them boring.                         |  <h1>, about 26px
|                                      |
|  (api)~~(database)~~(queue)          |  seam figure, 40px,
|      ~~(model)~~(external service)   |  tangled, then straight
|                                      |
| Backend engineer in Lahore with 3+   |  first sentence: heavier
| years in production, open to remote  |  weight
| work in any timezone. Now at         |
| TransData, turning messy multi-      |
| system workflows into reliable       |
| software, with AI where it earns     |
| its place.                           |
|                                      |
| Python, Django, FastAPI, PostgreSQL, |
| Docker.                              |
|                                      |
| [ Download résumé (PDF)            ] |  primary, full width, 48px (bottom edge ~525)
|  _Email me_                          |  44px target
- - - - - - - - - FOLD ~640 - - - - - - -
|  Hiring for a specific role?         |
|  _Backend_  _AI backend_             |
|  _Full-stack_  _ERP and AI_          |
|                                      |
| Selected work                        |
|                                      |
| _{Function-based title}_             |
| {One-line summary, max 20 words}     |
| {Role on it}, {year}                 |
|                                      |
| _{Second title}_                     |
| ...                                  |
| _{Third title}_                      |
| ...                                  |
| _All work_                           |
|                                      |
| Latest writing                       |
| _{Post title}_                       |
| {Lede, max 25 words}                 |
| {date}                               |
| ... second post ...                  |
| _All writing_                        |
|                                      |
| Questions about my work?             |
| [ Ask about my work ]                |
+--------------------------------------+
| Footer: [ Download résumé (PDF) ]    |
| _Email me_, identity, site, roles,   |
| elsewhere                            |
+--------------------------------------+
```

**Wireframe, 1440px**

```
 1440px wide                                                                          fold = 800px
+------------------------------------------------------------------------------------------------+
| Mubashir Rehman   Work   Writing   About   Contact                    (dark)   [ Résumé ]      |
+------------------------------------------------------------------------------------------------+
|                                                                                                |
|  I like difficult systems.                          Selected work                              |
|  I like figuring out why they break.                                                           |
|  Then I like making them boring.                    _{Function-based title}_                   |
|                                                     {One-line summary, max 20 words}           |
|  (api)~~(database)~~(queue)~~(model)~~(external)    {Role on it}, {year}                       |
|                                                                                                |
|  Backend engineer in Lahore with 3+ years in        _{Second title}_                           |
|  production, open to remote work in any timezone.   {One-line summary}                         |
|  Now at TransData, turning messy multi-system       {Role on it}, {year}                       |
|  workflows into reliable software, with AI where                                               |
|  it earns its place.                                _{Third title}_                            |
|                                                     {One-line summary}                         |
|  Python, Django, FastAPI, PostgreSQL, Docker.       {Role on it}, {year}                       |
|                                                                                                |
|  [ Download résumé (PDF) ]   _Email me_             _All work_                                 |
|                                                                                                |
|  Hiring for a specific role? _Backend_,                                                        |
|  _AI backend_, _Full-stack_, _ERP and AI_.                                                     |
|                                                                                                |
- - - - - - - - - - - - - - - - - - - - - - - -  FOLD 800  - - - - - - - - - - - - - - - - - - - -
|  Latest writing                                                                                |
|  _{Post title}_                              _{Post title}_                                    |
|  {Lede, max 25 words}                        {Lede, max 25 words}                              |
|  {date}                                      {date}                                            |
|  _All writing_                                                                                 |
|                                                                                                |
|  Questions about my work?   [ Ask about my work ]                                              |
+------------------------------------------------------------------------------------------------+
| Footer: résumé, email, identity, site, roles, elsewhere                                        |
+------------------------------------------------------------------------------------------------+
```

Flag for the SEO lead: the `<h1>` is the hero line, so the entity and keywords live in the
`<title>`, the wordmark, the lede and the Person data. If that proves too weak, the fallback is
an `<h1>` of "Mubashir Rehman, backend engineer" with the hero line as a large paragraph. I
recommend the first, because the hero line is the brief's centrepiece **[J]**.

---

### 3.2 Work index (`/projects/`)

| | |
|---|---|
| **Goal** | Let a CTO pick one case study in under 10 seconds; show recruiters the breadth. |
| **Primary audience** | CTO. |
| **Primary CTA** | None. The list is the action. The intro says to start with the first. |
| **Secondary** | Download résumé and Email me (footer), Résumé (header). |

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 1 | Intro (`<h1>` "Work") | One line: "Five case studies, then smaller builds. Start with the first. Each covers the problem, the system, the decisions and what broke." | static | 28 |
| 2 | **Case studies** (5 rows) | Row: function-based title as the link, one-line summary (max 20 words), then one plain line "{Role on it}, {year}". Ordered by recommended reading order, not date. No tags, no numbers (order is by design but is not a sequence the reader must follow). | case study frontmatter | 180 |
| 3 | **Smaller builds** (max 8 lines) | Breadth without page cost. One line each: name (function-based; QT20 and HireTrack may be named), max 12 words, year, and repo or demo links where public. Includes one line for this site, one for the published research, one for academic systems work. | `smallerBuilds` list | 120 |
| 4 | Note | "Work under NDA is described by function." A link to About. | static | 22 |

Not on the site: games and coursework that do not support the backend and AI positioning. They
stay on the résumé.

- **375px above the fold:** header, `<h1>`, intro, first row in full, second row's title.
- **1440px above the fold:** `<h1>`, intro, rows 1 to 4. Row layout on desktop is a table-like
  grid: title and summary, role, year.
- **Signature:** none. **Micro:** underline and colour change on hover and focus, instant.

---

### 3.3 Case study (`/projects/[slug]/`)

| | |
|---|---|
| **Goal** | Prove judgement in about 2 minutes of skimming, and reward a full 4-minute read. |
| **Primary audience** | CTO / hiring manager; recruiters read only the header. |
| **Primary CTA** | **Email me about this build** (mailto, subject "About: {title}"). |
| **Secondary** | Next case study; related post; View the code or View the demo (only where public); Résumé in header. |

**Opening concept: the system is the hero.** The most characteristic thing in a case study is
the system and its seams, not a banner image. At 1200px and wider, Problem (narrow column) and
System (wide column, the diagram) sit side by side directly under the header, so the diagram is
visible without scrolling. On phone the diagram follows Problem. The diagram's one-time request
trace is the page's single motion moment (§5).

Order is fixed (plan §6, with one change: "What broke" precedes "Outcome" so the honest part is
not buried after the victory lap). Section headings are sentence case with no numbers. Budgets
per section are in §7.1.

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 0 | Breadcrumb | Orientation: "Work / {short title}" | route | 0 |
| 1 | **Header** | `<h1>` function-based title. One-line summary (max 20 words, the recruiter line). A definition list: Role, Period, Status, Outcome (one verified fact). View the code or demo where public. | frontmatter | 50 |
| 2 | **Problem** | Whose problem, why messy, constraints. No identifying detail. | body | 90 |
| 3 | **System** | The signature diagram, plus a numbered legend of 4 to 6 components. The numbers are the request path, a real sequence. The legend is the no-JS text equivalent. | `diagram` spec | 120 |
| 4 | **Decisions** | Three decision records. Each heading is the decision's own title, with Chose, Rejected, Why, Cost as a definition list. | `decisions[]` | 240 |
| 5 | **What broke** | One or two real incidents: symptom, root cause, fix, the rule. First person for what I got wrong. Links to the post if one exists. | `broke[]` | 130 |
| 6 | **Outcome** | Verified or claimed facts only, each with an evidence reference in the data. Where no number exists, say what is known ("live since", "adopted by the team"). | `outcome[]` | 50 |
| 7 | **The rule I took from this** | One line: "Rule 4: {text}", linking to the rule in About. | `rule` | 20 |
| 8 | **Stack** | Tags only, max 12, no prose. | `stack[]` | 0 |
| 9 | **Next** | Page-end note ("Working on something similar? Email me."), next case study, related post. | related | 25 |

- **375px above the fold:** breadcrumb, `<h1>` (max 3 lines), summary (max 3 lines), the four
  header facts as a definition list, and a collapsed "On this page" disclosure. Problem starts
  at the fold. A recruiter has role, period, status and outcome without scrolling.
- **1440px above the fold:** left rail "On this page" (Problem, System, Decisions, What broke,
  Outcome), then `<h1>`, summary, facts, and directly under them the Problem and System band.
  The diagram is in view and plays its trace once on load.
- **Signature:** the explorable system diagram (§5).
- **Rail behaviour:** the "On this page" rail is sticky on desktop with the current section
  marked (a JS-enhanced state, instant, no animation; plain anchor links without JS). On phone
  it is a native `<details>`.

**Wireframe, 375px**

```
 375px wide                                  fold = 640px
+--------------------------------------+
| Mubashir Rehman       (dark) [Résumé]|
| Work    Writing    About    Contact   |
+--------------------------------------+
| _Work_ / {short title}               |  breadcrumb
|                                      |
| {Function-based title, for example   |
|  "An AI front desk for dental        |
|  clinics"}                           |  <h1>
|                                      |
| {Summary, max 20 words}              |
|                                      |
| Role       {Sole backend engineer}   |  definition list
| Period     {2026}                    |
| Status     {Live in production}      |
| Outcome    {one verified fact}       |
|                                      |
| [ On this page                    v ] |  <details>, 44px
- - - - - - - - - FOLD ~640 - - - - - - -
| Problem                              |
| {about 90 words}                     |
|                                      |
| System                               |
| +----------------------------------+ |
| | (1 Client)                       | |
| |     |                            | |  vertical-first;
| | (2 API)---(3 Queue)              | |  components are buttons;
| |     |          |                 | |  the path 1 to n draws
| | (5 Store)  (4 Worker)            | |  once, then rests
| +----------------------------------+ |
| Selected: {component name}           |
| {max 40 words: what it does, why,    |
|  how it fails}                       |
| 1 Client  2 API  3 Queue  4 Worker   |  legend (no-JS text)
|                                      |
| Decisions                            |
| {Decision title}                     |
|   Chose / Rejected / Why / Cost      |
| ...                                  |
| What broke                           |
| Outcome                              |
| Rule 4: {one line}                   |
| Stack: {tag} {tag} {tag}             |
| Working on something similar?        |
| _Email me_. Next: _{case study}_     |
+--------------------------------------+
```

**Wireframe, 1440px**

```
 1440px wide                                                                          fold = 800px
+------------------------------------------------------------------------------------------------+
| Mubashir Rehman   Work   Writing   About   Contact                    (dark)   [ Résumé ]      |
+------------------------------------------------------------------------------------------------+
|  _Work_ / {short title}                                                                        |
|                                                                                                |
|  On this page       {Function-based title}                                                     |
|  > Problem          {Summary, max 20 words}                                                    |
|    System           Role {..}    Period {..}    Status {..}    Outcome {one verified fact}     |
|    Decisions                                                                                   |
|    What broke       Problem                    |  System   (select a component)                |
|    Outcome          {about 90 words}           |  +-----------------------------------------+  |
|                                                |  | (1 Client)-->(2 API)-->(3 Queue)-->(4 W) |  |
|  (sticky rail)                                 |  |                |                  |      |  |
|                                                |  |            (5 Store)<------(6 Model)     |  |
|                                                |  +-----------------------------------------+  |
|                                                |  Selected: {component}                        |
|                                                |  {max 40 words: what, why, how it fails}      |
- - - - - - - - - - - - - - - - - - - - - - - -  FOLD 800  - - - - - - - - - - - - - - - - - - - -
|                     Decisions   (single 68ch column)                                           |
|                     What broke                                                                 |
|                     Outcome                                                                    |
|                     Rule 4, Stack, Next                                                        |
+------------------------------------------------------------------------------------------------+
```

---

### 3.4 About (`/about/`)

| | |
|---|---|
| **Goal** | Answer "what is he like to work with" with evidence, and let a recruiter verify the timeline. |
| **Primary audience** | CTO / hiring manager, then recruiter. |
| **Primary CTA** | **Email me** |
| **Secondary** | Download résumé (PDF), LinkedIn, GitHub, the Springer DOI. |

**"How I work" is not its own page** (§2.1). It is the working-rules section here.

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 1 | `<h1>` and bio | Answer-first: who, what, where, how long. Optional portrait (176px, `astro:assets`, meaningful alt) if Mubashir says yes. | profile bio | 90 |
| 1b | **Facts block** (definition list) | Role, based in, works, years (full-time), current employer, published. Same fields as the Home lede. | profile | 30 |
| 2 | **Working rules** | 5 to 7 numbered rules, each max 20 words, each with one evidence link (a case study or a post). Numbers are citation keys with stable anchors `#rule-1`. Shape only, copy is the content lead's: "Rule N: {imperative sentence, max 15 words}. Evidence: {link}." | `rules[]` in profile | 140 |
| 3 | **Timeline** | 4 rows, reverse chronological: TransData (2025 to now), VeritusLabs (2023 to 2025, engineer then team lead), ITU teaching assistant (2022 to 2025, part-time, alongside), GameBole (2022). Each: title, dates, max 25 words of scope. Concurrent work is labelled so it never contradicts the "3+ years full-time" rule. A real sequence, so dated rows are right. | profile experience | 110 |
| 4 | **Teaching and research** | Five semesters as an OS teaching assistant; the Springer paper with DOI. | profile | 50 |
| 5 | **Elsewhere** | Contact routes. | profile | 25 |

- **375px above the fold:** `<h1>`, the first lines of the bio (or portrait and bio, if a photo
  is used).
- **1440px above the fold:** `<h1>` and bio on the left (68ch), Facts block on the right, first
  rule visible below.
- **Signature:** none. Rules' evidence links are plain links, no disclosure.

---

### 3.5 Journal index (`/journal/`)

| | |
|---|---|
| **Goal** | Show that he writes and thinks, and make one post easy to pick. |
| **Primary audience** | CTO; answer engines (a clean, dated list). |
| **Primary CTA** | None. The list is the action, newest first. |
| **Secondary** | RSS; Email me (footer). |

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 1 | Intro (`<h1>` "Writing") | "Incident write-ups and lab notes. The answer comes first." | static | 20 |
| 2 | **All posts**, newest first | Row: the type as plain sentence-case text (Incident, Lab note, Build log), title as the link, lede (max 25 words), date, reading time on separate short lines. A series appears as a group with "Part 2 of 4". | posts | 35 per post |
| 3 | Feed line | An RSS link and one line on cadence if it is real. | static | 10 |

A pinned "Start here" post is added only at 8 or more posts. No filters and no pagination until
15 or more posts; then type filters as plain links.
- **375px above the fold:** `<h1>`, intro, the newest post in full.
- **1440px above the fold:** `<h1>`, intro, first three rows.
- **Signature:** none.

---

### 3.6 Journal post (`/journal/[slug]/`)

| | |
|---|---|
| **Goal** | Be quotable and prove thinking; convert a reader into a look at the underlying case study. |
| **Primary audience** | CTO, founder arriving from search, answer engines. |
| **Primary CTA** | **Read the case study: {title}** (or the next post when none applies). |
| **Secondary** | Email me; RSS; Résumé (header). |

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 0 | Breadcrumb | "Writing / {short title}" | route | 0 |
| 1 | **Header** | `<h1>`; meta as stacked lines: type, published, updated, reading time. | frontmatter | 15 |
| 2 | **Lede (the answer)** | The answer in 1 to 2 sentences, first, set larger than body. No label. This is what an answer engine quotes. | `shortAnswer` | 40 |
| 3 | **In brief** (optional) | 3 bullets, only for posts over 900 words. For incidents: symptom, cause, fix. | `tldr[]` | 45 |
| 4 | **Context** | Why this came up. Only what the reader needs. | body | 100 |
| 5 | **Body** | 2 to 5 H2 sections, each 60 to 200 words; headings are claims or real questions. Code blocks max 25 lines. | body | 300 to 800 |
| 6 | **What I got wrong** | Mandatory for incident posts, encouraged elsewhere. | body | 120 |
| 7 | **The rule I took from this** | One line: "Rule 7: {text}", linking to the About rule if adopted. | `rule` | 25 |
| 8 | **Questions** (optional) | 2 to 4 real questions, answers max 50 words. | `faq[]` | 150 |
| 9 | **Related** | One case study, one post. | `related` | 20 |
| 10 | Page-end | "Working on something similar? Email me." and RSS. | static | 10 |

- **375px above the fold:** breadcrumb, `<h1>` (max 3 lines), the meta lines, the whole lede (max
  5 lines). Requirement: the answer is visible without scrolling.
- **1440px above the fold:** `<h1>` and the lede in the 66ch column; the meta (type, dates,
  reading time, tags) stacked in the left margin as notebook marginalia. Sidenotes (`<aside>`)
  sit in the right margin at 1200px and above; on smaller widths they inline as a callout.
- **Signature:** none by default. Incident posts may opt into the incident-timeline component
  (§5.3, idea 4), whose numbered steps are a real sequence.

**Wireframe, 375px**

```
 375px wide                                  fold = 640px
+--------------------------------------+
| Mubashir Rehman       (dark) [Résumé]|
| Work    Writing    About    Contact   |
+--------------------------------------+
| _Writing_ / {short title}            |
|                                      |
| {Post title: a claim or a question,  |
|  max 3 lines}                        |  <h1>
|                                      |
| Incident report                      |
| Published {date}                     |
| 6 minute read                        |
|                                      |
| {1 to 2 sentences that answer the    |
|  title. Max 40 words. Set larger     |
|  than body text.}                    |  lede, no label
|                                      |
- - - - - - - - - FOLD ~640 - - - - - - -
| In brief   (only if > 900 words)     |
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
| Rule 7: {one line, max 25 words}     |
|                                      |
| Related: _{case study}_, _{post}_    |
| Working on something similar?        |
| _Email me_.                          |
+--------------------------------------+
```

**Wireframe, 1440px**

```
 1440px wide                                                                          fold = 800px
+------------------------------------------------------------------------------------------------+
| Mubashir Rehman   Work   Writing   About   Contact                    (dark)   [ Résumé ]      |
+------------------------------------------------------------------------------------------------+
|                                                                                                |
|  _Writing_ / {short title}                                                                     |
|                                                                                                |
|  Incident report      {Post title: a claim or a question}                                      |
|  Published {date}                                                                              |
|  Updated {date}       {1 to 2 sentences that answer the title. Max 40 words. Set larger.}      |
|  6 minute read                                                                                 |
|  {tags}               In brief   (only > 900 words)                                            |
|  (marginalia)         - {symptom}   - {cause}   - {fix}                                        |
|                                                                                                |
|                       Context                                                    | sidenote    |
- - - - - - - - - - - - - - - - - - - - - - - -  FOLD 800  - - - - - - - - - - - - - - - - - - - -
|                       {H2}                                                                     |
|                       {body, 66ch}                                               | sidenote    |
|                       What I got wrong                                                         |
|                       Rule 7: {one line}                                                       |
|                       Related, Email me, RSS                                                   |
+------------------------------------------------------------------------------------------------+
```

---

### 3.7 Role landing page (`/for/[role]/`)

| | |
|---|---|
| **Goal** | Convert a recruiter holding one requisition: confirm fit in 30 seconds and hand over the right résumé. Also legible to the hiring manager it gets forwarded to. |
| **Primary audience** | Recruiter (arrived from an application, LinkedIn, or the résumé PDF). |
| **Primary CTA** | **Download résumé for {role} (PDF)** |
| **Secondary** | Email me; other roles (plain links); the case studies in the evidence list. |

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 1 | **`<h1>` and fit line** | Role label as `<h1>`; fit statement (max 30 words): title, years, core stack, ownership scope. | roles `headline`, `fit` | 35 |
| 2 | **Evidence** | Three items, ordered for this role, each max 30 words, each linking to a case study. | roles `featured` + case studies | 90 |
| 3 | **Stack for this role** | Tags only, max 12, matching what a req is likely to name. | roles `skills` | 0 |
| 4 | **Practicalities** (definition list) | Based in, remote (any timezone), on-site (Lahore), current employer, work authorization statement. See §8 Q8. | profile | 40 |
| 5 | **Questions** | 3 or 4 recruiter questions: remote? primary stack? years? which roles suit? Visible, answer max 30 words each. | roles `faqs` | 120 |
| 6 | Other roles | Three plain links. | roles | 0 |

- **375px above the fold:** `<h1>`, fit line, the résumé button (full width), start of Practicalities.
- **1440px above the fold:** left column: `<h1>`, fit line, résumé button, Email me; right column:
  Practicalities and the first evidence item.
- **Signature:** none. The header Résumé button on this page points to this role's PDF.
- Not linked from the primary nav. Linked from the hero router, the footer, the résumé PDFs
  and LinkedIn "Featured".
- Risk: four near-duplicate pages. Unique evidence ordering and per-role answers keep them
  distinct; the SEO lead decides indexing **[T]**.

---

### 3.8 Services, reframed as "Problems I solve" (`/services/`)

| | |
|---|---|
| **Goal** | Let a founder recognise their problem in plain words and send one email, on a page that reads as a candid statement of what he does well. |
| **Primary audience** | Founder / client. Must be harmless to a recruiter. |
| **Primary CTA** | **Describe the problem** (mailto, subject "A problem worth a look") |
| **Secondary** | Two linked case studies as proof. |

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 1 | `<h1>` "Problems I solve" and lede | Max 25 words: "Workflows that span systems that do not talk to each other. I make them reliable, and add AI where it helps." | static | 30 |
| 2 | **Five problems**, each an `<h2>` in the reader's own words | Symptom (max 15 words as the heading), what I build (max 20 words), one link to a case study. Example symptoms: people re-key data between tools; we want AI but our data lives in an ERP; the AI demo works and production does not; the system runs and nobody trusts it; a migration nobody wants to touch. | static + case study links | 200 |
| 3 | **How it starts** | Two numbered steps (a real sequence): send the problem; get back what I see and what I would check first. No SLA, no price. | static | 40 |
| 4 | Close | The email action. The one place besides Contact where "open to select engagements" appears. | profile | 20 |

- **375px above the fold:** `<h1>`, lede, first problem heading.
- **1440px above the fold:** `<h1>`, lede, first two problems.
- **Banned on this page:** pricing, rates, packages, testimonials, logo walls, booking or
  calendar widgets, urgency language, and anything else the brief's client-path ban covers.
- **Signature:** none. Not in nav. Linked from footer, Contact and page-end notes only.

---

### 3.9 Contact (`/contact/`)

| | |
|---|---|
| **Goal** | Make each audience's exit action a single obvious step. |
| **Primary audience** | All. |
| **Primary CTA** | **Email me**: the address shown as the link text. |
| **Secondary** | LinkedIn, GitHub, Download résumé (PDF); optional short form (§8 Q6). |

| # | Section | Purpose | Source | Words |
|---|---|---|---|---|
| 1 | `<h1>` "Contact" and one line | "Email is fastest. A role or a problem, in two lines, is enough." | static | 20 |
| 2 | **Email** | Address as visible link text, and a "Copy email" button (JS-enhanced; the link works without it). | profile | 5 |
| 3 | **Elsewhere** | LinkedIn, GitHub, résumé per role. Optional phone or WhatsApp per §8 Q5. | profile | 15 |
| 4 | **Where and when** | "Lahore, PKT (UTC+5). Open to remote roles, any timezone. On-site in Lahore. Open to select engagements." | profile | 20 |
| 5 | Problem note | "Have a problem rather than a role? Read how I approach it." links to `/services/`. | static | 12 |
| 6 | Ask | Chat entry: "Quick question about my work?" and the button "Ask about my work". | static | 8 |

- **375px above the fold:** all of it. **1440px:** all of it, in a single column of about 60ch,
  left-aligned, with generous empty space (*ma*).
- **Signature:** none. **Micro:** the Copy button's label changes to "Email copied", announced
  politely.
- If a form is used: three fields (name, email, message), visible labels, `autocomplete`
  attributes, native POST that works without JS, spam handled by a honeypot and endpoint
  filtering, never a CAPTCHA.

---

### 3.10 404

| | |
|---|---|
| **Goal** | Recover the visitor in one click. |
| **Primary CTA** | **Go to the home page** |
| **Secondary** | Work, Writing, Contact, Download résumé (plain links). |

Content, about 25 words: `<h1>` "Nothing here."; one line that says what happened, why and what
to do ("That address does not exist, or the page moved. Try one of these."); the five links.
`noindex`. No JavaScript, no search, no chat. Everything fits in the phone fold and the desktop
fold. Absolute asset paths so it renders at any depth (GitHub Pages serves one `404.html` for
every unknown path). Signature: none. No jokes.

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
| 0 to 1 | Top-left: the wordmark "Mubashir Rehman" and the Résumé button top-right | First stop is top-left; the name is there at every width [E]. |
| 1 to 3 | The hero line as the largest thing on screen, then the seam figure tangling and straightening once | Establishes voice. The motion pulls the eye down, past the line, to the lede. |
| 3 to 5 | The lede: first sentence in heavier weight carries role, city, years, remote. Second sentence: current employer, positioning. Then the stack sentence | Current employer and keywords are the recruiter's match check [E]. |
| 5 to 6 | The full-width "Download résumé (PDF)" button, bottom edge near y = 525 | The exit action, inside the 560 rule. |

**Desktop (1440), what the eye does:** F-pattern [E]. Top-left name; down the left edge across
the hero line and the lede, where the heavier first sentence stops the scan; then a lateral sweep
to the right column, where the three work titles form a second left-aligned scan line. The résumé
button is in the header (top right) and in the hero (left). After 6 seconds: role, years, place,
current employer, three builds by title.

**Known risk [T]:** a poetic hero first can read as "writer" to a 6-second skim. If two or more
testers misread the role, take option B: move the lede's first sentence above the `<h1>` (same
weight, no label), or use the fallback `<h1>` in §3.1.

### 4.2 The 2-minute CTO test

**Pass definition.** After 2 minutes the CTO can state (a) what was built, (b) what his part
was, (c) one trade-off he made, (d) one thing that broke, and wants to talk. Proxy signals once
analytics exists (§8 Q10): scroll to "What broke", diagram interaction, GitHub or email click.

| Time | Page | What the eye does |
|---|---|---|
| 0:00 to 0:20 | Home | Hero line, lede, then the three work rows on the right (desktop) or below (phone). Picks the one that matches their own domain. |
| 0:20 to 0:35 | Case-study header | Reads summary and the four facts. "Role" answers the ownership question. The left rail shows the page's shape at a glance. |
| 0:35 to 1:05 | Problem and System | Reads about 90 words while the diagram draws its path once, then selects two components; each reveals what it does, why, and how it fails. |
| 1:05 to 1:40 | Decisions and What broke | The rail label "What broke" is literal on purpose: many CTOs jump to failures first. Looks for a rejected alternative and a real root cause. |
| 1:40 to 2:00 | Outcome, Rule, Stack | Checks that claims are modest and sourced. Reads the rule line. Then opens GitHub or a post, or emails. |

The template is built so that this order is also the *scan* order, and skipping is safe: every
section stands alone, and the header carries the recruiter line.

---

## 5. Interaction budget

### 5.1 Principles

- **One orchestrated moment per template that has one,** not scattered effects: the Home hero
  figure, and the case-study diagram trace. A single deliberate sequence lands better than
  entrance animations on every section. Each is single-shot, at most 2 seconds, never delays
  text, and has a static resting state that is the real design.
- **Motion that answers a person's action is welcome:** expanding a disclosure, selecting a
  diagram component, copying, switching theme. It shows what changed and stays short.
- At most **one signature interactive element per page**, only where it explains the work.
- **Ten KB or less of eager JavaScript** on a content page (plan budget is 50 KB).
- The interactive layer enhances content that is already complete.
- Nothing loops. Nothing auto-plays media. This refines the plan's "nothing auto-plays": I
  read it as no media and no long-running or looping motion (§8 Q16).

### 5.2 Per page

| Page | Non-user-triggered motion | Signature (interactive) | Responds to an action |
|---|---|---|---|
| Home | Hero seam figure, once | none | hover and focus states (instant); chat entry |
| Work index | none | none | hover and focus states |
| Case study | Diagram request trace, once, when the diagram is first in view | **Explorable system diagram** | select a component; expand a decision; rail current-section state |
| About | none | none | none |
| Journal index | none | none | hover and focus states |
| Journal post | none | none (opt-in incident timeline) | Copy code; sidenote toggle on phone |
| Role page | none | none | header Résumé target switches by role |
| Services | none | none | none |
| Contact | none | none | Copy email |
| 404 | none | none | none |

**Allowed everywhere:** hover and focus changes of colour or underline (instant, no
transition on rows and cards); a visible focus ring; a theme change of 150ms or less; native
`<details>`; Copy buttons with a polite live-region confirmation. Native cross-document view
transitions (a CSS-only crossfade of 150ms or less) are an allowed enhancement.

**No reveal-on-scroll.** No text is ever hidden pending an animation.

### 5.3 Signature ideas, ranked by value against cost

Value: how well it explains the work to a CTO (1 to 5). Cost: design, build and content effort
(1 to 5).

| Rank | Idea | Value | Cost | What it explains | No-JS fallback |
|---|---|---|---|---|---|
| 1 | **Explorable system diagram.** Components are focusable buttons; selecting one opens a panel: what it does, why it is shaped that way, how it fails. The request path draws once on first view. Static SVG plus numbered legend generated from the same data so they cannot drift. | 5 | 3 | Architecture and boundaries, the seams the brief cares about | The SVG and the legend list are the content. Same words. |
| 2 | **Decision records as disclosures.** Chose, rejected, why, cost accepted. Native `<details>`. Not a "signature", but the best ratio, so use it on every case study. | 4 | 1 | Judgement and trade-offs | Open by default without JS; native `<details>` needs none. |
| 3 | **"Break it" toggle** layered on idea 1. Normal state versus one named failure; shows which components fail and which safeguard catches it. | 5 | 4 | Failure modes and incident handling: the brand's "why they break" | A second static diagram plus a paragraph in "What broke". Ship on the first flagship only, then judge. |
| 4 | **Incident timeline stepper** for incident posts. Timestamped log; each step highlights part of an inline diagram. | 3 | 3 | Debugging method | A plain ordered list of `<time>` entries. |
| 5 | **Ask, with sources.** The existing chat, with each answer citing the page or section it came from. A utility, not a signature. | 3 | 2 (given it exists) | Quick routing for a busy reader | A `<noscript>` line pointing to email. Prerequisite: key behind a proxy (plan §6). |

Rejected: a live "request trace" simulation with numbers. It needs invented latencies, which
breaks the no-invented-metrics rule, and costs the most. (The diagram's own path draw in idea 1
shows order only, no figures.)

**Recommendation:** ship idea 1 on all case studies with one shared component fed by a diagram
spec in the frontmatter (nodes, edges, per-node text). Use idea 2 everywhere. Add idea 3 to the
first flagship in phase 2. Keep idea 5 as a utility once the proxy decision is made.

### 5.4 Banned

Autoplay of media (video, carousels, marquees, typewriter or rotating text); looping motion of
any kind; parallax and scroll-jacking; cursor followers and custom cursors; 3D, WebGL, particle
backgrounds; splash screens and preloaders; modals on load; cookie banners (not needed if
analytics is cookieless); floating chat bubbles or any fixed overlay; hover-only content;
infinite scroll; sound; confetti; skeleton shimmer; **animated number counters and stat
tiles**; **fade-and-slide entrances on sections**; **hover lift or transition effects on rows
and cards**; carousels or tabs for essential content; hamburger menus; bouncing "scroll down"
arrows; exit-intent anything. The JS-based router view transitions used today are also out
(extra JS, focus and announcement handling, interference with the chat and analytics) **[J]**.
Engineering to confirm.

### 5.5 No-JS behaviour, per feature

| Feature | Without JavaScript |
|---|---|
| Navigation, all CTAs, résumé links | Plain links. Fully working. |
| Hero seam figure | CSS only. Works without JS. |
| Theme | Follows `prefers-color-scheme`. The toggle is hidden until JS runs. |
| System diagram | Static SVG at rest, plus a legend list with identical text. |
| Rail "On this page" | Anchor links; no current-section state. |
| Copy email / Copy code | Button hidden; the mailto link and the code stay selectable. |
| Chat | A `<noscript>` line: "The chat needs JavaScript. Email me instead." |
| Form (if any) | Native POST. |
| Latest-writing and other lists | Rendered at build time. |

### 5.6 Reduced motion and other user preferences

`prefers-reduced-motion: reduce`: the hero figure and the diagram trace render at rest
immediately; every transition is instant; no smooth scrolling; diagram selection is shown by
outline weight and a text label, never by motion. Also honour `forced-colors` (diagram strokes
use `currentColor` or system colours), `prefers-contrast: more` (thicker rules), and a print
stylesheet (light theme; nav, footer, chat and figure hidden; link URLs shown on the résumé and
role pages).

---

## 6. Accessibility decisions (WCAG 2.2 AA, both themes)

Method note: the provided accessibility-review skill uses a WCAG 2.1 AA quick reference. The
brief requires 2.2 AA, so this section adds 2.4.11 Focus Not Obscured, 2.5.7 Dragging
Movements, 2.5.8 Target Size (Minimum), 3.2.6 Consistent Help, and 3.3.8 Accessible
Authentication. That skill also lists 2.5.5 (44 x 44px) under AA; in WCAG it is AAA. We use 44px
as a *design target* and 24px (2.5.8) as the AA floor.

### 6.1 Landmarks

| Landmark | Rule |
|---|---|
| `header` (banner) | wordmark, `<nav aria-label="Primary">`, Résumé action, theme toggle |
| `main id="main"` | one per page; skip-link target with `tabindex="-1"` |
| `nav aria-label="Breadcrumb"` | case study and post only; last item `aria-current="page"` |
| `nav aria-label="On this page"` | case study and long posts; `<details>` on phone |
| `article` | case study body, post body |
| `aside` | sidenotes; the selected-component panel is a labelled region, not an `aside` |
| `figure` and `figcaption` | the system diagram, with SVG `<title>` and `<desc>`, and the legend list as the text equivalent |
| `footer` (contentinfo) | one `<nav aria-label="Footer">` |
| `<dialog>` | chat, opened with `showModal()` so background inertness, Esc and focus return come from the platform |

`lang="en"` on `<html>`. Unique `<title>` per page. Meaningful link text: never "Read more";
use "Read the case study: {title}". PDF links say "(PDF)". External links say so. Images: the
portrait (if used) has meaningful alt; decorative images and the hero figure are `alt=""` or
`aria-hidden`; the system diagram has a text equivalent.

### 6.2 Heading outline per template

| Template | Outline |
|---|---|
| Home | h1 hero line; h2 Selected work (h3 per row); h2 Latest writing (h3 per post); h2 Ask |
| Work | h1 Work; h2 Case studies (h3 per row); h2 Smaller builds (list, no headings) |
| Case study | h1 title; h2 Problem; h2 System; h2 Decisions (h3 per decision); h2 What broke; h2 Outcome; h2 The rule I took from this; h2 Stack; h2 Next |
| About | h1 About; (bio is a paragraph, no heading); h2 Working rules; h2 Timeline (h3 per employer); h2 Teaching and research; h2 Elsewhere |
| Journal index | h1 Writing; h2 All posts (h3 per post) |
| Post | h1; h2 Context; h2 per body section; h2 What I got wrong; h2 The rule I took from this; h2 Questions (h3 per question); h2 Related |
| Role | h1 role; h2 Evidence; h2 Stack; h2 Practicalities; h2 Questions (h3 per question) |
| Services | h1 Problems I solve; h2 per problem (five); h2 How it starts |
| Contact | h1 Contact; h2 Elsewhere |
| 404 | h1 |

Exactly one `<h1>` per page and no skipped levels.

### 6.3 Focus order, skip links, keyboard

- **Order = DOM = visual order:** skip link, wordmark, four nav links, Résumé, theme toggle,
  main content in reading order, footer. Where a layout places two sections side by side (Home
  hero and work, case-study Problem and System), the DOM order is the reading order and only CSS
  grid moves them (2.4.3, 1.3.2).
- **One skip link,** first in the DOM, "Skip to content", visible on focus, target `#main`. The
  contents rail is at most five links and is a `<details>` on phone, so a second skip link is
  not needed.
- **Sticky rail** must not hide focus (2.4.11) [E]: set `scroll-padding-top` and keep no other
  fixed element.
- **No context change on focus** (3.2.1): no link, toggle or router item navigates or changes
  content on focus alone. The Résumé target switches by page, never by focus.

**Keyboard map**

| Element | Tab | Enter / Space | Escape | Arrow keys |
|---|---|---|---|---|
| Skip link | first stop, visible on focus | jumps to `main`, focus lands there | none | none |
| Nav links, Résumé, footer links, role router links | DOM order, one stop each | follow the link | none | none |
| Theme toggle | one stop | toggles; state in `aria-pressed` | none | none |
| Contents rail (desktop) | one stop per link (5) | jumps to the section; focus moves to its heading | none | none |
| Contents disclosure (phone) | one stop | opens or closes | closes when focus is inside | none |
| Diagram component | one stop each, in path order (4 to 8) | selects it; the panel updates | clears the selection | optional convenience: next and previous component |
| Decision disclosure | one stop per decision | toggles | none | none |
| Copy email, Copy code | one stop | copies; live region says "Email copied" or "Code copied" | none | none |
| Chat trigger | one stop | opens the dialog; focus goes to the question field | not applicable | none |
| Chat dialog | Tab cycles inside the dialog | sends the question | closes; focus returns to the trigger | none |
| Form fields (if any) | in order | submits | none | none |

The chat dialog is a modal, so focus stays inside it by design. It is not a trap because Esc and
a visible Close button always exit and return focus.

- **Diagram pattern:** components are real `<button>`s in reading order, so Tab moves through
  them without a roving tabindex to get wrong. The selected state uses `aria-pressed="true"`, a
  thicker outline and a text label; never colour alone. The result panel is a labelled region
  with `aria-live="polite"`, updated once per selection.
- **Chat:** input has a visible label; a response is announced once complete, never token by
  token.

### 6.4 Screen-reader map

| Element | Announced as | Watch for |
|---|---|---|
| Skip link | "Skip to content, link" | Visible on focus. |
| Primary nav | "Primary, navigation", each "Work, link"; the current page adds "current page" | `aria-current="page"`. |
| Résumé action | "Résumé, Backend, PDF, link" | The accessible name starts with the visible label (2.5.3). It is a link, so it must not announce as a button. |
| Hero figure | not announced | `aria-hidden`; no meaning inside it that the text lacks. |
| Hero `<h1>` | "heading level 1, I like difficult systems..." | |
| Diagram | "{title}, group", then the caption; each component "{label}, toggle button, pressed or not pressed" | Mark decorative SVG paths `aria-hidden` so the SVG internals are not read. |
| Selected-component panel | polite announcement: "{component}: {text}" | Once per selection. |
| Decision disclosure | "{decision title}, collapsed or expanded, button" | |
| Copy email | "Copy email, button"; afterwards "Email copied" | Live region, polite. |
| Chat dialog | "Ask about my work, dialog" | Response announced when complete. |
| Breadcrumb | "Breadcrumb, navigation", last item "{page}, current page" | |
| Definition lists | "Role, {value}" pairs | Use real `<dl>`. |

### 6.5 Touch and pointer

Design target 44 x 44px for nav links, the résumé buttons, role router links, footer link rows,
diagram components and Copy buttons. The AA floor is 24 x 24px with spacing exceptions (2.5.8)
[E]; we aim above it because the primary audience is on a phone. Diagram component hit areas are
padded inside the SVG. No hover-only content. No dragging or multi-finger gestures (2.5.7).

### 6.6 Reading and layout

Body at least 16px, 18px on reading templates at 1024px and above; line height 1.6 (a serif face
gets slightly more); prose column 60 to 72 characters and under 80 always. Reflow to 320px with
no horizontal page scroll (1.4.10); text-spacing overrides must not break layouts (1.4.12);
200% zoom usable. Code blocks scroll inside their own box, are focusable (`tabindex="0"`), and
never widen the page. Diagram text stays at 12px or larger at its rendered size, which is why
diagrams are designed vertical first.

### 6.7 Motion

No flashing content (2.3.1). Motion over 5 seconds does not exist (2.2.2). §5.6 for reduced
motion.

### 6.8 Theme, forms

**Theme.** Default follows `prefers-color-scheme`; if it is not set, dark **[J, §8 Q9]**. The
toggle is a `<button>` with `aria-pressed` and a fixed accessible name ("Dark theme"); the
choice persists in `localStorage` (guarded by try and catch) and an inline pre-paint script
prevents a flash. A `<meta name="theme-color">` per theme. Links keep an underline: colour is
never the only cue.

**Forms (if any).** Labels always visible (3.3.2), `autocomplete` set, errors identified in
text and linked with `aria-describedby` (3.3.1), no CAPTCHA and no cognitive test (3.3.8) [E].
Nothing else on the site requires login.

### 6.9 Contrast matrix (the UI lead fills the ratios; both themes must pass)

| Pair | Required |
|---|---|
| Body text on page background | 4.5:1 |
| Muted or secondary text on page background (text needed to read, never decorative grey) | 4.5:1 |
| Link text on page background, plus an underline | 4.5:1 |
| Primary button label on button fill | 4.5:1 |
| Primary button fill against page background | 3:1 |
| Focus ring against adjacent colours (at least 2px thick) | 3:1 |
| Diagram component borders and connecting lines against background | 3:1 |
| Selected versus unselected diagram component | 3:1, and a non-colour cue |
| Code text and syntax colours on the code background | 4.5:1 |
| Text over any decorative pattern (for example the tile motif) | 4.5:1 at its busiest point |
| Placeholder text | 4.5:1 |
| Hero figure resting line | decorative, but keep 3:1 so its labels are legible |

### 6.10 Test protocol and release gates

Automated scanners catch roughly 30% of issues, so they are the first gate, not the only one.

| Step | Scope | Pass |
|---|---|---|
| Automated scan (axe) | every template, 2 themes, 375 and 1440 widths | zero violations |
| Keyboard-only pass | every template; skip link, order, visible focus, no traps, dialog exit, diagram, rail | all pass |
| Screen reader | VoiceOver on iPhone Safari (the phone-first audience) and NVDA on Windows, on Home, a case study, a post and Contact | every element announces as in §6.4 |
| Contrast | every pair in §6.9, both themes | all pass |
| Zoom and reflow | 200% zoom and 320px width | no loss of content, no horizontal page scroll |
| Preferences | reduced motion, forced colors, `prefers-contrast`, print | behave as in §5.6 |

Common-issue cross-check against the skill's list: contrast (§6.9), form labels (§6.8),
keyboard access (§6.3), alt text (§6.1), focus traps in modals (native dialog, Esc, §6.3),
missing landmarks (§6.1), auto-playing media (none, §5.4), time limits (none exist).

---

## 7. Content-structure specs

### 7.1 Case-study template

| # | Section | Purpose | Target | Max | Hard rules |
|---|---|---|---|---|---|
| H | Summary line | The recruiter line | 20 | 20 | Verb first. No adjectives. Function, not product name. |
| H | Facts | Role, Period, Status, Outcome | 30 | 40 | Outcome fact must have an evidence reference. |
| 1 | Problem | Whose, why messy, constraints | 90 | 110 | No identifying detail. No client or product names. |
| 2 | System | Diagram plus 4 to 6 legend items | 120 | 150 | Each legend item max 25 words: what, why, how it fails. Numbers follow the request path. |
| 3 | Decisions | Three records | 240 | 270 | Each: chose, rejected, why, cost accepted. At least one rejected alternative is real. |
| 4 | What broke | One or two incidents | 130 | 160 | Symptom, root cause, fix, rule. "What I got wrong" is first person. |
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
diagram:      { nodes: [ { id, label, text, failure } ], edges: [ [from, to] ] }   # path order = numbering
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
description:   # max 155 chars; may equal the lede, trimmed
type:          # incident | lab-note | build-log
date:
updated:
shortAnswer:   # 1 to 2 sentences, max 40 words: the answer, first. Renders as the lede
tldr:          # optional, 3 bullets, only if > 900 words. Renders under "In brief"
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
employer and title; publication with DOI. Rendered as a `<dl>` on About and as the two lede
sentences on Home. Machine-readable through the Person data (SEO lead). The years figure follows
the master-resume rule: full-time professional engineering only.

### 7.4 Working rules (About)

Data shape: `{ n, text, evidence: [caseStudySlug or postSlug] }`, text max 20 words, imperative,
each backed by at least one link. A rule with no evidence is not published. The number is a
citation key, which is why numbering is allowed here (§3.0 rule 1).

### 7.5 Microcopy, labels and vocabulary

Applied from the UX-copy principles: clear, concise, consistent, useful, human. CTAs start with
a verb and say what happens. An action keeps its name through the whole flow. Errors say what
happened, why, and what to do. Sentence case everywhere. No filler, no apology, no idiom in
navigation, CTAs or errors.

**Vocabulary (one term per thing, everywhere)**

| Use | Never |
|---|---|
| Résumé (UI and headings); `/resume/` in file paths | CV, Resume without the accent, Curriculum vitae |
| case study (prose); Work (nav label) | project (in the UI), portfolio piece |
| post (an entry); Writing (nav label) | article, blog |
| role (the job someone is hiring for) | track (internal word only) |
| What broke (section title) | Challenges, Lessons learned, Pain points |
| Decisions (section title) | Approach, Trade-offs and choices |
| Problems I solve (page title) | Services, Offerings |
| Email me (the action); Contact (the page) | Get in touch, Let's talk, Reach out |
| Open to (availability phrase) | Available for hire, Seeking |

**Navigation and page labels**

| Element | Copy | Note |
|---|---|---|
| Nav | Work, Writing, About, Contact | "Writing" is plain to a scanner. |
| Header action | Résumé | Accessible name "Résumé, {role}, PDF". Visible label is contained in the name (2.5.3). |
| Skip link | Skip to content | |
| Breadcrumb | Work / {short title}; Writing / {short title} | |
| Footer groups | Site, Roles, Elsewhere | |

**CTA labels**

| Where | Label | What happens |
|---|---|---|
| Home hero (primary) | Download résumé (PDF) | Opens the default PDF |
| Home hero (secondary) | Email me | Opens mail, no subject |
| Home role router | Backend, AI backend, Full-stack, ERP and AI | Opens that role page |
| Home lists | All work; All writing | Opens the index |
| Home ask | Ask about my work | Opens the chat dialog |
| Work and Writing rows | The title itself | Opens the item |
| Case study (primary) | Email me about this build | Opens mail, subject "About: {title}" |
| Case study | Next: {title}; Read the post: {title}; View the code; View the demo | |
| Post (primary) | Read the case study: {title} | |
| Role page (primary) | Download résumé for {role} (PDF) | |
| Services (primary) | Describe the problem | Opens mail, subject "A problem worth a look" |
| Contact (primary) | The address as link text | Opens mail |
| 404 (primary) | Go to the home page | |

**States and messages**

| Situation | Copy |
|---|---|
| Copy email, success | Button label "Copy email" becomes "Email copied" |
| Copy code, success | "Copy code" becomes "Code copied" |
| Copy, failure | "Could not copy. Select the address and copy it by hand." |
| Chat, empty state | "Ask about a project, a stack, or how I work. Answers link to the page they come from." |
| Chat, waiting | "Reading the site. This usually takes a few seconds." |
| Chat, service down | "No answer. The chat service did not respond. Try again, or email me." |
| Chat, rate limited | "Too many questions for now. Wait a minute and try again, or email me." |
| Chat, out of scope | "I can only answer from what is on this site. Ask about a project, a stack, or how I work." |
| No JavaScript | "The chat needs JavaScript. Email me instead." |
| 404 | `<h1>` "Nothing here." Body: "That address does not exist, or the page moved. Try one of these." |
| Redirect page | "This page moved to {title}." with a link |
| Form, invalid email (if a form exists) | "Enter your email address, for example name@example.com." |
| Form, sent | "Sent. I will reply by email." (no time promise) |
| Form, failed | "Not sent. The form service did not respond. Email me instead." |
| Confirmation dialogs | None exist: no destructive actions on the site. |

**Alternatives considered for the three most consequential labels**

| Element | Option A (recommended) | Option B | Option C | Why A |
|---|---|---|---|---|
| Primary résumé CTA | Download résumé (PDF) | Résumé (PDF) | Get my résumé | Verb-first, names the file type, matches the outcome. B is used in the header where space is tight. |
| Second nav item | Writing | Journal | Notes | A tells a scanner there is writing. B matches the URL. |
| Client CTA | Describe the problem | Tell me what is broken | Send the details | A matches the page title's noun. B is more on-brand and equally plain; a fair swap if the CD prefers voice over consistency. |

**Title and description patterns** (lengths per `CLAUDE.md`, subject to §8 Q4): `{page title, max
42 characters} | Mubashir Rehman`. Descriptions max 155 characters, first clause is the answer.

**Localization notes.** Readers span Pakistan, the Gulf, the UK and the US, many reading English
as a second language. Keep sentences under 20 words. Avoid idiom and wordplay in nav, CTAs and
errors. Write dates unambiguously ("12 March 2026"). Give the timezone as "PKT (UTC+5)". Give
numbers a unit. The hero line and "earns its place" are the brief's voice and are deliberate.

---

## 8. Open questions for the creative director

Each has my recommendation and the cost of being wrong.

1. **Flagship trio and launch count.** Recommend the three cover the three pillars and at
   least one is publicly verifiable: the dental front desk (Ownership), the ERP agent layer
   (Applied AI), and HireTrack (Systems, public code). The multi-tenant architecture study is
   the strongest Systems evidence but is in progress. The content lead decides after the
   eligibility test. Wrong choice costs the home page's credibility.
2. **Labels versus URLs.** Recommend "Work" over `/projects/` and "Writing" over `/journal/`.
   Alternative: "Projects" and "Journal" for parity. Low stakes.
3. **Hero `<h1>` and order.** Recommend the hero line as `<h1>`, with identity in the lede
   directly below the figure (§3.1). Fallbacks if the 6-second test fails: identity sentence
   above the `<h1>`, or an identity `<h1>`. The SEO lead confirms entity signals are enough.
4. **Title suffix.** `CLAUDE.md` says the layout appends a suffix of the form " | Mubashir
   Rehman", then an em dash, then "Backend Engineer" to every title. That suffix breaks the
   brief's voice rule and uses 36 of the 60 permitted characters. Recommend " | Mubashir Rehman"
   (18 characters). Needs the engineering and SEO leads.
5. **Photo, and phone number.** Photo: yes or no (plan §12 Q4); my lean is yes on About only,
   not on Home, so the hero stays typographic. A public phone or WhatsApp number invites spam
   and is a recruiter convenience; recommend it lives in the résumé PDF, not the site.
6. **Contact form.** A form needs a third-party endpoint and adds a data processor. Recommend
   email only at launch; add a form only if inbound volume justifies it.
7. **Role naming and order.** Profile notes leave the ranking of "AI backend" versus "ERP and
   AI" as Mubashir's targeting decision. The order of the role router and footer follows it.
   Also: keep the slug `/for/erp-hrms/` (equity) with the label "ERP and AI", or add
   `/for/erp-ai/` with a redirect. Recommend keeping the slug.
8. **Work authorization and location, stated plainly on role pages.** Recruiters ask this
   first; hiding it wastes both sides' time. Recommend a factual line in Practicalities. The
   wording is Mubashir's.
9. **Default theme.** Recommend following the visitor's system setting, and dark only when
   there is no signal. Alternative: always dark first. The risk is a recruiter in a bright room
   on a dark page.
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
16. **Load-time motion versus plan §5 "nothing auto-plays".** Recommend allowing exactly two
    single-shot sequences of at most 2 seconds, each with a static resting state that is the
    real design: the Home hero figure and the case-study diagram trace. If you refuse, both
    simply render at rest and nothing else in the blueprint changes. Cost of refusing: the hero
    loses its one distinctive moment and leans on typography alone.
17. **Hero figure content.** The five seams (API, database, queue, model, external service)
    are the brief's own list. The UI lead draws them. Confirm you accept a figure at all, given
    the brief's ban on AI clichés; my constraint is curves and straight lines, no circuit
    traces, no glow.

---

## Appendix A: Sources and confidence

Direct page fetches were blocked in this environment, so items marked "summary" rest on search
result summaries, not on reading the full source.

| Claim used | Source | Confidence |
|---|---|---|
| Recruiters skim a résumé for about 7.4 seconds on average (6 seconds in the 2012 version); 30 recruiters, 10 weeks; they read current title and company, then previous, then dates, then education; simple layouts and white space performed better | Ladders eye-tracking study, 2018: <https://www.theladders.com/career-advice/you-only-get-6-seconds-of-fame-make-it-count> and PDF <https://www.theladders.com/static/images/basicSite/pdfs/TheLadders-EyeTracking-StudyC2.pdf>; HR Dive: <https://www.hrdive.com/news/eye-tracking-study-shows-recruiters-look-at-resumes-for-7-seconds/541582/> | Medium. Applies to résumés, not sites. Small sample. A recruiter-side critique exists (<https://spectacletalentpartners.com/is-the-6-second-resume-scan-a-myth/>) which I could not read. |
| Hidden navigation: about 20% lower discoverability, 39% slower tasks on desktop, 15% on mobile, 179 participants, 6 sites | NN/g, "Hamburger Menus and Hidden Navigation Hurt UX Metrics": <https://www.nngroup.com/articles/hamburger-menus/> (summary) | Medium to high |
| Users scan in an F-pattern; front-load the point; inverted pyramid | NN/g, "F-Shaped Pattern For Reading Web Content": <https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/> (summary) | Medium to high. The pattern varies by page type. |
| WCAG 2.2: Target Size Minimum 24 x 24 CSS px (AA); Focus Not Obscured (AA); Accessible Authentication (AA); Consistent Help; Dragging Movements; motion over 5 seconds needs pause, stop or hide (2.2.2) | W3C, WCAG 2.2: <https://www.w3.org/TR/WCAG22/> (via search summaries and my knowledge of 2.2.2) | High |
| Mobile is the majority of LinkedIn traffic (57 to 70%) | <https://salesso.com/blog/linkedin-hiring-statistics/> (vendor blog) | Low. Directional only. |
| Hiring managers favour case studies over lists, mastery over breadth, honest failure writing | <https://dev.to/brianyoung/how-to-write-developer-project-case-studies-recruiters-can-actually-understand-4oe4> and <https://hakia.com/skills/building-portfolio/> | Low. Anecdotal blogs. I did **not** use their survey percentages, which I could not trace to a primary source. Used only for the qualitative agreement with the template. |
| FAQ markup and answer-first structure raise AI citation | <https://searchatlas.com/blog/schema-for-aeo/> and similar | Low. Vendor marketing. I use only "answer-first, clear structure" because it helps human readers regardless. |
| Exemplary engineer sites (jvns.ca, simonwillison.net, overreacted.io) | Named as commonly cited in a search summary; lessons below are from my own familiarity with them, not fetched today | Medium. Lessons taken, not designs: answer-first titles, dated and linkable posts, very low chrome, RSS, series for long arcs. |
| Google narrowed FAQ rich results in 2023 | My recollection, not fetched | Low to medium. SEO lead to verify. |
| Design principles applied in §3.0, §3.1, §3.3, §5, §7.5 (hero from the subject's world, numbered markers only for real sequences, one orchestrated motion moment, CTA and error-message patterns); accessibility-review test approach in §6.10 | Skill files supplied by the creative director (frontend-design, ux-copy, accessibility-review) | Direction from the creative director, applied with two corrections: WCAG 2.2 rather than 2.1, and 2.5.5 treated as a design target because it is Level AAA. |

Everything not tagged above is design judgement, to be tested with the two tests in §4 once a
build exists.
