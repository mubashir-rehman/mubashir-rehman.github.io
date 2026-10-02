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
