# Journal Post Drafts — Planning Document

> **Status: PLANNING ONLY. Nothing here is publishable yet.**

## What this file is

Three outlines for technical journal posts, each built from **one already-documented achievement**
in `src/data/profile.json` / `src/data/projects.json`. The audit finding behind them:
`src/data/journal.json` has 3 posts, all from an 8-day window in March 2026 — one technical (842
words), one personal (560 words), one at 82 words that is too thin to rank or be cited. The journal
is the site's highest-leverage asset for AI answer engines because résumé pages *state* claims
("7 services, 60+ REST endpoints") while journal posts *prove* them. Answer engines and technical
recruiters weight first-hand specificity — a real number, a named trade-off, something that broke —
far above restated credentials, because specificity is hard to fabricate.

### The hard rule for this file

**These outlines contain no invented technical detail. They must not gain any.**

This repo runs under the integrity rules in [`task.md`](../task.md) ("Integrity rules —
reconciliation"): site claims are reconciled against the Master CV's honesty/verification notes.
Latency figures, uptime, cache-hit rates, concurrent users and onboarding-time claims were
*deliberately removed* from this site. Reintroducing that class of number through a blog post would
undo the entire integrity pass and turn a reconciled site back into an unverifiable one.

So:

- Every technical specific in these outlines is either (a) already stated in `profile.json` /
  `projects.json`, or (b) a **question** in the ⚠️ NEEDS-FROM-MUBASHIR block. There is no third
  category.
- **A post is not ready to draft until its NEEDS-FROM block is answered.** An outline written up
  with plausible-sounding filler numbers is worse than no post — it gets published, becomes a live
  claim, and contradicts the reconciliation.
- If Mubashir cannot remember or verify a number, the correct move is to **write the section
  without the number** (describe the mechanism and the trade-off), not to estimate one. "I don't
  have the measurement" is publishable; a guessed p95 is not.
- Keep the standing "never claim" list in force: no SOC2/HIPAA/compliance ownership, no
  full-model-ownership framing where the contribution was backend integration.

### Voice target

Match `rebuilding-for-mobile` (`journal.json`): first person, short declarative sentences, options
listed then one chosen with the reason stated, an explicit "what it cost" paragraph, a closing
"what is still rough" section that admits the unfinished parts. No hype adjectives. The post ends
by naming a limitation, not by claiming a win.

---

## Post 1 — LinkedIn multi-tier profile extraction

**Proposed title:** `How I Built a 3-Tier LinkedIn Profile Extraction Fallback` — 57 chars

**Proposed slug:** `linkedin-extraction-fallback-chain`
(permanent; avoid dates or version numbers in the slug)

**Excerpt / meta description (145 characters):**

> How I chained the LinkedIn API, a scraper, and an OpenAI fallback to fill in profile data — and what each tier does when the one before it fails.

**Target search intent:**
*"How do you reliably get LinkedIn profile data when the official API doesn't return enough?"* —
asked by backend engineers building enrichment/onboarding flows, and by anyone asking an AI
assistant how to design a multi-source data-extraction fallback. This post should be the best
first-hand answer on the internet to "what does a real production fallback chain for profile
enrichment look like, and how does it decide to fall through?"

**Documented source material (safe to state):** `profile.json` → `experience[0].highlights`:
"Multi-tier profile extraction (LinkedIn API → scraper → OpenAI fallback) for high-completeness data
enrichment"; `projects.json` → `brandmate` (AI-Powered LinkedIn Content Platform, primary DRF backend
developer, 7 backend services, 60+ REST endpoints).

### Section outline (H2s)

1. **What problem does a profile-extraction fallback chain actually solve?**
   Answer-first opening. The platform generates LinkedIn content for a user, so it needs a
   reasonably complete picture of that user's profile before it can produce anything useful. One
   source does not reliably give that. State the completeness problem in one paragraph, then the
   three-tier answer in the next.
2. **Why isn't the official LinkedIn API enough on its own?**
   What the API returns, what it doesn't, and what permission/scope reality forces. This is the
   section that establishes the post is first-hand — it needs the specific gap he hit.
3. **What does each tier do, and what triggers the hand-off?**
   Tier 1 API → tier 2 scraper → tier 3 OpenAI fallback. Describe each tier's job in one paragraph
   and the exact condition that moves to the next tier.
