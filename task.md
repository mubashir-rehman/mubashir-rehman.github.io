# Portfolio Revamp — Task & Resume Point

> **Purpose:** Revamp the portfolio so Mubashir ranks in **LLM chatbot search** (ChatGPT/Perplexity/Claude) **and** Google, is **easy for recruiters to navigate**, and surfaces About + Projects on Home. Job-seeking context.
>
> **Status:** Phase 1 (data layer) ~90% done. Resume here after quota refresh.

---

## Locked decisions (from user)

1. **Targeting:** Remote roles, **any timezone**, pay-driven. On-site **Lahore, PK** is a bonus. (Not US-only.)
2. **Integrity pass:** **Yes** — reconcile all site claims to the Master CV's *honesty / verification notes*. Keep defensible numbers; reframe flagged ones as **scope**, not guaranteed outcomes. (See "Integrity rules" below.)
3. **Role tracks: FOUR** — `ai-backend`, `backend`, `erp-hrms`, `full-stack`. Each gets a target page + its own résumé download.
4. **Source of truth:** Expand existing `src/data/profile.json` + add `src/data/roles.json` (do NOT swap in a brand-new file — ~15 components + mobile variants read the existing data files).
5. **Full-stack résumé:** draft as **`.md` for now** (`public/resume/Mubashir-Rehman-Full-Stack.md`), generate PDF later.

## Key source materials (on user's machine, outside repo)

- **Master CV (source of truth):** `~/Downloads/resumes/Mubashir_Rehman_Master_CV_Source_of_Truth_Export.md` — positioning, role-segmented tailoring inventory, summary variants, and the **honesty/verification notes** (lines ~504–567). Canonical brain.
- **Clean role-bucket résumés:** `~/Downloads/files (10) (1)/` — `Mubashir_Rehman_Resume_AI_Backend.pdf`, `..._Backend.pdf`, `..._ERP_HRMS.pdf`. (No clean Full-Stack bucket existed → drafting one.)
- **All tailored résumés:** `~/Downloads/resumes/` (30+ role-specific variants).
- **HireTrack project (to feature):** `~/development/job-application-tracker` — repo `github.com/mubashir-rehman/job-application-tracker`, live `https://job-application-tracker-sigma-liard.vercel.app/`. Stack: React 19, Vite 6, **LangGraph** (`@langchain/langgraph`), Supabase (Auth + RLS), `@google/genai`, client-side `docx`/`mammoth`/`pdfjs`, PWA. BYOK, 5 providers.

## Integrity rules (reconciliation)

Reframe these flagged claims as scope, not verified outcomes (per Master CV honesty notes):
- Drop/soften: exact **uptime** (99.8%), **concurrent users** (1K+), **Stripe payment-success %** & payment ownership, **latency** (<100ms/<50ms), **cache hit %**, **scam-detection %** → "~92% on internal test set", **daily WS counts**, **onboarding 4h→30min**.
- **Keep (defensible):** CSSP 2024 paper + its numbers (42 subjects, 6,131 segments, R²=0.99 — published); 11K+ lines / 180+ commits (his own git); team-of-4 lead; 7 services / 60+ endpoints (countable); ~200-employee HRMS; 5K+ game downloads.
- **Never claim:** SOC2/HIPAA/compliance ownership, production Node.js/TS from academic-only exposure, full AI/ML model ownership where contribution was backend integration.

---

## Plan & progress

