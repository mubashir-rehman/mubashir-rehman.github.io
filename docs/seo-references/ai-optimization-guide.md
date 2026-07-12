# AI Features Optimization Guide (AI Overviews / AI Mode) — key points

Source: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
Fetched: 2026-07-12

## How content surfaces in Google AI features
- **RAG:** Google retrieves relevant, up-to-date pages from its Search index to
  ground AI responses, with clickable links.
- **Query fan-out:** the model issues concurrent related queries to gather results.

## Eligibility / technical requirements
- Page must be **indexed and eligible to be shown with a snippet**.
- Must meet Search technical requirements; publicly accessible + crawlable.
- Snippet-blocking directives (`nosnippet`, `max-snippet`, `data-nosnippet`)
  reduce/remove AI-feature eligibility.

## ⚠️ No special files or markup — llms.txt is IGNORED
Direct quote: *"You don't need to create new machine readable files, AI text
files, markup, or Markdown"* — **including `llms.txt`**, which Google **ignores**.
- Structured data is **not** required for AI features (still a good idea for rich
  results).
- "Chunking" content into tiny pieces is **not** needed — Google understands
  multiple topics on one page.
- Do **not** rewrite content specially "for generative AI search."

## Content recommendations
- Create it yourself from what you know; unique viewpoint that stands out.
- Follow the "helpful, reliable, people-first" guidance.
- Beat **commodity content** with expert/experienced takes beyond common knowledge.
- Include high-quality images and video.
- Write for humans; clear structure with paragraphs, sections, headings.

## Avoid
- Separate page per query variation → **scaled content abuse** spam policy.
- Inauthentic "mentions" farming.

## Measurement
- Search Console **Generative AI performance report**.
- No third-party tool has access to Google's internal ranking/AI systems.
