---
name: site-shots
description: Take screenshots of the built site for the owner to review (full pages, first screen at the owner's laptop size, phones, dark and light). Use whenever a visual change needs the owner's approval before going live.
---

# Screenshots for owner review

The owner approves visual changes from screenshots. Screenshots go to the session scratchpad, never into the repo.

```bash
S=<scratchpad>/shots   # outside the repo
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome

node scripts/qa/shots.mjs $S /changed/page/               # full page, dark + light, 1440 + 390
node scripts/qa/shots.mjs $S --fold /changed/page/        # first screen only, incl. 1536x710 (owner's laptop at 125%)
node scripts/qa/shots.mjs $S --phone-only /changed/page/  # phones only
```

With no paths it shoots the key pages (home, work, a case study, about, services, a role page, writing, a post, contact, 404).

## Preparing images

- Full pages are long. Slice desktop pages into 1700px-tall pieces, and tile phone pages side by side in 2000px columns, before reading them; one tall image wastes context.
- Look at the image yourself first. Fix what is wrong before sending; do not send a known problem.
- Send with SendUserFile (`display: render`), at most a few images per message, with a one-line caption saying what to look at.
- Images over 8000px are scaled down on send; tile them instead.

## What to check before sending

- Same card heights and title position on every inner page (the `pagetop` gate checks this; trust it).
- Nothing cut off in the first screen at 1536x710.
- Light and dark both look like one brand; the portrait matches the theme.
- No stray characters, no sideways scroll (the script prints a warning when a page scrolls sideways).
