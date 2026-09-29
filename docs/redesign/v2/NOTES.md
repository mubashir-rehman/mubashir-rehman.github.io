# Redesign v2: working notes

Status: P0 (inventory) complete. No code changed. Baseline measured on this branch before any edit:
build 22 pages + `check-dist` 25 HTML files OK, `node design/tokens.mjs` 0 failures, `npm run lint` clean,
`npm test` 3 passed (CLAUDE.md's "tests broken / lint errors" lines are stale), `global.css` 450 lines / 32,921 bytes
(the "no larger than before" budget for P2), Martian Mono loaded via `@font-face` but used only for `code/pre` today.

## 1. Data facts the plan depends on (verified in the files)

- Case studies: 9, `order` 1 to 9. `flagship: true` only on dental (1), social-signal (2), erp-ai-agents (3). HireTrack is order 8, `flagship: false`.
  Home currently renders flagships only, so "four" needs a data change (see D1).
- Rules present in frontmatter, n = 1..9, one per case study: 1 dental, 2 harness, 3 social-signal, 4 erp, 5 healthcare console, 6 aws, 7 multi-tenant, 8 hiretrack, 9 ecg.
  Home picks 1, 3, 5 as the plan says (dental, social-signal, healthcare console). Rule 8 ("Deterministic first, model second.") **does exist** in `hiretrack.md`; the plan's reject list quotes a similar phrase as invented. It is data, so it stays on /about only.
- `builds.json`: 8 entries (title, line, year, optional href, tracks). Fields `year` can be empty (self-hosted LLM entry).
- `profile.paper`: title, journal, publisher, year, doi, url, arxiv, authorship, contribution, result, caseStudy, citation. Everything the research artifact needs exists.
- `profile.heroLine` is an array of 3 strings (three-weight h1). `roleLine` (12 words) is shorter than `positioning` (21 words).
- `profile.location.timezone` is `"PKT (UTC+5)"`; `availability` is the long sentence "Open to remote roles in any timezone, and on-site work in Lahore."
- `profile.timeline[0]` TransData Lead (present), `[2]` VeritusLabs Team Lead. `current.teamSize` 5. `education` has degree, institution, place. No "ITU" or "CSSP" abbreviation exists in data.
- Diagram data: every case study has `diagram.caption`, `nodes` (3 to 7, ids, label, text), `edges`. HireTrack has 6 nodes, so it gets a real mini diagram (no mono-pipeline fallback needed).
- Hardcoded counts that violate "counts computed from collections": `/contact/` says "Nine case studies", home says "All nine case studies", `Header`/footer none. Fix in P1 by computing.

## 2. Element by element: current to target

### Header (`src/components/Header.astro`) [P1]
| Now | Target |
|---|---|
| brand (mark + name) | keep, is the logo |
| links Work, Writing, About, Contact | Work, Writing, About |
| theme toggle | keep (script unchanged: hide-on-scroll, focusin, theme) |
| primary "Résumé" button in `.nav__end` | remove (lives in hero, CTA, footer). `resume` prop of Header then unused by it; Base still passes it, harmless, drop the prop plumbing only if clean |

### Home (`src/pages/index.astro`) [P1 structure, P2 look, P3 artifacts]
| Current element | Disposition |
|---|---|
| `.who` headshot 64px + name + "jobTitle, city. 3+ years." | Headshot stays, round, ring (P2). Text becomes mono eyebrow = `jobTitle`. On phones sits beside eyebrow, not above h1 |
| `h1.statement--home` heroLine x3 | keep as is |
| Actions: Download résumé, Email me | keep, primary + secondary; add tertiary text link "See the work" anchoring to `#selected-work` |
| `p.hero__id` = positioning + "Open to remote roles." | one supporting sentence (roleLine, see D2) + mono meta row `Lahore, Pakistan · UTC+5 · Open to remote roles` |
| `p.router` "Hiring for a specific role?" | remove from home, moves to footer (already in Footer "Roles") |
| `.hero__side` panels of 3 flagships (`w.data.outcome`) | replaced by section 2 below |
| `<Trace />` under hero | keep as divider |
| "Latest writing" section (2 posts) | remove; optional one line "Latest note: title" inside Currently |
| "Questions about my work?" ask section | remove; chat becomes footer link (`data-ask-open` button) |
| NEW Selected work | 4 rows `01..04` (dental, social-signal, erp, hiretrack), asymmetric 5/7 cols alternating, artifact = MiniDiagram (P3; P1 uses a plain placeholder list of node labels or nothing), "The interesting part" = `decisions[0].chose` + `why`, link "Read the case study", tail line with computed counts (9-4=5 case studies, builds.length=8) |
| NEW How I work (3 rules: 1, 3, 5) | rule number mono, `rule.text` big, "From <title>" link to case study, link `All nine rules` to `/about/#rules` |
| NEW Currently | NOW / BEFORE / RESEARCH / STUDIED lines from `profile.timeline[0]`, `timeline[2]`, `paper`, `education`; link "Full background" to /about/ |
| NEW CTA | h2 "Hiring for a backend or AI role?", one line, Email + Résumé, quiet line "Or tell me about a system that needs fixing." to /services/ |

### Footer (`src/components/Footer.astro`) [P1]
| Now | Target |
|---|---|
| 4-column grid: brand blurb + email; Site (Work, Writing, About, Contact, Problems I solve); Roles; Elsewhere (LinkedIn, GitHub, Scholar, RSS, Résumé) | 3 short rows: brand + line; `GitHub · LinkedIn · Email · Résumé · RSS`; `Role pages: ...`; `Ask the site · Problems I solve` + `© year` |
| base row: (c), "Work under NDA is described by function...", Source link | keep (c) only; NDA sentence and Source link dropped per plan wireframe (see Q2). Scholar/ORCID/StackOverflow leave visible UI; they stay in JSON-LD `sameAs`. Contact page still reachable from CTAs and `mailto` |
| "Ask the site" | new `button.linkbtn[data-ask-open]` |

### /projects/ (`src/pages/projects/index.astro`) [P1 groups, P3 featured artifacts]
| Now | Target |
|---|---|
| h1 "Selected work" + lead; flat `.works` list of all 9 (title, summary, pillar, period); "Smaller builds" via `.builds` | 4 groups with mono headings + one-line intros: **Featured** (4, compact artifact variant; P1 = plain rows), **More systems** (5 others: aws, harness, healthcare console, multi-tenant... exact set: order 4,5,6,7 plus ecg is Research, see below), **Smaller builds** (`builds.json`), **Research** (ECG paper artifact) |
| Filter | skipped (plan: skip if in doubt) |

Group membership, derived from data: Featured = dental, social-signal, erp, hiretrack. Research = ecg-vascular-age-research (paper artifact, DOI + arXiv + case-study link from `profile.paper`). More systems = the remaining four: aws-backend-hipaa-eligible, ai-agent-engineering-harness, healthcare-integration-console, multi-tenant-saas-architecture. That is 4+4+1 = 9. The plan says "the other five case studies" for More systems; ECG is a sixth-of-nine wrinkle, see Q1. "Open source" group in the plan's intro (§1: Featured, More systems, Open source, Research) is not in §3.5's four groups; §3.5 wins (see Q1).

### /about/ (`src/pages/about.astro`) [P1 order, P2 look]
Current order: crumbs, h1 + lead(bio[0]) + actions + prose(bio[1..]) + glance card (dl) beside; Rules; Timeline; Teaching and research; education inside the last prose.
Target order: intro (h1, lead, actions) then How I work (all nine, `id="rules"`, each with source link) then background timeline then teaching and research then education. Changes: add `id="rules"` (existing anchors `#rule-N` per item stay, case pages link to them); move remaining bio paragraphs so intro is short (bio[1..] go under the intro or into the timeline lead, see D5); glance card becomes compact mono-labelled `dl`; education becomes its own short block. Note `hero`'s `#rules` link needs the section id, not only per-rule ids.

### Case study (`src/pages/projects/[slug].astro`) [P4 restyle only]
Structure kept. Uses classes `.cs-*`, `.facts-strip`, `.decision`, `.broke`, `.rule-line`, `.results`, `.tags`, `.next`, `.fig`/`.dg` (interactive Diagram). No content change. Hardcoded strings in template ("Email me about this build" etc.) are existing copy, kept.

### Other pages [P4]
- `/journal/` index (`.works--wide` list, dates via `panel__k`-style) and `[slug]` (`.post*`, `.prose`): mono dates, dividers.
- `/for/[role]/`: uses `.cs-top`, `.dl`, `.works`, `.tags`, `.qa`; restyle only.
- `/services/`: uses `.works`, `.steps`; restyle, keep quieter.
- `/contact/`: uses `.panels` aside; hardcoded "Nine case studies" (compute), keep page.
- `/404/`: restyle.
- `Crumbs`, `AskDialog`, `Icons`, `Trace`, `Diagram`: `AskDialog` unchanged (only its trigger moves). `Trace` unchanged.

## 3. Component list

Existing, kept: Base, Header (edit), Footer (edit), Crumbs, AskDialog, Trace, Diagram, Icons.
New:
- `src/components/MiniDiagram.astro` [P3]: reads `nodes`, `edges`, `caption`; uses `layoutWide`/`layoutNarrow` from `src/lib/diagram.ts` (already exported); static inline SVG, `aria-hidden`, sr-only caption. Needs a look at how `Diagram.astro` renders boxes to share path/box drawing, and CSS vars for both themes.
- `src/components/Artifact.astro` [P1 plain, P3 with diagram]: one work entry (number, title, one line, mono meta, fragment slot, "interesting part", link) with `variant="full" | "compact"`. Used by home and /projects/.
- `src/components/Rule.astro` (optional, tiny): one rule row, shared by home (3) and about (9). Inline if it stays under ~10 lines.
- `src/lib/work.ts` (helper, no UI): `featured` ordering, `interestingPart(entry)`, `shortRole(entry)` (= `role.split(":")[0]`, same rule the case page uses), so home and projects agree.

## 4. Data and schema additions proposed (all sourced from text already on the site)

1. `featured: z.boolean().default(false)` on `work` (or reuse `flagship`, see D1). Sourced: existing selection.
2. NO new copy fields. Everything else maps to existing fields:
   - one line = `summary` (<= 22 words, already shortened by schema);
   - meta = `pillar` + `role.split(":")[0]` + `period`;
   - interesting part = `decisions[0].chose` + `why` (all four, incl. HireTrack: "Code before the model"; first `broke` not needed);
   - caption = `diagram.caption`.
3. If hero meta wants "Open to remote roles" without the rest of `availability`: see Q3. Recommended: no new field, derive from the first clause of `availability`? That is string-splitting, fragile. Better a tiny new field `availabilityShort` in `profile.json`; the text already exists verbatim in the site's current hero ("Open to remote roles."), so no new fact.

## 5. Decisions made (P0)
- D1: Mark the four home works by setting `flagship: true` on `hiretrack.md` and using `flagship` as the featured flag (no new field). Effects to check in P1: `flagship` is read by home only (grep in P1 before changing; also llms.txt and ask-context if they read it).
- D2: Hero supporting sentence uses `profile.roleLine` (shorter). `positioning` stays for meta descriptions.
- D3: Currently shows full journal name "Circuits, Systems, and Signal Processing (Springer), 2025" not "CSSP" (abbreviation is not in data).
- D4: Interesting part uses `decisions[0]` for all four.
- D5: About intro = h1 + bio[0] lead + actions; bio[1] and bio[2] stay as a short prose block under the rules? Not decided in the plan: chosen default in P1 is intro then bio[1..] directly under it (keeps every existing sentence, no loss), rules next. Cheap to reorder.

## 6. Deferred / not touched
- Root `index.html`, `public/giscus-*.css`, `components.json`, `PUBLIC_GISCUS_*`, `projects.json` self-description: stale leftovers per CLAUDE.md; out of scope.
- CLAUDE.md lines about tests/lint being broken and `src/index.css` tokens are stale (tests pass, lint clean, tokens in `src/styles/tokens.css`). Left for the advisor.
