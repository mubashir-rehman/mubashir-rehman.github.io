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

## 1. Triage of the external review

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
- **Invented principles** ("Deterministic first. Model second.", "Don't hide uncertainty", "If I don't know, I say I don't know"): not in the data. Use only the nine rules in `src/content/work/*.md` (`rule.n`, `rule.text`). If you think a rule is missing, ask the advisor; never add one.
- **Numbers the review invents or suggests** (10+ UAVs, ~10 services, etc.): never. Every figure must already exist in `src/data/*.json` or `src/content/**`.

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
[mark] Mubashir Rehman            Work   Writing   About            [theme]
```
- Wordmark (existing star mark + name) is the home link.
- Links: Work (`/projects/`), Writing (`/journal/`), About (`/about/`). **Contact and Résumé leave the nav.**
- Keep the theme toggle. Keep sticky behaviour and hide-on-scroll on phones (already implemented).
- Phones: one row if it fits at 320px; otherwise links on a second row as today. No hamburger.

### 3.2 Home (`src/pages/index.astro`), in this order and nothing else
1. **Hero** (left-aligned, 12-col grid, text spans ~7 cols, portrait ~3 cols on desktop)
   - Mono eyebrow: `profile.jobTitle` (e.g. `LEAD SOFTWARE ENGINEER`), small caps via mono, `--text-3`.
   - `h1`: `profile.heroLine` (keep the three-weight treatment, it is the site's signature).
   - One supporting sentence (shortened `profile.positioning` or `profile.roleLine`; pick the shorter, do not write new facts).
   - Meta row, mono: `Lahore, Pakistan · UTC+5 · Open to remote roles` (from `profile.location` + availability).
   - Actions: primary **Download résumé (PDF)**, secondary **Email me**, tertiary text link **See the work ↓** (anchor to selected work). Must stay above the fold at 1280×590 and 1366×625 (the owner's real viewport with 150% scaling) and at 390×844.
   - Headshot stays (human element), smaller, round, purple ring. On phones it sits beside the name/eyebrow, not above the h1.
   - The trace (`Trace.astro`) stays under the hero as the section divider.
2. **Selected work**: four artifacts, numbered `01` to `04` in mono:
   1. `dental-ai-front-desk` 2. `social-signal-intelligence-backend` 3. `erp-ai-agents` 4. `hiretrack`.
   - Layout: alternating asymmetric rows on desktop (text 5 cols / artifact 7 cols, then flipped). Single column on phones.
   - Each artifact: number, title, one line (`summary`, shortened only if the data provides a shorter field), mono meta row (`pillar · role (short) · period`), **a real system fragment** (see 3.4), a block titled "The interesting part" holding the first decision's `chose` + `why` (or the first `broke` item for HireTrack if better), and "Read the case study" link.
   - Below the four: one line, `+ 5 more case studies and 8 smaller builds →` linking to `/projects/` (counts computed from collections, never hardcoded).
3. **How I work**: the nine rules, but show **3 on home** (1, 3, 5 by default, i.e. "Read the number that does not add up", "Prove the path end to end before you tune the thresholds", "A partial result should look partial"). Big type, mono rule numbers, each links to the case study that earned it. Link: `All nine rules →` to `/about/#rules`.
4. **Currently**: 3 to 4 mono-labelled lines from `profile.timeline` / `profile.current` / `profile.education`:
   `NOW` Lead Software Engineer, TransData (leading five engineers) · `BEFORE` Team Lead, VeritusLabs · `RESEARCH` Springer CSSP 2025 (link) · `STUDIED` BS Computer Science, ITU. Link: `Full background →` `/about/`.
5. **CTA**: heading "Hiring for a backend or AI role?" (roles first), one line, Email + Résumé buttons, and a quiet small line `Or tell me about a system that needs fixing.` linking to `/services/`. No pricing, no "work with me".
6. Footer (3.8).

Remove from home: "Latest writing" panels (move to a one-line "Latest note: <title>" inside the Currently block, optional), the "Hiring for a specific role?" router (moves to footer), the "Questions about my work?" chat section (chat becomes a footer link).