4. **How do you decide a tier has "failed"?**
   The interesting engineering question: a hard error is easy, a *thin but successful* response is
   not. Whatever completeness rule he used goes here — this is the reusable idea other engineers
   would cite.
5. **What does the OpenAI fallback infer, and what is it not allowed to invent?**
   The honesty boundary, and the one most relevant to this repo. An LLM asked to fill gaps in
   profile data will happily fabricate. Explain the constraint that stops it.
6. **How do you stop a fallback chain from becoming a latency trap?**
   Three sequential network calls in the worst case. Cover timeouts, whether it runs sync or in a
   background job, and what is cached/persisted so tier 3 isn't paid for twice.
7. **What broke in production?**
   The war story. Required — a post without this reads like documentation, which nothing cites.
8. **What I'd build differently**
   Closing "still rough" section in the voice of `rebuilding-for-mobile`.

**Tags:** `Engineering`, `Backend`, `AI`, `Django`
(`Engineering` already exists in `journal.json`; `Backend`, `AI`, `Django` are the three new tags
proposed across all three posts — see "Tag taxonomy" below.)

**Internal link:** `/projects/` (the AI-Powered LinkedIn Content Platform entry) and
`/for/ai-backend/`.

### ⚠️ NEEDS-FROM-MUBASHIR

Nothing below may be guessed. Each answer becomes a load-bearing sentence.

- **Which LinkedIn API were you actually calling** — the official Marketing/Sign-In-with-LinkedIn
  API, a partner API, or a third-party provider? Name it precisely; "the LinkedIn API" is the kind
  of vagueness that makes a post uncitable.
- **What specific fields did tier 1 fail to return** that forced tier 2 to exist? Name two or three
  real fields (e.g. full experience history? headline? skills?).
- **What is the exact fall-through condition?** Is it an HTTP error/rate-limit only, or a
  completeness score/required-field check on a successful response? If it's a threshold, what is
  the rule (which fields are required, how many must be present)?
- **What did the scraper tier actually scrape** — public profile HTML, a third-party scraping API,
  a headless browser? Which, and why that one?
- **What exactly does the OpenAI tier receive as input and produce as output?** Does it infer
  missing fields from partial data, normalise/clean what tiers 1–2 returned, or something else?
  Which model, and roughly when (models change fast — the post should date the choice).
- **What guardrail keeps the LLM tier from inventing profile facts?** A strict output schema?
  "Return null if unknown" instruction? A confidence field? Post-validation? Whichever it is, is
  the resulting field *marked* as inferred anywhere downstream?
- **How often did each tier actually get used?** If you have any real sense of the distribution
  ("most requests resolved at tier 1", "the LLM tier fired rarely"), say it qualitatively — do NOT
  produce a percentage unless it's a number you can point at.
- **What ran this — a synchronous request, Celery, or n8n?** And what were the timeouts per tier?
- **Is the extracted profile cached or persisted, and for how long?** What invalidates it?
- **What broke?** Concretely: a rate-limit that hit in production, a scraper that silently returned
  a login wall page, an LLM response that failed schema validation, a duplicate-enrichment storm?
  Name the failure and what you changed.
- **Why did you reject the obvious alternative** — paying for a commercial enrichment provider
  (Clearbit/Proxycurl-style), or just asking the user to fill a form? There is a real reason; it's
  the most quotable paragraph in the post.
- **What would you do differently now?** One paragraph, honest.
- **NDA / client-sensitivity check:** is this platform nameable, or does it stay described as "an
  AI-powered LinkedIn content platform" as in `projects.json`? Confirm before drafting — the
  wording changes throughout.

---

## Post 2 — Semantic search with Gemini embeddings + pgvector

**Proposed title:** `How I Built Semantic Search with Gemini and pgvector` — 52 chars

**Proposed slug:** `semantic-search-gemini-pgvector`

**Excerpt / meta description (146 characters):**

> Why I used Google Gemini embeddings with pgvector instead of a dedicated vector database, how the 768-d vectors are stored, and what Redis caches.

**Target search intent:**
*"Should I use pgvector or a dedicated vector database, and do Gemini embeddings work for
production semantic search?"* — the single most-searched decision in this space right now, and one
where nearly all existing content is vendor marketing or a toy tutorial. A first-hand post from
someone who shipped it twice (the LinkedIn content platform and the crypto-intelligence platform)
is exactly the artifact an answer engine reaches for.

