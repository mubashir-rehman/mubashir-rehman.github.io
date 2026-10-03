# Redesign v3: the journey home page

Owner-approved direction: mockup "F" (bento cards, monograph sections, gradient headline, warm type, icons).
Built by the advisor session directly. Branch `claude/vibrant-meitner-9qdgx8`; nothing ships to `main` until the owner
has seen screenshots of the real build.

## What the owner asked for

- A site with feel, not a document: one type scale, cards with visual weight, real images.
- Dark and light must feel like the same brand (one palette, mirrored).
- The home page leads the visitor on a journey: what I deliver → how I think (broken systems, and systems that do not
  exist yet) → the path so far → the work → the toolbox → contact. No personal hardship; the story is capability.
- Warm, non-robotic typography: Bricolage Grotesque (display) and DM Sans (text). No uppercase monospace labels.
- Line icons in tinted tiles (Lucide, ISC licence).
- Photo always on a dark card in dark mode; a separate light portrait in light mode (pending from the owner).
- HireTrack screenshot follows the theme; The Quetta Tea 2.0 screenshot as is.
- Phone layout is a later pass; this pass must still work on phones (no overflow, readable), not be polished there.

## Rules that do not change

No product or client names except The Quetta Tea 2.0 and HireTrack (tool vendors such as Retell, ElevenLabs and Telnyx
may appear in the toolbox, never next to the dental case study). No colleague names. No new facts or numbers: copy
comes from `src/data/**` and `src/content/**`. No em dashes. Every gate stays green: `npm run build` (check-dist with
the NDA denylist), the 13-viewport check, tests, lint, axe (0 violations).

## Implementation

1. **Design layer** `src/styles/v3.css`, loaded after `global.css`:
   fonts (self-hosted woff2 in `public/fonts`, OFL licences alongside); one 6-step type scale; the mirrored palette
   remapped onto the existing token names (`--bg-*`, `--text-*`, `--line-*`, `--accent*`, `--signal*`, `--surface`)
   so every other page inherits it; new `--card`, `--card2`, `--glow`; labels become DM Sans semibold (no mono,
   no uppercase); headings in Bricolage. Code blocks keep a monospace face.
2. **Data** (single sources, no hardcoded facts in templates):
   - `src/data/toolbox.json`: areas → daily / production / exposure, from the master CV's verified stack.
   - `src/data/approach.json`: the four "broken" steps and five "zero to one" stages, plus the three zero-to-one
     cases (each linked to its case study).
   - The path chapters live in `approach.json` (`path`), not `profile.json`: the home page merges the two VeritusLabs
     roles into one chapter, and the team size is filled in from `profile.json` at build time.
   - `problems.json`: an `icon` per problem.
3. **Components**: `Icon.astro` (inline Lucide paths), `Spine.astro` (vertical noise-to-flat trace), reuse
   `MiniDiagram`, `Trace`.
4. **Home page** `src/pages/index.astro` rewritten to the F structure. Images through `astro:assets`.
5. **Header and footer** restyled through the design layer only.
6. **Verify**: gates above, screenshots of home (dark, light; 1440 and 390) and a spot check of /projects/, /about/,
   a case study and a post to confirm the inherited palette and type do not break them.
7. **Later passes** (not this one): phone polish; inner pages rebuilt as cards; light portrait swap when provided.

## Status (2026-10-02)

