---
name: site-qa
description: Run every quality gate for this portfolio in one pass (build gate, tests, lint, zero JavaScript, 13-viewport layout, page-top consistency, axe accessibility). Use before any commit that changes pages, styles, data or content, and before asking the owner to go live.
---

# Site QA

One command runs the whole chain. Do not re-derive individual checks; run this and read the summary lines.

```bash
# 1. Preview server (once per session; it serves dist/public live, no restart needed after rebuilds)
curl -s -o /dev/null http://localhost:4321/ || (npx astro preview --port 4321 > /dev/null 2>&1 &)

# 2. Build with the post-build gate. NDA_DENYLIST points to a private file OUTSIDE the repo.
NDA_DENYLIST=<path outside the repo> npm run build 2>&1 | tail -1

# 3. Everything else (tests, lint, zero-js, viewports, pagetop, axe)
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npm run qa 2>&1 \
  | grep -E 'Tests|error|zero-js|viewport-check|pagetop|axe:|problem|violation'
```

In cloud sessions set `CHROME_PATH` as above; locally omit it and Playwright uses its own browser.

## Expected summary lines

- `check-dist: N HTML files OK (NDA denylist applied)`
- `Tests  N passed`, no lint `error`
- `zero-js: OK`
- `viewport-check: 7 pages x 13 viewports OK`
- `pagetop: N inner pages x 5 widths OK`
- `axe: N pages x 2 themes x 2 widths, 0 violations`

Any other output is a failure to fix, not to report and move on.

## Targeted checks (only when the change calls for them)

| Changed | Run |
|---|---|
| Phone layout | `node scripts/qa/phone.mjs [paths]`: font sizes, narrowest text, tap targets under 24px |
| Links or link styles | `node scripts/qa/links.mjs`: one line per distinct link style; a new group means drift from the five link roles |
| Portrait or anything above the fold on home | `node scripts/qa/lcp.mjs`: the shown photo must download at High, one photo per default visitor |
| Accessibility of specific pages | `node scripts/qa/axe.mjs /path/ /other/` |

## Rules

- The denylist file holds private names. Never copy it into the repo, never print its contents, never commit it.
- If the denylist is not available in the session, run the build without it and say so; do not invent names to check.
- `check-dist` also fails on em dashes, banned marketing words and leftover template code such as `))}` in visible text.