**Documented source material (safe to state):** `profile.json` → "Semantic search using Google
Gemini embeddings + pgvector (768-d) with Redis caching"; `projects.json` → `brandmate`
(Gemini + pgvector search) and `crypto-intelligence` ("processing it with Google Gemini embeddings
and pgvector semantic search… token-bucket rate limiting and Redis caching", ~10 services, FastAPI,
Docker Compose). Note this is one technique deployed in **two** systems — that duplication is
itself a credible detail and worth saying plainly.

### Section outline (H2s)

1. **What was being searched, and why keyword search wasn't enough?**
   Answer-first. Name the corpus (per the data: user/profile + generated content on one platform;
   Telegram/Discord/X social messages on the other) and the query that keyword matching failed.
2. **Why Gemini embeddings instead of OpenAI's?**
   A real decision with a real reason — dimensionality, cost, latency, an existing Google
   dependency, or free-tier limits. State the reason, not a benchmark.
3. **Why pgvector instead of Pinecone, Qdrant, or Weaviate?**
   The highest-intent section. The honest answer for most teams is "the data already lived in
   Postgres and one fewer service is worth a lot" — if that's the reason, say it that way, and say
   at what scale it would stop being the right call.
4. **What does 768 dimensions actually cost you inside Postgres?**
   Row size, index type (IVFFlat vs HNSW), build time, and what the index does to write throughput.
   Concrete and mechanical — no performance claims needed to make this section valuable.
5. **What is Redis actually caching — embeddings, query results, or both?**
   Widely misunderstood, and the crypto platform also used Redis for token-bucket rate limiting
   against the embedding API. Separate those two jobs explicitly; they get conflated constantly.
6. **How do you keep embeddings fresh when the source content changes?**
   Re-embedding strategy, what triggers it, and how you avoid re-embedding everything on every
   edit. Cost control lives here.
7. **What I got wrong the first time**
   The section that makes it a journal post rather than a tutorial.
8. **Would I build it the same way again?**
   Including the "when would I move off pgvector" threshold.

**Tags:** `Engineering`, `Backend`, `AI`, `Postgres`

**Internal link:** `/projects/` (both the LinkedIn content platform and the crypto-intelligence
platform) and `/for/ai-backend/`.

### ⚠️ NEEDS-FROM-MUBASHIR

- **Which Gemini embedding model, exactly** (`text-embedding-004`, `gemini-embedding-*`, other)?
  768-d is documented — confirm whether that was the model's native dimension or a configured
  output dimension.
- **What is the actual unit being embedded** — a whole profile, a post, a chunk of a post, a social
  message? If chunked: what chunk size and overlap, and why those?
- **Roughly how many vectors** were in the table? Not a marketing number — an order of magnitude
  (thousands? hundreds of thousands?) is what makes the pgvector-vs-dedicated-DB advice usable, and
  the advice is meaningless without it. If you don't know, say "order of magnitude" and we'll write
  it as a range you're confident in.
- **Which index did you use — IVFFlat or HNSW — and what parameters** (`lists`/`probes`, or
  `m`/`ef_construction`/`ef_search`)? Did you tune them or take defaults? Taking defaults is a fine
  and honest answer.
- **Which distance operator** — cosine, L2, inner product? And why?
- **Did you actually evaluate Gemini against another embedding model, or was it chosen for a
  practical reason** (cost, existing GCP usage, free tier)? Be honest — "I picked it because we
  were already on Gemini" is more credible than an implied benchmark, and safer under the
  integrity rules.
- **What precisely does Redis hold?** Options: (a) query-string → embedding vector, (b) query →
  ranked result IDs, (c) rate-limit token buckets, (d) more than one of these. Which, with what TTL?
- **Was there a measured before/after on the Redis cache?** ⚠️ Only include a latency number if you
  have a real measurement you can point to. If not, the section describes *what* is cached and
  *why*, with no timing claims — that is the default, and it is fine.
- **What triggers re-embedding**, and does it re-embed the whole record or a diff?
- **Did you combine vector search with keyword/filter search** (hybrid search, metadata
  pre-filtering, `WHERE` clauses alongside the vector operator)? Pure vector search usually
  disappoints on its own — if you hit that, it's a strong section.
- **What went wrong?** Candidates worth checking your memory against: index build time on a large
  table, embedding-API rate limits during a backfill, a dimension mismatch after a model change, a
  cache returning stale results after content edits, cost surprise on a re-embed.