Steps 1 to 6 built on the branch. All gates green: build with the NDA denylist, 13 viewports (the check now looks for
the hero's `.j-cta`; the headline scales with screen height so the résumé button stays in the first screen), tests,
lint, axe at 1440 and 390 in both themes on seven pages, zero `.js` files. Waiting for the owner's go-ahead.

## Phase 2: inner pages (owner request, 2026-10-02)

Every other page gets the same card language and, more importantly, a story: each page should answer one visitor
question and lead to the next page, the way the home page leads from "what I deliver" to "how I think" to "proof".
Today the inner pages only inherit the v3 palette and type; their layouts are still v2 (flat rows, 1px dividers).

| Page | Visitor question | Story to tell | Notes |
|---|---|---|---|
| `/projects/` | What has he built? | Group by the kind of problem solved, not by format: the five "If you have" problems as chapters, each with its case studies as cards (diagram, pillar, period, one line on what broke). Open source, smaller builds and research follow as their own cards. | Reuse `j-` card and section-head patterns; consider moving them to a shared stylesheet. |
| `/projects/[slug]/` (nine) | Can I trust this? | A case study reads as a journey: the situation (problem) → the system (explorable diagram) → the decisions (chose, rejected, why, cost as cards) → what broke (Notice, Trace, Fix, Rule, matching home section 02) → outcome → the rule. A progress spine down the side, like the path section. | Keep the explorable Diagram. The circular `--surface` shape behind the diagram looks odd in light mode; replace it with a card. |
| `/about/` | Who is he, and how does he work? | The path section expanded: each role as a chapter with what it added, then how I work (the rules as cards, each linked to the incident it came from), teaching and research, education. Portrait here as well. | Light portrait when the owner provides it. |
| `/services/` | Can he solve my problem, and how would we start? | Each problem as a card with icon, the "If you have / You get / Proof" pattern, then the zero-to-one stages as "how it starts". | Share data with home (`problems.json`, `approach.json`). |
| `/for/[role]/` (four) | Is he right for this role? | Role fit at a glance (practicalities card), evidence as case-study cards, the role's slice of the toolbox, FAQ. | Toolbox slice should come from `toolbox.json`, not a separate list. |
| `/journal/` and posts | What does he think about? | Index as cards with type (incident, lab note, build log, essay) and one-line lede; posts keep a calm reading column but adopt the new type, callouts and code blocks. | Prose must stay readable: no cards inside the article body. |
| `/contact/` | How do I reach him? | The home contact card as the whole page: email, location, availability, résumé choice by role. | |
| `/404` | Where now? | A short card with the trace and three ways back. | |

Cross-cutting: phone polish for every page (the home page included), one shared stylesheet for the card system,
and a screenshot plus axe pass per page before going live.

### Progress

- Done (dev branch): shared card system (`src/styles/cards.css`, loaded on every page; `SecHead.astro`), the
  case-study template (hero and at-a-glance cards, sticky spine of the six parts, decision cards with the choice
  highlighted, Saw / Cause / Fix incident cards, outcome with a built-with card, the rule card, next and contact
  cards) and the Work index (how-each-reads card, featured cards with diagrams and the problem each solves, more
  case studies, open source with the HireTrack shot, smaller builds, research). Fixed the circular diagram panel.
- Done (dev branch): About (rules as cards, timeline on the spine), Services, the four role pages, Writing
  index and posts, Contact, 404. Work page open source is three cards (HireTrack, this site, The Quetta Tea 2.0).
- Next: phone polish across every page.

### Rule: one page top

Every inner page opens with `PageTop.astro`: breadcrumb inside the main card, an eyebrow line, the h1, a lead,
actions pinned to the bottom, and one side card. Both cards are 430px tall from 1000px wide up, start at the same
y and put the h1 at the same y on every page (checked across all 22 inner pages at five widths). New pages must use
it; content that does not fit is cut down, not given a taller card.

### Rule: five link roles

Every text link is one of: inline (inside a sentence: accent, thin accent underline, weight of the text),
action (a standalone link that moves you on: accent, semibold, small, underline on hover), title (a linked
heading: heading colour, underline on hover), navigation (header, footer, breadcrumb, spine, pills: menu
styles), or on purple (white, white underline). Defined once at the end of `src/styles/cards.css`.

## Open items

- Agentic engineering case study: written as `agent-skills-and-model-routing` (rule 10) from the owner's account
  on 2026-10-02. Owner to confirm the period ("2026 to present") and status wording.
- Toolbox "Agentic engineering" card is on the dev branch; owner to decide whether it goes live now or with the case study.
- Hero tagline: the long `heroLine` is live; the shorter wording would let the headline grow.
- Light-mode portrait: done (Portrait.astro swaps by theme on home, About and Contact).
- DM Sans confirmed loading on the owner's machine (2026-10-03).
- Owner to revoke the Cloudflare API token when the work is done.
