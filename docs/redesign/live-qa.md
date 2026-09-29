# Live QA: https://mubashir-rehman.is-a.dev/ (2026-09-29)

Partial run. The curl checks are complete. The Playwright screenshots and the chat test could not run (see P1).

## Prioritized findings

1. **P1, QA blocked (not a site bug): screenshots and chat test not run.** Playwright's Chromium fails with `net::ERR_CERT_AUTHORITY_INVALID` on the site. The session's egress proxy re-terminates TLS, and the browser does not trust its CA even though the NSS store is reportedly set up. An attempt to pin the proxy CA in Chromium flags was denied by the session's permission classifier, so no further workaround was tried. Someone needs to either fix browser trust in this environment or run steps 3 and 4 from a normal machine. Neither the layout nor the console errors nor the AskMe answer have been checked.
2. No other issues found in the curl checks.

## What passed

- The new home page appeared on the second poll (about 30s).
- All 21 URLs in `sitemap-0.xml` return 200, and each `<link rel="canonical">` equals its `<loc>` byte for byte.
- `/about`, `/projects`, `/journal` and `/contact` (no trailing slash) return 301 to the slash form.
- `/journal/welcome/` serves a meta-refresh to `/about/`. `/journal/flowers-of-multan/` serves a meta-refresh to `/journal/`. `/for/` serves a meta-refresh to `/`. All three return 200.
- `/robots.txt` (634 B, allows all crawlers), `/llms.txt` (4.6 KB, sensible content), `/rss.xml` (application/xml, valid RSS header), `/ask-context.json` (26 KB JSON with the chat prompt) and `/sitemap-index.xml` (points at `sitemap-0.xml`) all return 200.
- The four resume PDFs (Backend, AI-Backend, Full-Stack, ERP-HRMS) return 200 with `application/pdf`, about 63 KB each.
- `/nonexistent-page` returns 404 with the new 404 page (title "Page Not Found | Mubashir Rehman", h1 "Nothing here.").

## Chat (AskMe)

Not tested (browser blocked, see P1). Not verified: whether an answer appears within 20s, and whether it cites a site path.

## Screenshots

| Page | Width | Scheme | Result |
|---|---|---|---|
| home, dental-ai-front-desk, about | 390 / 768 / 1440 | dark, light | Not captured (18 shots); no console error data |

No JPEGs were saved, so `docs/redesign/live-qa/` was not created.

## Part 2 (screenshots, console, chat)

Chromium launched with `ignoreHTTPSErrors: true` and worked, so P1 above is resolved for screenshots.

### Screenshots

10 of 12 JPEGs (quality 55) saved under `docs/redesign/live-qa/`. `about-390-dark` and `dental-390-dark` failed with `net::ERR_TOO_MANY_RETRIES` on navigation (proxy or network, not the site); they were not retried. 768 was not run in this pass.

Looked at `home-390-dark` and `dental-1440-light`. Both render cleanly: single column on mobile, no horizontal overflow visible, the dental system diagram and decisions/what-broke sections lay out correctly on desktop. The other eight were captured but not viewed.

### Console errors

- Home: none at 390 dark, 1440 dark, 1440 light. One `Failed to load resource: net::ERR_TOO_MANY_RETRIES` at 390 light.
- Dental: none in any of the three captured variants.
- About: the same `ERR_TOO_MANY_RETRIES` on a resource at 390 light and 1440 dark; none at 1440 light.

All errors are the proxy's retry failure on a sub-resource, intermittent and different per run, so treat them as environment noise, not a site bug. No JS exceptions were seen.

### Chat (AskMe)

- **Browser run: inconclusive.** The dialog opened with its intro and three suggestion chips, but my scripted input did not produce an answer within 25s (no answer text captured). A second attempt with the suggestion chip failed at page load with `ERR_TOO_MANY_RETRIES`. So the in-browser answer and whether it cites a site path are **not verified**.
- **Chunk check:** the home page loads `AskDialog...js`, which lazy-loads `/_astro/ask.fdC27QJC.js`. That chunk contains `api.groq.com`, and a Groq key (`gsk_...`) is **present** in it (not printed). This is the documented design (public free-tier key).
- **Direct API call: failed.** POST to `https://api.groq.com/openai/v1/chat/completions` with the extracted key, model `llama-3.3-70b-versatile`, and the `/ask-context.json` prompt returned HTTP 404 from this environment. Cause not established (possibly the proxy). No reply text, so citation behaviour is unverified.

### Follow-up

Run the chat check once from a normal machine: ask "What does he build?" and confirm an answer arrives and links a site path.
