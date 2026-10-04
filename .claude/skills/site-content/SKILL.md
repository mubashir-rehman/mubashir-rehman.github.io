---
name: site-content
description: Rules and checklist for changing any words, facts or data on the portfolio (case studies, posts, profile, toolbox, roles, llms.txt). Use before editing src/data, src/content or any visible copy, and when adding a case study.
---

# Content rules

## Where facts live (never type a fact into a template)

| Fact | Source |
|---|---|
| Identity, role, location, links, résumés, timeline, paper | `src/data/profile.json` |
| Home "what I deliver" problems (+ icon) | `src/data/problems.json` (also feeds /services/) |
| Broken-system steps, zero-to-one stages and cases, path chapters | `src/data/approach.json` |
| Toolbox (daily / production / exposure / earlier) | `src/data/toolbox.json` |
| Role pages | `src/data/roles.json` |
| More builds, open source extras | `src/data/builds.json` |
| Case studies | `src/content/work/*.md` (frontmatter only; schema in `src/content.config.ts`) |
| Posts | `src/content/journal/*.md` (`status: published` to build) |

`llms.txt`, the sitemap, RSS, JSON-LD and the chat context regenerate from these. Counts in copy come from `numWord()` in `src/lib/text.ts`, never hardcoded.

## Guardrails (owner decisions; do not relax without asking)

- **No client or internal product names.** Only "The Quetta Tea 2.0" and "HireTrack" may be named as projects. Employers on the timeline (TransData, VeritusLabs, ITU, GameBole) are fine.
- **No colleague names.** Ever. The private denylist the build checks against covers known names.
- **No side ventures or freelancing.** Keep it low profile: no pricing, packages or services pitch.
- **No new facts or numbers.** Every claim must trace to the owner's own account or the private drafts repo. If a number is not sourced, leave it out. Results that describe practice, not outcomes, say so ("I have not measured…").
- **No em dashes** in visible copy (the build fails on them). No marketing words (see `BANNED` in `scripts/check-dist.mjs`).
- **Voice vendors** (Retell, ElevenLabs, Telnyx) may appear in the toolbox, never next to the dental case study (it says "Voice AI APIs").
- **Excluded from the toolbox:** n8n (retired), MindsDB and Databricks (claimed only); say "HL7 integration", not the engine's product name.
- **Email** stays out of `llms.txt` (scrapers). The site shows it on pages.
- Do not write defensive or self-justifying lines (for example, how long work took). State the work; let it stand.

## Adding a case study

1. Copy the frontmatter shape of an existing file in `src/content/work/`; the schema limits title to 60 chars, summary to 22 words, SEO title to 42, description to 155.
2. `pillar`: Systems, Applied AI or Ownership. `order` sets its place on the Work page; `flagship: true` only for the three featured ones.
3. Diagram: 3 to 7 nodes, each `text` says what it does and how it fails. Decisions: 2 or 3, each with chose / rejected / why / cost. `broke`: real incidents only (symptom, cause, fix), else `brokeNote`.
4. A `rule` gets the next number; it appears on /about/ and in `llms.txt` automatically.
5. Link related case studies both ways (`related`).
6. Ask the owner to confirm `period` and `status` wording before going live.
7. Run the site-qa skill.

## Secrets

Never put credentials, tokens, `.env` values, the NDA denylist or anything from the private drafts repo's sensitive files into this public repo or its commit messages.