- **What is the scale at which you'd move off pgvector?** Your honest threshold.
- **Which of the two platforms should be the primary narrative?** Recommendation: lead with one and
  reference the other as "I did this twice" — but you pick, and confirm the NDA framing for each.

---

## Post 3 — ZKTeco biometric attendance sync in a Django HRMS

**Proposed title:** `Syncing ZKTeco Biometric Attendance into Django` — 47 chars

**Proposed slug:** `zkteco-biometric-attendance-sync`

**Excerpt / meta description (138 characters):**

> How I synced ZKTeco biometric punches into a Django HRMS for ~200 employees: the Web API, a multi-device schema, and the parts that broke.

**Target search intent:**
*"How do I integrate ZKTeco biometric devices with a Django/Python HRMS?"* — a narrow but genuinely
underserved query. Almost everything published on ZKTeco integration is forum posts and a couple of
unmaintained Python libraries. This is the post most likely to become **the** cited answer for its
query, precisely because the topic is unglamorous. It's also the strongest recruiter signal of the
three: hardware integration, dirty real-world data, and a live 200-person payroll depending on it.

**Documented source material (safe to state):** `profile.json` → "Migrated and extended a
Django-based HRMS for a ~200-employee workforce: biometric attendance sync (ZKTeco), reporting
endpoints, and zero-downtime rolling deploys"; `projects.json` → `horilla-hrms` ("Built attendance,
contract, and reporting modules, implemented ZKTeco biometric sync via Web API, designed a
multi-device biometric schema, and built monthly/day worksheet reporting endpoints. Deployed a
Dockerized system on DigitalOcean with Nginx, Celery background jobs, structured logging, and
zero-downtime rolling deploys"). `~200-employee HRMS` is on the **keep (defensible)** list in
`task.md`.

### Section outline (H2s)

1. **What does "biometric attendance sync" actually involve?**
   Answer-first: physical fingerprint terminals produce punch events; an HRMS needs attendance
   records; those are not the same thing, and the gap between them is the whole project. Name the
   scale (~200 employees) in the opening paragraph.
2. **Why the ZKTeco Web API instead of talking to the devices directly?**
   The alternatives are real: the raw device protocol via a `pyzk`-style library, pulling exported
   files, or the vendor's Web API. State which and why. Include what you gave up by choosing it.
3. **How do you model multiple devices without double-counting a punch?**
   The multi-device biometric schema is already documented — this section explains it. Employee ↔
   device-user-ID mapping, and what happens when someone badges at two doors.
4. **What happens when a device is offline, or its clock has drifted?**
   Where a naive integration dies. Backfill on reconnect, idempotency of re-pulled punches, and
   timezone/clock handling.
5. **How do raw punches become an attendance record the HRMS understands?**
   The transformation: pairing in/out, handling odd punch counts, missed check-outs, night shifts,
   and who resolves the ambiguous cases — code or a human via a UI.
6. **How do you run the sync without blocking the app?**
   Celery is documented. Covers schedule/interval, retries, structured logging, and how you know a
   sync silently stopped working — the monitoring question matters more than the scheduling one.
7. **How do you deploy this while people are clocking in?**
   Zero-downtime rolling deploys are documented, on DigitalOcean with Docker and Nginx. Explain what
   "zero-downtime" meant *mechanically* — describe the deploy procedure, don't claim an uptime
   figure (uptime claims are explicitly on the reconciliation drop-list in `task.md`).
8. **What I'd do differently**
   Closing.

**Tags:** `Engineering`, `Backend`, `Django`

**Internal link:** `/for/erp-hrms/` and `/projects/` (Enterprise HRMS Migration & Automation).

### ⚠️ NEEDS-FROM-MUBASHIR

- **Which ZKTeco device models / which Web API?** ZKTeco's ecosystem is fragmented (BioTime,
  ZKBioTime, ZKTeco Web API, raw device protocol). Name what you actually integrated against, and
  the version if you remember it. This single detail is what makes the post findable and credible
  to the exact person searching for it.
- **Push or pull?** Did devices push events to an endpoint, or did a job poll the API on an
  interval? If polling: what interval, and why that one?
- **What does the multi-device schema look like?** Which tables/models did you add, and what is the
  key that maps an HRMS employee to a device user ID? A simplified schema sketch or model snippet
  would make this the strongest section in any of the three posts.
