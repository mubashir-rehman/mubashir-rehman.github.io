---
title: "An operations console for a healthcare integration engine"
seoTitle: "Operations console for an HL7 engine"
description: >-
  An operations console for an HL7 integration engine: message search, reprocessing, dashboards and PHI-access auditing features. I was the top contributor.
summary: >-
  Built the API layer, PHI-access auditing features and most of the frontend for a console that operates an HL7 integration engine.
role: "Top contributor: backend-for-frontend, most of the frontend, CI/CD and staging"
period: "2025 to 2026"
status: "Shipped, then feature work paused by the client"
outcome: >-
  I wrote 272 of the 389 commits, the largest share in the repository.
order: 6
flagship: false
pillar: "Ownership"
tracks: [backend, full-stack]
stack:
  - React 19
  - TypeScript
  - Vite
  - Node.js
  - Express-style BFF
  - Sequelize
  - Jest
  - Docker
  - Traefik
  - CSRF protection
  - Monorepo
problem: >-
  Hospitals route clinical messages between systems with integration engines.
  The people who run one needed a web console to search messages, reprocess and export them, start and stop channels, and watch traffic trends.
  It is operations tooling, not clinical software.
  The engine already had its own server API and its own audit log, so the console had to sit in front of both without disturbing either, and it had to stay honest when one channel was slow.
  My part was the backend-for-frontend, most of the React frontend, the CI/CD pipeline and the staging deployment.
diagram:
  caption: "A global search, from the browser to the engine."
  nodes:
    - id: console
      label: "React console"
      text: >-
        Search, reprocess, export, channel control and dashboards, with focus trapping and keyboard navigation. It shows the gaps in a result instead of hiding them.
    - id: bff
      label: "Backend for frontend"
      text: >-
        Proxies the engine's API with CSRF handling, login rate limiting and input validation. When the engine is slow, this layer has to cope.
    - id: search
      label: "Global search"
      text: >-
        Queries channels in batches of 10, with a 10-second timeout each. It fails per channel, and names the channels that timed out.
    - id: audit
      label: "PHI audit"
      text: >-
        Searches and message views on patient-ID channels post an audit event to the engine. Fails if the console's own polling adds false entries.
    - id: engine
      label: "Engine API"
      text: >-
        The engine's own server API, outside my control. Reprocess, export and channel control go through it. One channel can be slow while others are fine.
  edges:
    - [console, bff]
    - [bff, search]
    - [search, audit]
    - [audit, engine]
decisions:
  - title: "Batch the global search and name the gaps"
    chose: >-
      I made global search query channels in batches of 10, gave each a 10-second timeout, and added a banner naming every channel that timed out.
    rejected: >-
      The old code fired one request per channel, all at once, with no timeout and no cap. A comment in it admitted the risk and moved on.
    why: >-
      One slow channel could stall the whole search. A result that hides its own gaps is worse than a slow one.
    cost: >-
      A search over many channels now runs in rounds, so the best case is slower than firing everything at once.
  - title: "Keep the console out of the audit log"
    chose: >-
      I moved the dashboard's polling to a coarser endpoint and filtered in the browser, then built the PHI-access auditing feature on top.
    rejected: >-
      Building auditing on a log that the console's own background polling was already filling with false entries.
    why: >-
      An audit log full of noise is no use to the person who has to read it.
    cost: >-
      The dashboard fetches more than it shows and does the filtering itself.
  - title: "Replace the hidden time picker with a modal"
    chose: >-
      I replaced the hidden native datetime input with a custom jump-to-time modal.
    rejected: >-
      Hiding the native input behind an icon, which was the original design.
    why: >-
      Firefox draws the time part inline inside the input, so hiding the input hid the time picker, in Firefox only.
    cost: >-
      A custom control that I have to keep accessible and consistent myself.
broke:
  - title: "Every trend count was too high"
    symptom: >-
      Each message count on the dashboard trend chart was inflated.
    cause: >-
      Every data point summed connector-level rows on top of the channel-level aggregate that already included them.
    fix: >-
      I kept only the channel-level aggregate rows.
  - title: "Formatting changed HL7 messages"
    symptom: >-
      Viewing a pipe-delimited HL7 message with formatting on added stray brackets.
    cause: >-
      Every message went through the XML formatter, and HL7 is not XML.
    fix: >-
      I added XML detection, so anything else is shown untouched.
  - title: "The staging image would not build"
    symptom: >-
      Staging builds failed outright.
    cause: >-
      One copy step staged a single script, not the directory its dependencies lived in.
    fix: >-
      I copied the whole directory.
results:
  - >-
    I shipped the feature build and set up the CI/CD pipeline and the Traefik staging deployment. The client then paused feature work, and my later commits are deployment and infrastructure migration only.
  - >-
    The console has ARIA labels, focus trapping and keyboard navigation.
  - >-
    I have no figures for users, channels or messages handled, so I make no usage claim.
rule:
  n: 5
  text: "A partial result should look partial."
related:
  - social-signal-intelligence-backend
  - dental-ai-front-desk
---
