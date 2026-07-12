# Design System — MASTER (Global Source of Truth)

> Generated via the `ui-ux-pro-max` skill (design-system engine + domain searches), synthesized
> and user-approved 2026-07-12. **Direction: "Indigo Violet Premium × Soft Modern" (C colors + D shapes, user-picked 2026-07-12).**
> Any page-specific deviations live in `design-system/pages/<page>.md` and override this file.

## Positioning

Jobs-first portfolio (recruiters/hiring managers) with a clear client path (services).
Tone: quiet confidence, content-first, senior. **Anti-patterns (from skill): corporate
templates, generic layouts, AI-gimmick styling, heavy chrome.**

## Pattern (landing)

Hero → metrics strip (proof) → featured case studies (the NDA HL7 platform, HireTrack) → role tracks ×4
→ projects → experience → publication → services teaser → contact.
One **primary** CTA per screen (`primary-action`): hero primary = "Download Résumé";
"View Work" / "Hire Me" are visually subordinate (ghost/outline).

## Color tokens (semantic — never raw hex in components)

Base: indigo-violet identity on deep blue-black (dark) / indigo-tinted off-white (light).
Light is the DEFAULT theme (recruiter-friendly); dark is the premium variant.
Both themes must independently pass 4.5:1 body / 3:1 large (`color-accessible-pairs`).

| Token | Light | Dark |
|---|---|---|
| `--background` | `#FAFAFD` | `#0B0D19` |
| `--foreground` | `#12142E` | `#EEEFF7` |
| `--card` | `#FFFFFF` | `#171A31` |
| `--muted` | `#EEEDF8` | `#1E2140` |
| `--muted-foreground` | `#565A75` | `#A5A9BF` |
| `--border` | `#E2E1F0` | `#2E3256` |
| `--primary` (CTA + links) | `#534AB7` | `#7F77DD` |
| `--secondary` (solid alt button) | `#12142E` | `#EEEFF7` |
| `--gradient-from → --gradient-to` | `#4F46B5 → #AB3A6B` | `#AFA9EC → #ED93B1` |

Accent application: eyebrows, metric values, links, primary CTA, availability badge (tonal
`bg-primary/10` pill), active nav. Gradient (`.text-gradient`) is rationed to the Home hero
name and role-page headlines. `.hero-glow` = soft radial indigo wash on hero sections.
`.glow-primary` = dark-mode-only CTA glow.

## Typography

- **Headings:** Inter 600–700, tight tracking (−0.02 to −0.04em). Display uses
  `clamp(2.5rem, 6vw, 4.5rem)` — large but not billboard.
- **Body:** Inter 400, 16px min, line-height 1.6, measure 60–75ch (`line-length-control`).
- **Technical accents:** JetBrains Mono 500 for eyebrows/labels (uppercase, +0.08em tracking),
  metric values, code, and the logo. `tabular-nums` on all metrics (`number-tabular`).
- Type scale: 12 / 14 / 16 / 18 / 21 / 28 / 36 / 48+clamp.
- Load via `@fontsource` or Google Fonts with `font-display: swap`; preload only the two
  critical weights (Inter 400/700 latin) (`font-preload`).

## Spacing & layout

- 4/8px rhythm; section vertical tiers 48 / 80 / 112px desktop, 40 / 56 / 80 mobile.
- Container `max-w-6xl`; breakpoints 375 / 768 / 1024 / 1440, mobile-first.
- Fixed navbar height 64px — every page reserves `padding-top` for it (`fixed-element-offset`;
  this was rejection bug #1 last time).
- z-index scale: 0 / 10 / 20 / 40 / 100 (nav) / 1000 (modal).
- Prefer `min-h-dvh` over `100vh`.

## Effects & motion

- Shadows: one consistent 3-step elevation scale, subtle (`elevation-consistent`). Glow only via `.glow-primary`/`.hero-glow`, dark mode.
- Radius (soft-modern): 16px cards (`rounded-lg` = `--radius: 1rem`), pills (999px) for ALL buttons and chips.
- Motion: 150–300ms, ease-out enter / ease-in exit; scroll-reveal via CSS only; stagger 30–50ms;
  1–2 animated elements per view max; full `prefers-reduced-motion` support. No parallax.
- Press feedback: subtle scale 0.98 on tappable cards/buttons.

## Iconography & imagery

- **Lucide SVG only — no emoji as icons** (`no-emoji-icons`). One stroke width (1.5px) everywhere.
- Images through `astro:assets` `<Image>` with explicit dimensions (CLS), WebP/AVIF,
  `loading="lazy"` below fold, descriptive `alt`.

## Accessibility floor (blocking, not aspirational)

Contrast 4.5:1 both themes · visible focus rings (2px, `--color-ring`) · keyboard-navigable
nav/filter/forms · heading hierarchy without skips · touch targets ≥44px, ≥8px apart ·
labels visible on all form fields, errors below field · skip-to-content link.

## Stack rules (Astro)

Static HTML at build from `src/data/*.json`; React only as small islands (AskMe, theme toggle,
contact form). `client:visible` for below-fold islands. No `client:only` pages — every route
ships a full `<body>` (the Phase-5 fix).
