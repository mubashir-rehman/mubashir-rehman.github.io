# Redesign brief

The single input every role on this project works from. If a decision contradicts this file,
the decision is wrong or this file needs updating first.

## The person

Mubashir Rehman. Software engineer, 3+ years full-time, Lahore, remote-first. Backend-focused,
with his edge where **backend, AI and automation meet**.

The recurring pattern in his work:

> Find a real, messy problem. Understand the system underneath it. Design it, automate it,
> ship it, then make it reliable.

Traits the site should *show* (never state as adjectives):

- **High agency.** Goes from idea to architecture to deploy to debugging without waiting on others.
- **Systems thinker.** Interested in the seams: API, database, queue, model, external service,
  business workflow. Cares about failure modes, boundaries, auditability.
- **Applied AI, not AI hype.** AI is one component inside a useful end-to-end workflow. Not
  "chatbot developer". Likes running and controlling things himself (self-hosted inference).
- **Evidence over theatre.** Prefers a modest, defensible claim to an impressive fragile one.
- **Leader through the work.** Technical ownership, architecture, mentoring, code review,
  shipping. Not management language.
- **Teacher.** Five semesters as an OS teaching assistant. Explains things clearly.

## Audiences, in priority order

1. **Recruiter / HR.** Six-second scan, often on a phone from LinkedIn. Needs: role fit, years,
   location and remote, core stack, résumé PDF, contact.
2. **Hiring manager / CTO / tech lead.** Two to ten minutes. Needs: depth, judgement,
   architecture, trade-offs, incidents handled, writing, code.
3. **Founder / CEO / direct client.** Needs: can he solve my problem, reliably, and communicate.
   **Keep this path low-profile.** No freelance or agency language anywhere; the site is
   employment-first. A quiet "open to select engagements" is the ceiling.
4. **Search and answer engines** (Google, Bing, ChatGPT, Perplexity, AI Overviews). Need clean,
   consistent, structured, quotable facts.

## Voice

- An intelligent engineer talking to another intelligent person. Direct, concrete, candid,
  a little edge. Confident without arrogance.
- **Fewer words, more signal.** Every section has a word budget. Cut until it hurts, then stop.
- **No em dashes** anywhere in site copy.
- Banned: "passionate", "innovative solutions", "cutting-edge", "digital transformation",
  "revolutionizing", "leveraging", "spearheaded", "AI enthusiast", "Senior" as a self-label.
- Seniority is shown through scope, ownership, decisions and systems built.
- Candidate hero line (from his own description of himself):
  *"I like difficult systems. I like figuring out why they break. Then I like making them boring."*

## Look and feel

- **Colours, in order of dominance: black, purple, blue.** Dark-first.
- A technical workshop, engineer's notebook or lab. Not a brochure, not a SaaS landing page.
- Typography-led, minimal, high signal, intentional whitespace, slightly unconventional.
- **Some interactivity**, used where it explains something (e.g. a system diagram you can
  explore). A strict interaction budget so no visitor feels overwhelmed.
- **One consistent design language** across every page, component, diagram and social card.
- Avoid: stock photos, gradients everywhere, glassmorphism, 3D blobs, AI clichés (brains,
  circuits, sparkles), skill bars, logo walls, walls of text, card overload.

### Personal flavour: implicit only, never named

The site is fully professional. No hobbies, no anime, no reading lists. Personality may appear
only as design or writing *devices* that people who know him would recognise. Candidates to
consider (the design and content leads decide which, if any, earn a place):

- Multan's blue-pottery / tile geometry as a restrained pattern or motif source.
- Japanese-style restraint: deliberate empty space (*ma*).
- Numbered principles ("rules") as a writing and layout device.
- Honest "what I got wrong" sections: self-examination as a professional habit.
- Series and arcs for long stories.

## Claims policy

- Only claims marked `verified` or `claimed` in the master-resume record. `unverified` and
  `disputed` never appear. No invented metrics. (Running as a deliberate test.)
- **NDA: no client or internal product names.** Describe work by function
  ("an AI front desk for dental clinics"). **Exceptions that may be named:** The Quetta Tea 2.0
  (QT20) and HireTrack (the job-application tracker).
- No freelance-marketplace or agency framing.
- Employer names (TransData, VeritusLabs, ITU, GameBole) are fine.

## Hard technical constraints

- Static Astro site on GitHub Pages. No server. Canonical domain `mubashir-rehman.is-a.dev`.
- Existing SEO rules in `CLAUDE.md` stay: trailing slashes, canonical equals sitemap `<loc>`,
  one `<h1>`, titles ≤ 60 chars (including the suffix), descriptions ≤ 155 chars,
  images via `astro:assets`.
- Existing URLs carry search equity. Keep them where possible; any removed URL needs a redirect.
- WCAG 2.2 AA in every theme.
