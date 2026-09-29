# Redesign v2: editorial layer

Owner: Mubashir Rehman. Implementer: a Sonnet agent. Advisor: the Opus session that wrote this plan.
Branch: `claude/vibrant-meitner-9qdgx8`. **Never push to `main`.** The advisor reviews and deploys.

## 0. Why this exists

An external review (ChatGPT) said the site has "too much good information competing for attention" and reads like
"a well-designed résumé". Parts of that review describe the **old** site (it cites metrics, a services pitch and
recruiter tracks that are already gone), but its editorial direction is sound. This plan keeps the technical
foundation and replaces the editorial layer.

The target: a visitor leaves thinking "this person builds things, understands systems, and has opinions about
engineering", not "this is a well-designed résumé".

**Do not try to make the site more impressive. Make it more specific.**

### 0.1 Thesis (from the second review, adopted)
The differentiator is not "backend + AI". It is the pattern every case study already shows: **walk into a real,
messy system, find where reality diverges from what people think it does, and build the missing reliability.**
The visual thesis follows from that: **an engineer's systems notebook crossed with an incident report.** Traces,
system diagrams, numbered sections, annotations, and one recurring grammar:
`SYMPTOM → CAUSE → FIX`, `DECISION / REJECTED / WHY / COST`, `RULE`. These labels are how the content is already
written; the design makes them visible. It is not a startup landing page, not an agency site, not a résumé.

Emotional progression to design for: 5 s "this person has a point of view" → 20 s "builds serious systems" →
60 s "understands failure, not just happy paths" → 3 min "I would hand him a difficult backend problem" → contact.

## 1. Triage of the external reviews

Where the first-review triage below and the second-review triage or §3 disagree, the second triage and §3 win.

### Already fixed (do nothing)
- Six-metric dashboard, "60+ REST endpoints", "7 services", "8+ production systems": gone.
- "Backend Engineer · AI/ML · Cloud · Systems" taxonomy hero: gone.
- "For recruiters" block and "More shipped work" dump on home: gone.
- "Need this built, not hired?", fixed-scope projects, retainers, pricing: gone. `/services` is already low-key and not in the nav.
- Framer Motion, view transitions, React: gone (static Astro, no React).

### Adopt
- Home is a **trailer, not the film**: hero, 4 selected works, how I work, currently, one CTA, footer. Nothing else.
- **Projects as artifacts**, not cards: number, title, one line, mono metadata, a real system fragment, "the interesting part", link.
- **How I work** becomes a major section on home and the centrepiece of `/about`, built from the existing numbered rules.
- **Name is the logo**; fewer nav items.
- **Mono for metadata only** (project numbers, labels, meta rows, dates). Martian Mono is already loaded.
- **One UI accent**, thin 1px dividers, flat surfaces, few cards, no shadows, constrained width, strong left alignment, asymmetric project rows.
- **Motion: alive, not animated.** Hover states, the existing trace draw, nothing else.
- `/projects` grouped and curated: Featured, More systems, Open source, Research.
- Minimal footer.
- Chat demoted: a small link, not a home section.

### Reject (with reason)
- **"Brandmate" as a featured project**: named product, NDA. The only products that may be named are The Quetta Tea 2.0 and HireTrack.
- **Drone swarm "10+ UAVs, 50Hz telemetry"**: unverified; the master CV says never use these. Drone work stays a small build entry.
- **"No purple"**: the owner chose black + purple + gold. Keep it. Purple is the single UI accent (links, focus, active nav, CTA). Gold is reserved for the trace/signal motif and at most one metadata highlight per view. Do not introduce any new colour.
- **Hero copy "I build software for messy systems."**: the tagline is **pending the owner's decision**. Keep rendering `profile.heroLine` from data so it swaps in one edit. Do not hardcode tagline text in templates.
- **Remove Résumé from everywhere prominent**: the owner explicitly asked for the résumé download and email to be visible above the fold. Keep both as hero CTAs. Remove them from the nav instead (see 3.1).
- **"Got a difficult system? … work with me"**: freelancing must stay low profile. The CTA speaks to roles first (see 3.7).
- **Invented principles** ("Don't hide uncertainty", "If I don't know, I say I don't know", "correctness over impressive architecture", "Thinking about…"): not in the data. Use only the nine rules in `src/content/work/*.md` (`rule.n`, `rule.text`). Note: "Deterministic first, model second." **is** real (rule 8, HireTrack) and may be used. If you think a rule is missing, ask the advisor; never add one.
- **Numbers the review invents or suggests** (10+ UAVs, ~10 services, etc.): never. Every figure must already exist in `src/data/*.json` or `src/content/**`.

