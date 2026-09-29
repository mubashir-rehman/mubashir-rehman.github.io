---
title: "HireTrack: an AI résumé tailor and job-application tracker"
seoTitle: "HireTrack: résumé tailor and job tracker"
description: >-
  HireTrack is an open-source, offline-first job-application tracker whose LangGraph flow tailors résumés, with deterministic steps first. I wrote it alone.
summary: >-
  Built an open-source, offline-first tracker that moves applications through a fixed pipeline and tailors résumés with a deterministic-first LangGraph flow.
role: >-
  Sole author, end to end: product, app, AI pipeline, sync and MCP server.
period: From June 2026
status: >-
  Shipped and open source, with a live deployment. No adoption to report.
outcome: >-
  I wrote every commit made from 24 June to 24 July 2026, 89 in all, in a public repository.
order: 8
flagship: false
pillar: Applied AI
tracks: [ai-backend, full-stack]
stack: [React 19, Vite 6, TypeScript, Tailwind v4, LangGraph, Supabase, PostgreSQL RLS, Google GenAI, docx, pdfjs-dist, Vercel functions, Next.js 15 (MCP)]
problem: >-
  Tracking job applications means juggling stages, postings and résumé versions. I wanted one app that moves each application through a fixed seven-phase pipeline and tailors a résumé to each posting with AI. Two constraints shaped it. No API key should sit on a server, mine or anyone's. And the app had to work with no account and no network, so sync had to be optional. It also had to read and write DOCX, PDF and Markdown, because that is what résumés come as.
diagram:
  caption: >-
    The path of one tailoring run, in order. The MCP server is a second way into the same records.
  nodes:
    - id: app
      label: Browser app
      text: >-
        React 19 and Vite app that runs offline from local storage, no account needed. Data stays on the device unless sync is on.
    - id: files
      label: File import
      text: >-
        Reads and writes DOCX, PDF and Markdown in the browser, with no server round-trip. Extraction is only as good as the source file.
    - id: graph
      label: LangGraph flow
      text: >-
        Parses and scores the posting, then tailors the résumé. Code decides what it can; the model gets the rest, including unfamiliar phrasing.
    - id: model
      label: AI provider
      text: >-
        One of five providers, using the user's own key, so no key is stored on a server. A bad key surfaces as the user's error.
    - id: store
      label: Storage and sync
      text: >-
        Local storage first. Optional Supabase sync uses Auth and row-level security over one applications table. With sync off, nothing is backed up.
    - id: mcp
      label: MCP server
      text: >-
        A separate Next.js 15 package lets an AI assistant read and write applications over remote MCP. It deploys, and can fail, separately.
  edges: [[app, files], [files, graph], [graph, model], [graph, store], [mcp, store]]
decisions:
  - title: Code before the model
    chose: >-
      A LangGraph pipeline where deterministic steps run first and the model is called only where code cannot decide.
    rejected: >-
      One prompt that takes a résumé and a posting and returns a tailored résumé.
    why: >-
      Code steps repeat exactly, cost nothing to run and can be read. I can say why a posting scored the way it did. A single prompt gives me none of that.
    cost: >-
      More graph to build, and rules I have to keep honest as postings change.
  - title: Bring your own key
    chose: >-
      Users supply their own key for one of five providers, and no key is stored on a server.
    rejected: >-
      A hosted proxy using my key behind a quota.
    why: >-
      A key I hold is a key I can leak, and a bill I have to cap. With the user's own key, neither exists.
    cost: >-
      Every user needs a key before the AI features work, and I support five providers instead of tuning for one.
  - title: Offline first, sync optional
    chose: >-
      Full function from local storage with no account, optional Supabase sync behind row-level security, and parsing and export in the browser.
    rejected: >-
      An account-first app with a server database.
    why: >-
      The app works with no signup and no network, and a résumé is parsed and exported without a server round-trip.
    cost: >-
      Two storage paths to keep consistent, and no cross-device data for anyone who skips sync.
broke: []
brokeNote: >-
  I have no incident to report and will not invent one. The honest boundary is testing: there is no test runner. I checked changes with a type-check and manual testing in the browser, so the pipeline has no regression suite.
results:
  - >-
    I built the tracker, the tailoring pipeline, optional sync and a remote MCP server, and shipped them in one public repository.
  - >-
    Parsing and export of DOCX, PDF and Markdown run in the browser, and the whole app works offline with no account.
  - >-
    The repository and the live deployment are public. I claim no adoption: the value here is the design, and the code is there to read.
rule:
  n: 8
  text: >-
    Deterministic first, model second.
asOf: 2026-08-17
links:
  repo: https://github.com/mubashir-rehman/job-application-tracker
  demo: https://job-application-tracker-sigma-liard.vercel.app
related: [erp-ai-agents, multi-tenant-saas-architecture]
---