- **What's the idempotency key on a punch?** How does a re-pull avoid inserting duplicates —
  a unique constraint on (device, user, timestamp)? A vendor-supplied event ID?
- **How many devices** were in play, and were they on one site or several?
- **How were timezones and clock drift handled?** Did you actually hit a drifted device, or is this
  a hypothetical you designed against? Say which — a designed-for-but-never-hit case is still worth
  writing, but it must be labelled as such.
- **What is the in/out pairing rule?** First punch in / last punch out per day? Strict alternation?
  And how do missed check-outs get resolved — auto-closed, flagged for HR, left blank?
- **Any real edge case from the ~200 people?** Night shifts crossing midnight, someone badging for a
  colleague, a failed enrollment, a device replaced mid-month and losing its user IDs. One concrete
  incident is worth more than the rest of the post.
- **What was the Celery schedule**, and what happened on failure — retry with backoff, dead-letter,
  alert? **How did you find out when a sync failed?** (Was there a real "we noticed on payroll day"
  moment? That's the story.)
- **What did "zero-downtime rolling deploy" mean mechanically** — two containers behind Nginx with a
  health check and a cutover? Docker Compose with a manual step? Describe the procedure. ⚠️ No
  uptime percentage — that's on the reconciliation drop-list.
- **What did the migration itself involve?** "Migrated" is doing quiet work in the CV line: migrated
  *from* what — spreadsheets, another HRMS, a self-hosted instance moving hosts? Did historical
  attendance data have to come across, and did it reconcile?
- **What broke, and what did it cost?** The honest version. If attendance was wrong for a pay
  period and you had to correct it, that's the most valuable paragraph on this entire site — it is
  the exact kind of specific nobody fabricates.
- **Client-sensitivity check:** is the ~200-employee client nameable, or does it stay anonymous as
  in `projects.json`? Confirm before drafting.

---

## Tag taxonomy

`journal.json` currently uses: `Engineering`, `Design`, `Meta`, `Mobile`, `Personal`, `Reflection`,
`Childhood`, `Gratitude`. Only `Engineering` and `Meta` fit technical posts.

Proposed addition — **four new tags total**, reused across all three posts, then held stable:

| Tag | Status | Used by |
| --- | --- | --- |
| `Engineering` | existing | all 3 |
| `Backend` | new | all 3 |
| `AI` | new | posts 1, 2 |
| `Django` | new | posts 1, 3 |
| `Postgres` | new | post 2 |

Resist adding one tag per technology. A tag that appears on exactly one post is a category of one
and does nothing for navigation or for topical-cluster signal. If a future post needs a fifth tag,
it should be because two or more posts will carry it.

---

## Recommendation on the `welcome` post

**Current state:** `/journal/welcome/`, "Why I Built This Portfolio", 2026-03-09, **82 words**. It
is one opening line, a three-bullet list, and a four-word philosophy. It cannot rank (far below any
useful length), cannot be cited (it contains no first-hand specific), and it currently *dilutes* the
journal — a three-post blog where one third is a stub reads as abandoned.

It also carries stale content:

- "I've shipped 7 microservices" — the reconciled site language is **7 backend services** (see
  `task.md`, volume-metrics decision). "Microservices" is the wrong word for what's described
  elsewhere and slightly overclaims the architecture.
- "led drone swarm systems" — the reconciled framing is **led a team of 4** building a drone swarm
  control system.
- "This site is version 1" — the site has since migrated to Astro, dropped the sakura theme, and
  removed Hobbies and Habits.

**Recommendation: expand it in place. Keep the slug. Do not retire the URL.**

Reasons:

1. `/journal/welcome/` is in the live sitemap and is one of only three journal URLs the site has.
   The site is **fully static on GitHub Pages** — there is no server, so there are no 301 redirects.
   Retiring the slug means either a 404 (worst: loses whatever index history exists and leaves a
   dead sitemap entry) or a hand-rolled meta-refresh + `rel=canonical` stub page, which is extra
   machinery to maintain forever in exchange for nothing.
2. The post's one real idea — *building in public, and why claims should be provable rather than
   stated* — is genuinely the thesis of this whole site and of the integrity pass. It deserves a
   real post, not a folding-in. It's also the natural place to link out to the three technical posts
   above, which turns the weakest URL into the journal's hub page.
3. Rewriting in place preserves the URL, the `BlogPosting` schema, and the date continuity.

**What the expansion should contain** (target 700–900 words, matching the technical post's 842):

- Answer-first opening: what this site is and who it's for, in the first two sentences.
- The provable-claims thesis: why the site reports **scope and ownership** rather than outcome
  metrics, and what got deliberately removed in the integrity pass. This is a genuinely unusual
  position for a portfolio and is the most distinctive thing on the site — it should be stated
  openly, not buried in `task.md`.
- What the site is built with and why static (Astro static HTML + React islands, GitHub Pages) —
  one section, links to `/projects/` (Personal Portfolio entry).
- What changed since March 2026: three themes → two, Habits and Hobbies removed, pages moved from
  a `client:only` React shell to server-rendered Astro HTML. Removing your own features and saying
  why is exactly the first-hand specificity this post currently lacks.
- Links to the three technical posts once they exist.

**Two small mechanical notes if you rewrite it:**

- `journal/[slug].astro` sets `dateModified: entry.date`. If you substantially rewrite a March post
  in 2026, consider adding an optional `dateModified` field to the entry and using it in the schema,
  so a rewritten post isn't advertised as unchanged since publication. (Code change — out of scope
  for this file, flagged only.)
- Separately, `rebuilding-for-mobile` has a whole section describing the **Habits** page, which no
  longer exists (removed 2026-06-27, per `task.md`). It's a dated post and rewriting it would be
  editing history — but a one-line editor's note at the top ("the Habits page described here was
  removed in June 2026 — here's why") would resolve the inconsistency honestly and is itself a
  small credibility signal. Your call.

---

## Publishing cadence and the per-post checklist

**Cadence.** The failure mode here isn't quality, it's the five-month gap. Three technical posts
published at a **sustainable one-every-3-to-4-weeks** beats three published in one week and then
silence — a steady dateline is what makes the journal read as active to a human, and repeated
crawls are what get it indexed. Suggested order:

1. **ZKTeco / HRMS** first. Least competitive query, highest chance of owning its search result
   outright, and the source material is the most concrete.
2. **pgvector / Gemini** second. Highest search volume and highest citation potential, so it should
   land once the journal already looks alive.
3. **LinkedIn fallback chain** third. Strongest engineering-judgment story, best rewarded once
   there's a body of work around it to link to.

Do **not** backdate posts to fill the gap. Publish with the real date; the gap is honest and a fake
dateline is the same category of error as a fake metric.

**Checklist every new post must satisfy:**

- [ ] **Exactly one H1 — and the post body must NOT contain it.** `src/pages/journal/[slug].astro`
      renders `entry.title` as the page `<h1>`. Markdown content must start at `##`. A `#` heading
      inside `content` creates a second H1 and breaks the document outline.
- [ ] **≥600 words.** The existing technical post is 842; treat that as the floor for these three.
      Below ~600 there isn't enough surface to rank or to quote.
- [ ] **Answer-first opening paragraph.** The first two sentences must answer the title's question
      directly, before any setup or story. This is what an answer engine lifts as the snippet, and
      it's what a recruiter reads before deciding to scroll.
- [ ] **At least one first-hand specific per H2.** A real name, a real constraint, a real thing that
      broke, or a real decision with its reason. A section with none of these is a section that could
      have been generated from the title — cut it or merge it.
- [ ] **At least one internal link** to a related project or role page: `/projects/`,
      `/for/ai-backend/`, `/for/backend/`, `/for/erp-hrms/`, `/for/full-stack/`, or `/about/`.
      (Note: there are no per-project deep pages — link to `/projects/` and name the project in the
      anchor text.)
- [ ] **Excerpt is 120–155 characters** and answers "what is this post about" as a standalone
      sentence. It becomes the `<meta name="description">` and the `BlogPosting.description`.
- [ ] **Tags come from the taxonomy above.** No one-off tags.
- [ ] **Integrity check before publish:** every number in the post is one Mubashir can point at.
      Anything sourced from memory or estimation is either removed or explicitly hedged in the text
      ("I didn't measure this, but…"). Cross-check against the drop-list in `task.md`: no uptime,
      no latency figures, no cache-hit rates, no concurrent-user counts, no onboarding-time claims.
- [ ] **NDA / client-naming confirmed** for any client work described.
- [ ] Ends by naming what's still unresolved, in the voice of `rebuilding-for-mobile`.
