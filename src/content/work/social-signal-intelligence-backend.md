---
title: "A social and market signal intelligence backend"
seoTitle: "Social and market signal backend"
description: >-
  A backend that ingests Telegram, Discord and X, summarises with AI, searches semantically and raises alerts. I wrote it alone and handed it to the client.
summary: >-
  Built a client backend alone: it ingests Telegram, Discord and X, summarises with AI, searches semantically and raises alerts.
role: "Sole author"
period: "2025 to 2026"
status: "Completed and handed over to the client"
outcome: >-
  I wrote 154 of the 155 commits, then handed the backend over at the client's request.
order: 2
flagship: true
pillar: "Systems"
tracks: [backend, ai-backend]
stack:
  - Python
  - FastAPI
  - PostgreSQL
  - pgvector
  - Redis
  - ARQ
  - Google Gemini embeddings
  - Docker Compose
  - Alembic
  - Telegram
  - Discord
  - X
problem: >-
  A client wanted chatter from three unreliable platforms, some of it about crypto tokens, turned into something they could search and be alerted on.
  Each platform fails in its own way, so each needed its own listener and parser.
  On top of that sat AI summaries, semantic search, live market data and alerts that had to mean something when they fired.
  It was one engineer, and the client would own the code afterwards, so it had to survive a handover to people who were not in the room.
diagram:
  caption: "One message, from a platform to an alert in Discord."
  nodes:
    - id: listeners
      label: "Listeners"
      text: >-
        One listener per platform. Telegram backs off from 5 to 60 seconds and stops at 10 retries. It fails when a connection drops.
    - id: store
      label: "Parsers and store"
      text: >-
        Parsers write messages into a 10-table Postgres schema. Bad input gets in: numbers like 114 were once stored as coin tickers.
    - id: workers
      label: "Queue and workers"
      text: >-
        Redis with ACL auth carries cache, queue and rate control. ARQ workers run the jobs and will not start if their tasks are unregistered.
    - id: analysis
      label: "AI and search"
      text: >-
        Summarises each message, then embeds it into pgvector for semantic search. It failed quietly once: alerts fired before the summary was attached.
    - id: alerts
      label: "Alert engine"
      text: >-
        Gates on source count and trust score, and deduplicates on a content hash. Too tight and nothing fires. The thresholds are configuration.
    - id: delivery
      label: "Discord output"
      text: >-
        Posts each alert to Discord. Long alerts were silently truncated by the platform's embed limits, so I chunk them to fit.
  edges:
    - [listeners, store]
    - [store, workers]
    - [workers, analysis]
    - [analysis, alerts]
    - [alerts, delivery]
decisions:
  - title: "Hosted embeddings on a purpose-built pgvector image"
    chose: >-
      I moved embeddings from a local model at 384 dimensions to a hosted model at 768, on a database image built for pgvector.
    rejected: >-
      Keeping the local model and the alpine Postgres image my first version used.
    why: >-
      That image could never run pgvector's own migrations, so my first vector search sat on a base that could not work.
      I did not record why I preferred hosted over local, so I will not invent a reason now.
    cost: >-
      A migration to widen every embedding column, and search now depends on an external API.
  - title: "Plan the queue migration before touching code"
    chose: >-
      I wrote a JSON baseline of the existing task graph, then moved background jobs from Celery to ARQ in a planned run of commits.
    rejected: >-
      A rewrite done in the middle of an incident.
    why: >-
      A queue change touches every ingestion path. The baseline gave me something to check the new workers against.
    cost: >-
      Work before any code moved, and the migration still hit two bugs: worker registration and an event-loop conflict.
  - title: "Ship a known limitation and write it down"
    chose: >-
      I accepted a locking refresh for the materialised views and recorded the reason in the commit.
    rejected: >-
      A non-locking refresh, which needs a unique index the views did not have.
    why: >-
      A limitation written down can be fixed by the next engineer. One left silent cannot.
    cost: >-
      Reads lock during every refresh, and the indexes were never added.
broke:
  - title: "Messages arrived and no alert fired"
    symptom: >-
      Messages were being listened to and saved, and the alert engine never triggered.
    cause: >-
      Two quality gates and a duplicate check stood in front of every alert. I put them in from the first version, so a strict threshold and a broken path looked identical.
    fix: >-
      I replaced the trigger with one that alerts on every call, marked plainly as a debugging change. Alerts fired, so the path was sound. The thresholds came back later as configuration.
  - title: "Alerts fired before the analysis arrived"
    symptom: >-
      The AI service answered correctly and nobody received the answer.
    cause: >-
      The analysis call was fire and forget, so alerts left first. Separately, the service address did not work across the container network.
    fix: >-
      I made the analysis blocking for alerts and corrected the address.
  - title: "Three failures in one X session"
    symptom: >-
      The X scraper was non-functional and its worker refused to start.
    cause: >-
      Async database calls mixed with a thread pool caused event-loop errors. An async generator was iterated synchronously. Inconsistent import paths left the task functions unregistered.
    fix: >-
      I fixed all three in one session and removed the thread mixing entirely.
results:
  - >-
    The backend was completed, not left as a prototype, and handed over to the client's own repository.
  - >-
    It covers a 10-table schema, three ingestion listeners, AI summaries, semantic search, alerts and live market data, with tests across ingestion, alerting and search.
  - >-
    I have no deployment, usage or accuracy figures, and I claim none.
rule:
  n: 3
  text: "Prove the path end to end before you tune the thresholds."
related:
  - erp-ai-agents
  - healthcare-integration-console
---
