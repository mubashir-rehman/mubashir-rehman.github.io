---
name: site-design
description: The portfolio's design language (v3) - card system, page top, link roles, type scale, phone rules, colour use, icons, portrait and social card. Use before adding or restyling any page, component or style, so new work matches without a fresh audit.
---

# Design language (v3)

Full history and rationale: `docs/redesign/v3/PLAN.md`. This is the working summary.

## Building blocks

- **Styles:** `src/styles/v3.css` (fonts, palette mapped onto token names, type scale) then `src/styles/cards.css` (every page; classes prefixed `j-`). Put new styles in `cards.css` with a labelled block. Do not edit `tokens.css` by hand.
- **Cards:** `.j-card` in a 12-column `.j-grid`, 24px radius, 1px line, no shadows. Section heads: `SecHead.astro` (gradient numeral + h2 + one line).
- **Page top:** every inner page opens with `PageTop.astro` (breadcrumb inside the main card, eyebrow, h1, lead, actions; one side card in the `side` slot with class `pt-side`). Same height and h1 position on every page from 1000px up. If content does not fit, cut the content; never make the card taller. The `pagetop` gate enforces this.
- **Portrait:** `Portrait.astro` only. It is the home page's LCP: a `<picture>` picks the photo for the system theme at `fetchpriority="high"`. Never add a second eager copy.
- **Icons:** `Icon.astro` with names from `src/icons/lucide.json` (Lucide, ISC). To add one, copy the inner SVG of `lucide-static`'s icon into the JSON; do not add a library.
- **Grid edge:** header, cards and footer share one container (`--container: 1200px` plus gutters).

## Type

Bricolage Grotesque for headings, DM Sans for text and labels, monospace only for code. One six-step scale: `--t-display`, `--t-h2`, `--t-h3`, `--t-lead`, `--t-body`, `--t-small`. Labels are sentence case, never uppercase mono.

## Link roles (every text link is exactly one)

| Role | Where | Look |
|---|---|---|
| Inline | inside a sentence | accent, thin accent underline, weight of the text |
| Action | standalone "move on" links (Read the case study →, Proof:, Code) | accent, semibold, small, underline on hover |
| Title | a linked heading | heading colour, underline on hover |
| Navigation | header, footer, breadcrumb, spine, pills | menu styles |
| On purple | inside purple cards | white, white underline |

Defined at the end of `cards.css`. `node scripts/qa/links.mjs` shows drift.

## Colour

Purple is the one UI accent. Gold is only for traces (hero trace, spine, the case-study progress line). Dark and light are the same palette mirrored, so both must look like one brand. Body text contrast must pass axe.

## Phones (<= 600px)

One scale (about seven sizes per page), icons beside the line they label, 20px card padding (photo, screenshot and trace cards stay edge to edge), every standalone link at least 24px tall, the email button on one line. Long lists fold with a checkbox + label (no JavaScript, one copy in the page), as in the toolbox.

## No JavaScript

Pages ship zero `.js` files. Interactions use CSS (checkbox toggles, `:target`, `<details>`). The only script on the live site is Cloudflare Web Analytics, injected at the edge.

## Social card and icons

`node scripts/og.mjs` regenerates `public/og/default.png`, the favicon and the touch icon in the v3 palette. Re-run it when the headline or palette changes.