### Second review (after the live site), triage
- **Adopt**: the thesis in 0.1; keep the hero line's three-weight treatment; demote "3+ years" to metadata; a
  `Backend / systems engineer` identity label; "How I work" as the first section after the hero; three projects on home,
  one per pillar (Ownership, Systems, Applied AI), each with incident markers; a **When things break** section using
  `SYMPTOM → CAUSE → FIX`; "Problems I solve" promoted to a compact home section titled **Where I usually get called**;
  a **Currently** block; the chat reframed as **Ask the engineer** with example questions; a simpler footer that
  **keeps** "Work under NDA is described by function, never by name."; case studies presented as investigations with
  causality made visual; role pages as filtered evidence with a persistent role switcher and Backend first;
  Writing kept intentionally small with an honest post count; mobile designed as its own one-column narrative.
- **Already true / stale in the review**: the About page no longer has a toolbox, n8n, or achievements list (it
  reviewed a cached version); no progress bars exist; no gradients exist.
- **Reject**: a new accent colour (owner chose purple + gold; keep, flat, no gradients); paper/noise/grid textures
  (skip; hierarchy must come from type, rules and spacing); invented About prose ("I started close to the machine,
  teaching operating systems and distributed systems…") and invented "What I care about" bullets (use bio + rules
  only); "Thinking about" in Currently (not a fact we have); n8n in any stack list (retired); "Have a broken system?"
  as a primary CTA (freelancing stays low profile: roles first, problems second and quiet).
- **Owner decision pending**: the tagline. Both reviews say keep "I like difficult systems…"; the owner said he does
  not like it. It stays data-driven (`profile.heroLine`); do not change it.

### Third review (scroll and typography), triage
The third review read the repo's **stale README** (Inter + JetBrains Mono, Tailwind, card/badge/metric components,
scroll-reveal, view transitions, a bottom nav). None of that is in the code; the README was rewritten to match reality.
Its visual diagnosis still applies, and it overrides §3 where they differ:
- **Scroll rhythm**: every major section has **one dominant idea**; at most two high-information blocks visible in any
  viewport; large vertical pauses between sections (clamp roughly 96px to 176px). Low-information space is a feature.
- **Varying widths** instead of one container: hero ~1160px, principles ~720px, project titles wide, prose ~650px,
  diagrams ~1000px, writing ~800px, contact ~1100px. Left edges stay aligned to the grid so it reads as intentional.
- **Scale contrast**: hero > project titles > section titles. Section titles become a small mono label
  (`01 / WORK`) plus at most one short line; the **project titles** are the big type after the hero.
