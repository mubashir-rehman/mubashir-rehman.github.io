# Google SEO / GEO guidance — captured references

Snapshots of Google Search Central guidance, fetched **2026-07-12** to drive the
portfolio's visibility work. These are condensed, faithful summaries of the
official docs (not full copies) — always re-check the live URL for updates.

| File | Source (live) |
|---|---|
| [`seo-starter-guide.md`](./seo-starter-guide.md) | https://developers.google.com/search/docs/fundamentals/seo-starter-guide |
| [`creating-helpful-content.md`](./creating-helpful-content.md) | https://developers.google.com/search/docs/fundamentals/creating-helpful-content |
| [`ai-optimization-guide.md`](./ai-optimization-guide.md) | https://developers.google.com/search/docs/fundamentals/ai-optimization-guide |
| [`using-gen-ai-content.md`](./using-gen-ai-content.md) | https://developers.google.com/search/docs/fundamentals/using-gen-ai-content |

**Headline takeaways for this site** (full plan lives in `task.md` → "Phase 5"):
1. Google **ignores `llms.txt`** — it helps non-Google AI (ChatGPT/Perplexity/Claude) only. For Google, the lever is ordinary indexable HTML.
2. Google must **see the page as a user does** → the `client:only` React pages (About/Projects/Journal/Contact) render an **empty `<body>`** and are effectively invisible. Static-rendering them is the #1 visibility fix.
3. E-E-A-T is **not a direct ranking factor**, but Experience + Trust are what a personal site wins on: bylines, first-hand write-ups, honest/verifiable claims.
4. Add real **images with alt text** (site currently ships zero `<img>`).
