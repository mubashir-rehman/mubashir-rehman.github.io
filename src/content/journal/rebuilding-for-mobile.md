---
title: "Rebuilding the portfolio for mobile: a week of decisions"
seoTitle: "Rebuilding a portfolio for mobile"
description: "Rebuilding a desktop-first portfolio for mobile: splitting layouts by page, design tokens without a component library, and what I cut."
lede: "A desktop-first site does not become a mobile site with breakpoints alone. I split layouts by page, kept one data source, built design tokens without a component library, and cut anything a phone visitor would not use."
status: published
type: build-log
date: 2026-03-16
updated: 2026-09-29
tags: [Frontend, Architecture, Mobile]
note: "This is a build log of the March 2026 version of this site. The site has since been rebuilt as a static Astro site. Two ideas from this week survived: one data source, and a chat assistant grounded in that data."
rule: "Split what changes for different reasons. Keep the data in one place."
---

I shipped this portfolio a week ago. Then I spent the rest of the week rebuilding half of it.

It worked fine on desktop. On my phone it felt like reading a document, not using an app. The navbar was too small to tap comfortably, and the contact form asked for four fields a mobile visitor would never bother typing.

## The architecture decision

The first real decision was how to handle mobile layouts. The options were:

- CSS-only breakpoints: fast, but the markup gets messy when two layouts live in the same file.
- A `useMobile()` hook with conditional rendering: a middle ground.
- A page-level split, with mobile pages alongside desktop pages: full separation.

I chose the page-level split. If you want to change the mobile About page drastically six months from now, you should not have to read the desktop About page to do it. Separation of concerns is not just for backend systems.

The cost is real: any new page gets written twice. But the data stays shared, so content updates happen once. The presentation diverges; the source of truth does not.

## Design tokens without a library

I wanted Material Design 3 surfaces on mobile: large radii, tonal surface containers, a pill-shaped navigation indicator. The tempting path was a component library. I chose neither of the obvious ones: one fought the utility CSS I was already using, and the other added web components to a React tree for little gain.

Instead I extended the CSS variable system with surface tokens:

```css
--m3-surface-lowest:        270 24% 99%;
--m3-surface-low:           270 20% 96%;
--m3-surface:               270 20% 97%;
--m3-surface-high:          270 16% 92%;
--m3-surface-highest:       270 14% 88%;
--m3-primary-container:     265 80% 90%;
--m3-on-primary-container:  265 85% 20%;
```

Seven tokens per theme, and every theme got surface elevation for free. No library, no bundle cost, full control.

## The pages that needed the most rethinking

**Contact.** The desktop version had a four-field form above the fold. On mobile, nobody fills out a form standing on the street. The primary actions became full-width links that open email in one tap. The form moved into a secondary panel, available for visitors who want it and out of the way for everyone else.

**Projects.** I added a bottom sheet: tap an item, a sheet slides up with the full description and links, and the list stays visible behind it. No new page, no back button to manage, context preserved.

## What I cut

- **The footer on mobile.** The bottom navigation did its job.
- **Hardcoded metrics on the About page.** Four numbers lived in the markup instead of the data file, and one was wrong. That is exactly how duplicated copy drifts.
- **The hamburger menu.** Seven pages in a dropdown felt like a compromise. Four tabs in a persistent bar is a decision.

## The chat assistant

I added a chatbot that answers questions about my work. It runs on Groq's free API with a Llama 3.3 70B model. The résumé and project list are injected as the system prompt: no embeddings, no vector database, just context stuffing into a model with a large window.

It is not a product. It is a shortcut for a recruiter who wants to ask "has he worked with Django?" without reading the whole About page. The answers are grounded in the site's own data, and the model is told to admit when something is not in its context.

## What I got wrong

After a deploy, visitors with cached HTML hit "Failed to fetch dynamically imported module". I added two guards, but the root cause was the architecture: a client-rendered app with pre-rendering bolted on. I treated a structural problem as a bug to patch. The later move to a static multi-page site removed the whole class of failure.