### Phase 1 — Data layer (reconciled source of truth) — ✅ mostly done
- [x] `src/data/profile.json` — rewritten: anchor tagline, remote availability, Veritus title→"Team Lead & Software Engineer", expanded skills (ERPNext, vLLM/LiteLLM, HL7, Frontend), reconciled metrics + experience highlights, HireTrack in achievements.
- [x] `src/data/projects.json` — added **HireTrack (#1 featured)**; added `local-llm-infra`, `erpnext-frappe`, `healthcare-hl7`, `industrial-estimation`; fixed portfolio entry (Astro, not vite-react-ssg); reconciled all metrics; added `roles: []` tag array to every project for role-page filtering.
- [x] `src/data/roles.json` — NEW: 4 roles, each with headline/tagline/pitch/bullets/skills/featuredProjects/resume path/FAQs.
- [x] `public/resume/Mubashir-Rehman-Full-Stack.md` — drafted (PDF later).
- [ ] **TODO:** place the 3 existing clean résumé PDFs into `public/resume/` as:
  `Mubashir-Rehman-AI-Backend.pdf`, `Mubashir-Rehman-Backend.pdf`, `Mubashir-Rehman-ERP-HRMS.pdf` (paths already referenced in roles.json). Generate Full-Stack PDF from the .md.
- [ ] **TODO:** user to review reconciled metrics and flag any he has *verified* and wants restored as hard numbers.

### Phase 2 — Static HTML rendering (the LLM/SEO core) — ⬜ not started
The big architectural fix: pages currently render `client:only="react"` → **crawlers/LLMs see an empty `<body>`.** Convert content-heavy pages to **native Astro (server-rendered HTML)** from the JSON, keeping React islands only for interactivity (theme FAB, project filter, AskMe, animations).
- [ ] `src/pages/index.astro` → server-render Home sections: Hero → Snapshot → **4 role-track cards** → Featured projects → Experience → Publication → Contact.
- [ ] `src/pages/for/[role].astro` → NEW dynamic route, statically generated for the 4 roles (uses roles.json + projects.json).
- [ ] `src/pages/about.astro`, `projects.astro` → server-render content (keep as deep pages).
- [ ] Keep journal/habits/hobbies as React islands (not SEO-critical).
- Note: current React pages live in `src/components/pages/` (+ `mobile/` variants). `ReactApp.tsx` uses BrowserRouter. Decide: keep islands for interactive widgets vs full Astro rewrite. See `CLAUDE.md` for the Astro-island architecture.

### Phase 3 — GEO / technical SEO — ⬜ not started
- [ ] `public/llms.txt` — concise machine-readable summary (identity, 4 tracks, top projects, contact) for LLM ingestion.
- [ ] `public/robots.txt` — explicitly allow `GPTBot`, `ClaudeBot`, `PerplexityBot`, `OAI-SearchBot`, `Google-Extended`; fix sitemap URL → `sitemap-index.xml` (Astro sitemap, not old static `sitemap.xml`).
- [ ] Schema: expand `Person` (hasOccupation, award, fuller knowsAbout), add **FAQPage** per role page (FAQ content already in roles.json), add **SoftwareSourceCode** schema for HireTrack. Files: `src/layouts/Base.astro`, `src/components/SEO.tsx`.

### Phase 4 — Recruiter nav & hero polish — ⬜ not started
- [ ] Navbar (`src/components/Navbar.tsx` + `BottomNav.tsx`): add **"Hire me for ▾"** (4 tracks) + prominent **Résumé** download; keep Journal/Habits/Hobbies secondary.
- [ ] Hero (`src/components/pages/Landing.tsx` + `mobile/Landing.tsx`): rebuild for 10-second scan — title, remote-availability badge, value prop, defensible metrics, 3 CTAs (View Work / Download Résumé / Contact).

---

## Decisions log

- **2026-06-27 — Removed Hobbies & Habits** (no recruiter signal). Habits deleted outright
  (stale log, last entry 2026-03-14 → undercut the discipline narrative). Hobbies content
  **archived to `archive/hobbies/`** (not built/served) with a restore README — revisit later
  if wanted. Touched: `ReactApp.tsx` (routes/imports), `Navbar.tsx`, `mobile/Landing.tsx`
  (hero tiles + icon imports), deleted `src/pages/{hobbies,habits}.astro`, removed the stale
  "habit heatmap" phrase from the portfolio project description. Build verified green.
  - **`fortyRules.json` stays** — it powers the Footer + mobile-hero random quote, not Hobbies.
  - **PENDING (user call):** `src/data/journal.json` still markets habits in prose — the
    "welcome" post lists *"Habit tracking — because systems beat motivation"* as a current
    feature, and the "rebuilding-for-mobile" post has a whole section on the Habits page.
    These are dated posts; left untouched rather than rewrite his voice. Decide: edit, add a
    note, or leave as historical.

- **2026-06-27 — Paper: keep, right-sized (not a nav page).** Verified via Springer
  (DOI `10.1007/s00034-025-03048-2`): Mubashir is one of **three equal-contribution**
  authors (Ali, Niaz, Rehman), published **2025** (arXiv preprint 2024). Fixed everywhere:
  `profile.json` (publications block + bio + metric `CSSP 2025` + achievements),
  `projects.json` (`ecg-cardiovascular`), `AskMe.tsx` grounding context, About desktop+mobile
  render (added equal-contribution note + DOI→Springer / arXiv dual links), Full-Stack résumé.
  Planned placement: Home credibility chip → About "Publications" card (done as render) →
  Projects engineering view → **Phase 3: `ScholarlyArticle` JSON-LD + llms.txt**.
  - **DONE — contribution captured:** data collection, ML pipeline (preprocessing, segmentation,
    feature engineering), and model training/evaluation (RF + ResNet-18 transfer learning); **no
    hardware**. Added as `publications[].contribution` in `profile.json`, rendered as "My
    contribution:" on About (desktop+mobile), and added to `AskMe.tsx` + Full-Stack résumé.
  - **DONE — `AskMe.tsx` reconciled (2026-06-27):** rewrote the full `SYSTEM_PROMPT` to match the
    reconciled data — dropped 99.8%/99.9% uptime/payment, 1K+ users, all `<Nms` latencies, 90%/80%
    cache, 92%→"~92% on internal test set", 4h→30min, "Sole"→"Primary"; added HireTrack as flagship
    project; fixed portfolio stack to Astro; reconciled achievements + availability (remote/any TZ).
    Build verified clean. **NOTE:** this prompt is a hand-maintained duplicate of `profile.json` +
    `projects.json` — Phase 2 candidate to **generate it from the JSON** so it can't drift again.

- **2026-06-27 — Locked architecture decision (data layer + hosting).**
  - **Data stays plain JSON** in `src/data/*.json` (single source of truth, edit-and-rebuild).
    The JSON format was never the SEO/GEO problem — *rendering* is.
  - **Decouple data from rendering:** Astro reads the JSON **at build time** and emits (1) visible
    static HTML, (2) JSON-LD schema, (3) `llms.txt`, (4) role pages + résumé context — all from the
    one source. The ranking lever is moving page *content* from `client:only` React into the build
    step (Phase 2), exactly where the schema already lives.
  - **GitHub Pages stays.** Static hosting is *ideal*, not a limitation: JSON-LD, llms.txt, robots,
    and server-rendered HTML are all baked at **build time** (`output: "static"`, on the CI runner),
    then served as plain files. "Server-render" here = build-time, NOT a live server. Proof: `Person`
    + `WebSite` JSON-LD already ship inlined in `dist/public/index.html` today (`Base.astro` 127/131).
    Only runtime server features (SSR per request, API routes, dynamic-per-request schema) are
    unavailable — and we need none of them; all schema is known at build.
  - **Astro Content Collections = optional later refactor**, justified by Zod schema validation for
    claim integrity (not by ranking — well-rendered JSON ranks identically). Headless CMS = rejected
    (overkill, kills edit-a-file simplicity). See [[portfolio-revamp]] / [[resume-claim-integrity]].

- **2026-06-27 — Volume metrics → ownership/scope.** Mubashir flagged "~66% / 182 commits /
  11K+ lines" as activity-not-impact. Decision: impact = **scope × ownership × enablement**
  (outcome numbers stay off-limits per integrity). Dropped lines/commits everywhere as standalone
  metrics; reframed to ownership ("primary backend **owner**") + scope ("7 services, 60+ REST
  endpoints"). Kept `~two-thirds of the codebase` **once, in the Full-Stack résumé only**, as an
  ownership proof point. Changed:
  - `profile.json` metric tile `11K+ Lines` → `60+ REST Endpoints`; experience + achievement lines.
  - Homepage hero `stats` in `Landing.tsx` (was ALL four reconciled-away: 11K lines / 182 commits /
    1K users / paper) → `3+ yrs · 60+ endpoints · 4 led · 1 paper`.
  - About visible badges (were `85% Test Coverage`, `99.8% Uptime`) → `4 Engineers Led`, `1 Peer-Reviewed Paper`.
  - `AskMe.tsx` (3 spots), `roles.json` (2 spots), résumé.
  - **Meta descriptions** — found `99.8% uptime` / `11K+ lines` / `Open to full-time roles` copy-pasted
    across `SEO.tsx`, `Base.astro`, `index.astro`, `about.astro`, `About.tsx` SEO + the visible About
    badge row. All reconciled to ownership/scope + remote availability. Build verified clean.
  - **DONE — availability copy aligned (2026-06-27):** "full-time roles" → remote/any-timezone
    positioning in `Typewriter.tsx`, `Contact.tsx` (SEO + heading), `mobile/Contact.tsx` (SEO +
    heading), `contact.astro`, and the `AskMe.tsx` FAQ suggestion. Repo-wide "full-time": clean.
  - **NEW FLAG (journal prose):** `journal.json` excerpt still says "shipping 11K lines" — personal
    dated post; left as voice, flag only.

## Watch-outs when resuming
- Don't break components reading `profile.json` — keys preserved; only added keys + reframed values.
- `projects.json` now has a `roles` array per project — Projects.tsx filtering uses `tags`, unaffected.
- roles.json résumé paths point to PDFs not yet placed in `public/resume/`.
- Repo is on `main`; branch before committing per repo policy. Docs already migrated to Astro (see `CLAUDE.md`).
- Nothing in this revamp is committed yet — all changes are in the working tree.