- **Section lines with personality**: the agent may propose one short line per home section (e.g. "Systems I have had to
  understand."). They are copy, not facts; list them in the report; the advisor approves before they ship.
- **Header**: name + small mono descriptor on the left, nav on the right, **Résumé as a quiet text utility**
  (`Résumé ↗`, not a button). This replaces §3.1's "Résumé leaves the nav". No pill, no glass, no shadow. The owner
  explicitly asked for a sticky header, so it stays sticky, but it is **transparent at the top and only gains a
  background and a 1px bottom rule after scrolling**; phones keep hide-on-scroll-down.
- **Portrait**: small and secondary in the hero (next to the name, ~40 to 48px); the larger portrait lives on /about/.
- **Motion**: no reveal animations on text, headings, nav, footer or metadata (none exist today; keep it that way).
- **No visible boxiness**: border + typography + whitespace. Panels only behind diagrams and code.
- **Project visuals must not all look identical**: MiniDiagram takes its shape from each project's own nodes and edges
  (the dental flow is a chain, the signal backend fans in, the ERP agents hub). Keep those shapes distinct; do not force
  one layout.
- **Typography first** (new phase P1.5, below). Reject from this review: "no purple" (owner's colour; flat purple,
  never glowing, never a gradient).

## 2. Non-negotiable guardrails

- No client or internal product names. Only **The Quetta Tea 2.0** and **HireTrack** may be named.
- No colleague or team-member names. (The build runs an NDA denylist when `NDA_DENYLIST` is set; see §6.)
- Nothing about side ventures or freelancing beyond the existing low-key `/services` page.
- No unverified claims, no new numbers, no new facts. Copy may be **shortened or reordered**, never embellished.
- **No em dashes** (U+2014) anywhere in site copy. The gate fails on them. En dashes in ranges are also discouraged; use "to".
- Never touch `master-resume/`, `.env`, or anything outside this repo except reading `docs/`.
- Keep: every route and URL (`/projects/<slug>/`, `/journal/<slug>/`, `/for/<role>/`, `/about/`, `/contact/`, `/services/`), canonical URLs, sitemap, RSS, `llms.txt`, `ask-context.json`, JSON-LD via `src/lib/schema.ts`, the title rule, redirects, `robots.txt`, résumé PDFs.
- Keep the data layer as the single source of truth: `src/data/profile.json`, `roles.json`, `builds.json`, `src/content/work/*.md`, `src/content/journal/*.md`. Templates read data; they do not hardcode facts. If a template needs a short string that does not exist (e.g. a one-line artifact caption), add a field to the data/frontmatter (and to the Zod schema in `src/content.config.ts`), sourced from text that already exists on the site.
- Accessibility stays at WCAG 2.2 AA: one `h1` per page, visible focus, skip link, `prefers-reduced-motion`, contrast (run `node design/tokens.mjs` after any token change: 0 failures).
- Performance: no new runtime JS frameworks, no web-font additions (Archivo + Martian Mono are already self-hosted), no images heavier than the current headshot.
- Commit message format: `<page/module/component> (<fix/refactor/enhancement/add/remove/feat>) : <details>`, one logical change per commit, each ending with:
  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01RkWnZ315VaKQUunv6B4yUN
  ```

## 3. Target design

### 3.1 Navigation (`src/components/Header.astro`)
```
[mark] MUBASHIR REHMAN                         Work   Writing   About   Contact      [theme]
       backend / systems engineer
```
- Wordmark (existing star mark + name, name may be set in caps) is the home link, with a small mono identity label
  under it on desktop (`profile.label`, see §3.10). Hide the label on phones.
- Links: Work, Writing, About, Contact. **Résumé leaves the nav** (it lives in the hero, the contact block and footer).
- Quiet bar: no pills, no glass, no shadow. Keep sticky + hide-on-scroll on phones (already implemented).
- Phones: one row if it fits at 320px, otherwise links on a second row as today. No hamburger.

### 3.2 Home (`src/pages/index.astro`), in this order and nothing else
Sections are numbered in mono (`01 / HOW I WORK`) and separated by full-width 1px rules. Each section must fit in
about one desktop screen; if it does not, cut, do not add.

0. **Hero** (left-aligned; text ~7 cols, portrait ~3 cols on desktop)
   - Identity: small round headshot + `MUBASHIR REHMAN` + mono label `Backend / systems engineer`.
   - `h1`: `profile.heroLine` (three weights, unchanged).
   - One supporting sentence: `profile.roleLine`.
   - Evidence meta, mono, one or two short lines: `Lead Software Engineer, TransData · leading five engineers` and
     `3+ years in production · Lahore · UTC+5 · Open to remote roles` (all from `profile`).
   - Actions: primary **Download résumé (PDF)**, secondary **Email me**, tertiary text link **See the work ↓**.
     Must stay above the fold at 1280×590, 1366×625 and 390×844.
   - A small text link under the actions: `Hiring for a specific role? →` to `/for/backend/` (role switcher there).
   - The trace (`Trace.astro`) closes the hero.
1. **01 / How I work**: four rules, big type, mono numbers, each linking to the case study that earned it:
   rule 1 "Read the number that does not add up.", rule 2 "Split diagnosis from fixing where the blast radius
   changes.", rule 3 "Prove the path end to end before you tune the thresholds.", rule 8 "Deterministic first, model
   second." Under each, one mono line `from: <case study title>`; no new explanatory sentences. Link `All nine rules →`.
2. **02 / Selected work**: the three flagships only (dental = Ownership, social-signal = Systems, erp = Applied AI).
   Editorial rows, not cards, alternating asymmetric on desktop, one column on phones. Each row: mono number + pillar +
   period, title, `summary`, `MiniDiagram`, **incident markers** (the `broke[].title` values as small mono tags),
   "The interesting part" (`decisions[0].chose` + `why`), and "Read the case study". Then one line computed from the
   collections: `+ N more case studies, open source and research →` to `/projects/`.
3. **03 / When things break**: three incidents as the `Incident` component (§3.11), one each from dental, social-signal
   and healthcare console (pick the clearest `broke[]` item; one from each keeps it varied). Each links to its case study.
4. **04 / Where I usually get called**: the five problem headlines from `/services/`, as a plain numbered list, one
   line each, each linking to its case study; then `Problems I solve →`. Move the `problems` array from
   `services.astro` into `src/data/problems.json` so both pages read one source.
5. **05 / Currently**: mono-labelled lines. `NOW` Lead Software Engineer at TransData, leading five engineers ·
   `WRITING` the latest 2 published post titles, linked · `RESEARCH` the paper, venue and year, linked ·
   `OPEN TO` remote backend and AI backend roles (from `availabilityShort` + role labels). Link `Full background →`.
6. **Contact + Ask the engineer** (one section): heading "Hiring for a backend or AI role?", Email + Résumé buttons,
   one quiet line `Or tell me about a system that is misbehaving.` → `/services/`. Beside it (below on phones):
   **Ask the engineer**, one line ("Answers come only from what is published here"), and three example questions as
   buttons that open the chat with that question filled in: "What has he built alone?", "What has he actually done
   with AI?", "Show me a production failure he fixed." `<noscript>` fallback: "Email me instead."
7. Footer (§3.8).

### 3.3 Visual system (`design/tokens.mjs` → `src/styles/tokens.css`, and `src/styles/global.css`)
- **Width**: content max 1160px, 12-col grid with 24px gutters desktop, 16px side gutter on phones. Prose measure stays ~68ch.
- **Type**: Archivo for display and body (keep the variable width axis; the hero keeps its three widths). Martian Mono, uppercase, letter-spaced, `--fs-label` size, for: eyebrows, project numbers, meta rows, dates, rule numbers, table headers. Nothing else is mono.
- **Colour**: tokens unchanged in hue. Purple = the only UI accent. Gold = trace and at most one highlight per view. Neutrals from existing tokens. Keep the grey (dark) and camel (light) panel surfaces, but **only** as the artifact surface behind diagrams and as code blocks; everything else sits on the page background separated by 1px `--line-2` dividers.
- **Surfaces**: no shadows, radius ≤ 6px, no glass, no gradients.
- **Spacing**: generous vertical rhythm between sections (clamp ~64px to 128px), tight within a section.
- **Motion**: trace draw (existing); a MiniDiagram's edges may draw once when it enters the viewport (IntersectionObserver, <1 KB inline script, content fully visible without JS); `SYMPTOM → CAUSE → FIX` arrows may connect once on view; link underline and row hover (≤ 2px). Everything respects `prefers-reduced-motion`. No paragraph fade-ups, no counters, no parallax, no cursor effects.
- Delete CSS that becomes unused (the file has grown by appending; consolidate as you go, do not append a new layer on top of old rules).

### 3.4 Project artifacts (the visual core)
- Reuse the existing diagram data (`diagram.nodes`, `diagram.edges` in work frontmatter) and layout (`src/lib/diagram.ts`). Build a **static mini diagram** component (`src/components/MiniDiagram.astro`): the same nodes and edges, compact, non-interactive, `aria-hidden` with a text caption (the diagram `caption`) for screen readers, rendered as inline SVG, correct in both themes.
- HireTrack has a public repo: its artifact may be the mini diagram (if it has diagram data) or a mono "pipeline" fragment built from its frontmatter. Never a stock or AI-generated image.
- The full interactive `Diagram.astro` stays on case-study pages.

### 3.5 `/projects/`
Groups, each with a mono heading and one-line intro:
- **Featured**: the three flagships, compact artifact rows.
- **More systems**: aws-backend-hipaa-eligible, ai-agent-engineering-harness, healthcare-integration-console,
  multi-tenant-saas-architecture, as a divided list (title, `summary`, mono meta). Not cards.
- **Open source**: HireTrack (case study link + repo + live demo) and the "This portfolio site" build entry.
- **Smaller builds**: the remaining `builds.json` entries, compact divided list.
- **Research**: the ECG paper as an artifact (title, venue, "My part:" from `profile.paper.contribution`, DOI + arXiv,
  link to the ECG case study). ECG appears here only.
No filters.

### 3.6 Case study pages (`/projects/[slug]/`)
Keep the content and the recent header fix (facts strip, problem beside diagram). Present it as an investigation:
numbered mono section labels (`01 PROBLEM`, `02 SYSTEM`, `03 DECISIONS`, `04 WHAT BROKE`, `05 OUTCOME`, `06 RULE`),
decisions in the `DECISION / REJECTED / WHY / COST` grammar (already the data shape), **What broke** rendered with the
`Incident` component (§3.11), the rule as a large pull quote. No content changes.

### 3.7 `/about/`
Engineer first, résumé second. Order: lead (bio paragraph 1) + actions → the rest of the bio → **How I work: all nine
rules** (`id="rules"`), each with its source link → background timeline → teaching and research → education → a
compact **Stack** line (`profile.stackLine`) and links to the four role pages. No invented narrative; bio text only.
The at-a-glance card becomes a compact mono-labelled list.

### 3.8 Footer (`src/components/Footer.astro`)
```
MUBASHIR REHMAN
Backend / systems engineer · Lahore, Pakistan · Open to remote roles
Work · Writing · About · Contact           GitHub · LinkedIn · Scholar · Résumé · RSS
Roles: Backend · AI backend · Full-stack · ERP and AI         Problems I solve
mubashirrehman66@gmail.com
© 2026 · Work under NDA is described by function, never by name. · Source
```
Keep the NDA sentence and the Source link. The chat link leaves the footer (it lives in the contact block).

### 3.9 Other pages
- `/journal/`: keep "Build logs and incident write-ups. The answer comes first."; add an honest computed count
  (`2 posts`); mono dates, dividers. Posts: restyle only.
- `/for/<role>/`: filtered evidence. A persistent role switcher at the top (Backend first, then AI backend,
  Full-stack, ERP and AI; current one marked), then what I bring, relevant case studies (as compact rows), stack,
  résumé for that role. Restyle; no content changes beyond layout.
- `/services/`: restyle only; stays out of the nav; quieter than home; reads `problems.json`.
- `/contact/`: keep; restyle; counts computed.
- `404`: restyle.

### 3.10 Data additions (the only ones allowed)
- `profile.label`: `"Backend / systems engineer"`.
- `profile.availabilityShort`: `"Open to remote roles"` (already shown on the current hero).
- `src/data/problems.json`: moved verbatim from `services.astro`.
Add each to the schema/types if one exists. Nothing else.

### 3.11 The incident grammar (`src/components/Incident.astro`)
Input: one `broke[]` item (`title`, `symptom`, `cause`, `fix`) plus the case-study link.
Desktop: title on top, then three columns `SYMPTOM → CAUSE → FIX` with mono labels and thin arrows.
Mobile: stacked, labels above each block, arrows turn downward. Text is the data verbatim (no shortening that changes
meaning). Used on home (§3.2 item 3) and case studies (§3.6).

## 3.12 Advisor answers to the P0 questions
1. `/projects/` groups: see §3.5 (Featured 3, More systems 4, Open source, Smaller builds, Research = ECG only).
2. Footer: keep the NDA sentence, Scholar and Source; Contact stays in the footer links (§3.8).
3. `availabilityShort`: yes (§3.10).
4. Remove the résumé prop plumbing from Header only; leave Base's prop. Yes.
5. Moot: home now shows the three existing flagships only. Do **not** set `flagship` on HireTrack (D1 withdrawn).

## 4. Phases and gates

Work strictly in order. **Do not mix phases.** At the end of each phase: build, run gates, take screenshots, commit, push the branch, then **stop and report to the advisor** (see §5). Wait for the advisor's go-ahead before the next phase.

| Phase | Scope | Must not touch |
|---|---|---|
| P0 Inventory | Read the code and data; list every home/about/projects element and where it will go; confirm the component list and any new frontmatter fields. No code changes. | everything |
| P1 Structure | Header, home order and content, footer, `/projects/` grouping, `/about/` order, `problems.json`, data additions (§3.10). Use existing styles; ugly is fine. | tokens, colours, fonts |
| P1.5 Type test (owner decides) | Three static specimen pages with identical content (hero, one How-I-work rule, one project row with its MiniDiagram placeholder, one writing item, the header), light and dark, desktop 1366×625 and phone 390×844. **A**: current Archivo (use its width axis for contrast) + Martian Mono. **B**: Instrument Serif display + Archivo body + Martian Mono. **C**: IBM Plex Sans + IBM Plex Mono. Build them as standalone HTML in `docs/redesign/v2/type/` loading fonts from `node_modules/@fontsource*` (add packages as devDependencies only), screenshot to the shots folder, then **stop**: the owner picks. Only the chosen family gets copied into `public/fonts/` in P2. | site pages |
| P2 Visual system | Grid, width, type scale usage, mono metadata, dividers vs panels, spacing, CSS consolidation. | copy, data |
| P3 Artifacts | `MiniDiagram`, `Incident`, the three home artifact rows, research artifact, compact variants. | other pages |
| P4 Inner pages | Case study, journal, role pages, services, contact, 404 restyle. | home |
| P5 Polish and QA | Hover/motion, responsive sweep, a11y, performance, final copy trim. | new features |

## 5. Working with the advisor

- The advisor is the Opus session that spawned you. You cannot call it mid-task, so **end your turn with a report** when you:
  1. finish a phase, or
  2. hit a decision this plan does not settle (design ambiguity, a fact you cannot find in the data, a guardrail conflict, a gate you cannot make pass).
- For small, reversible choices the plan implies, decide and note them in the report. Do not stop for those.
- Report format (keep it short):
  ```
  PHASE: P<n> <done | blocked>
  COMMITS: <sha> <subject> (one per line)
  GATES: build <ok/fail> · viewport <ok/fail> · tokens contrast <n failures> · denylist <ok/fail>
  SCREENSHOTS: <paths>
  DECISIONS I MADE: <bullets>
  QUESTIONS FOR ADVISOR: <numbered, each answerable in one line, with your recommended answer>
  ```
- The advisor replies with answers and "go P<n+1>". Continue from where you stopped.

## 6. Commands and environment notes

```bash
npm run build          # astro build + scripts/check-dist.mjs (one h1, canonical, lengths, JSON-LD, links, em dashes, banned words)
NDA_DENYLIST=/tmp/claude-0/-home-user-mubashir-rehman-github-io/41585b87-f6f9-574d-8c84-805a7593c658/scratchpad/nda-denylist.txt npm run build   # also scans for forbidden names
npm run tokens         # regenerate src/styles/tokens.css from design/tokens.mjs
node design/tokens.mjs # contrast report; must show 0 failures
npm test               # vitest
npm run lint
(npx astro preview --port 4321 >/dev/null 2>&1 &)     # start preview in its OWN command
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node scripts/viewport-check.mjs   # 7 pages x 13 viewports, no horizontal overflow
```
- Do **not** run `pkill -f "astro preview"` in the same command as anything else (it kills the shell). If you must restart preview, kill it alone, then start it in a separate command.
- Playwright: launch with `executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"`. Never run `playwright install`. Put screenshot scripts under the repo (e.g. a gitignored `tmp/`) or `/tmp/claude-0/.../scratchpad/`, and run them from the repo so `playwright` resolves.
- Screenshots per phase: home, `/projects/`, `/about/`, one case study, at 1280×590 light, 1366×625 dark, 390×844 dark, 320×640 light. Save to `/tmp/claude-0/-home-user-mubashir-rehman-github-io/41585b87-f6f9-574d-8c84-805a7593c658/scratchpad/shots/v2/`.
- Push: `git push -u origin claude/vibrant-meitner-9qdgx8`. Retry on network error up to 4 times with backoff (2s, 4s, 8s, 16s). Never push to `main`, never force-push.

## 7. Definition of done

- Home contains only §3.2 items; résumé + email visible above the fold at 1280×590, 1366×625, 390×844.
- Three selected-work rows with real mini diagrams and incident markers, correct in light and dark; three Incident blocks.
- `/about/#rules` shows all nine rules with source links; home shows four.
- Nav is wordmark + label, Work, Writing, About, Contact + theme toggle.
- All gates pass: build (25 pages), denylist, viewport matrix, 0 contrast failures, tests, lint no worse than before.
- No new facts, numbers or names; no em dashes; no new colours or fonts; no new runtime JS beyond what exists.
- `global.css` is smaller or no larger than before, with dead rules removed.
- `docs/redesign/v2/NOTES.md` records decisions made and anything deferred.