### 3.3 Visual system (`design/tokens.mjs` → `src/styles/tokens.css`, and `src/styles/global.css`)
- **Width**: content max 1160px, 12-col grid with 24px gutters desktop, 16px side gutter on phones. Prose measure stays ~68ch.
- **Type**: Archivo for display and body (keep the variable width axis; the hero keeps its three widths). Martian Mono, uppercase, letter-spaced, `--fs-label` size, for: eyebrows, project numbers, meta rows, dates, rule numbers, table headers. Nothing else is mono.
- **Colour**: tokens unchanged in hue. Purple = the only UI accent. Gold = trace and at most one highlight per view. Neutrals from existing tokens. Keep the grey (dark) and camel (light) panel surfaces, but **only** as the artifact surface behind diagrams and as code blocks; everything else sits on the page background separated by 1px `--line-2` dividers.
- **Surfaces**: no shadows, radius ≤ 6px, no glass, no gradients.
- **Spacing**: generous vertical rhythm between sections (clamp ~64px to 128px), tight within a section.
- **Motion**: trace draw (existing), link underline and artifact hover (border/translate ≤ 2px), diagram node focus (existing). Everything respects `prefers-reduced-motion`. No scroll-triggered reveals, no counters, no parallax.
- Delete CSS that becomes unused (the file has grown by appending; consolidate as you go, do not append a new layer on top of old rules).

### 3.4 Project artifacts (the visual core)
- Reuse the existing diagram data (`diagram.nodes`, `diagram.edges` in work frontmatter) and layout (`src/lib/diagram.ts`). Build a **static mini diagram** component (`src/components/MiniDiagram.astro`): the same nodes and edges, compact, non-interactive, `aria-hidden` with a text caption (the diagram `caption`) for screen readers, rendered as inline SVG, correct in both themes.
- HireTrack has a public repo: its artifact may be the mini diagram (if it has diagram data) or a mono "pipeline" fragment built from its frontmatter. Never a stock or AI-generated image.
- The full interactive `Diagram.astro` stays on case-study pages.

### 3.5 `/projects/`
Four groups, each with a mono heading and a one-line intro:
- **Featured**: the four home artifacts, same component in a compact variant.
- **More systems**: the other five case studies as a divided list (title, one line, mono meta), not cards.
- **Smaller builds**: `builds.json`, a compact divided list.
- **Research**: the paper, as an artifact (title, venue, "My part:" from `profile.paper.contribution`, DOI + arXiv links, link to the ECG case study).
Optional filter by pillar only if it adds no more than a single row of plain text buttons; skip it if in doubt.

### 3.6 Case study pages (`/projects/[slug]/`)
Keep the current structure (it was just fixed: facts strip, problem beside diagram). Restyle to the new system: mono meta, dividers instead of panels except the diagram surface, section headings consistent with home. No content changes.

### 3.7 `/about/`
Order: short intro (existing bio, first paragraph as lead) → **How I work: all nine rules** (`id="rules"`), each with its source link → background timeline → teaching and research → education. Résumé + email actions near the top. It should read like an essay about the engineer, not a résumé dump. Keep the at-a-glance card but make it a compact mono-labelled list.

### 3.8 Footer (`src/components/Footer.astro`)
```
[mark] Mubashir Rehman
Lead Software Engineer. Backend systems, automation, and AI where it helps.
GitHub · LinkedIn · Email · Résumé · RSS
Role pages: Backend · AI backend · Full-stack · ERP and AI
Ask the site · Problems I solve                          © 2026
```
Compact, 3 short rows on desktop. The role links and `/services/` live here only.

### 3.9 Other pages
- `/journal/` and posts: restyle only (mono dates, dividers).
- `/for/<role>/`: restyle only; they remain targeted landing pages.
- `/services/`: restyle only; stays out of the nav; visually quieter than home.
- `/contact/`: keep (linked from footer and CTAs); restyle.
- `404`: restyle.

## 4. Phases and gates

Work strictly in order. **Do not mix phases.** At the end of each phase: build, run gates, take screenshots, commit, push the branch, then **stop and report to the advisor** (see §5). Wait for the advisor's go-ahead before the next phase.

| Phase | Scope | Must not touch |
|---|---|---|
| P0 Inventory | Read the code and data; list every home/about/projects element and where it will go; confirm the component list and any new frontmatter fields. No code changes. | everything |
| P1 Structure | Header, home order and content, footer, `/projects/` grouping, `/about/` order. Use existing styles; ugly is fine. | tokens, colours, fonts |
| P2 Visual system | Grid, width, type scale usage, mono metadata, dividers vs panels, spacing, CSS consolidation. | copy, data |
| P3 Artifacts | `MiniDiagram`, the four home artifacts, research artifact, compact variants. | other pages |
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
- Four artifact rows with real mini diagrams, correct in light and dark.
- `/about/#rules` shows all nine rules with source links; home shows three.
- Nav is wordmark + Work, Writing, About + theme toggle.
- All gates pass: build (25 pages), denylist, viewport matrix, 0 contrast failures, tests, lint no worse than before.
- No new facts, numbers or names; no em dashes; no new colours or fonts; no new runtime JS beyond what exists.
- `global.css` is smaller or no larger than before, with dead rules removed.
- `docs/redesign/v2/NOTES.md` records decisions made and anything deferred.
