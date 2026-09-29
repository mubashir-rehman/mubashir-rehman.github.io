---
title: "An AI voice front desk for dental clinics"
description: >-
  Case study: an AI voice receptionist for dental clinics, taken from AI-scaffolded code to production, with per-practice tenant isolation and what broke.
summary: >-
  Took an AI receptionist for dental clinics from AI-scaffolded code to production, with three voice providers and per-practice tenant isolation.
role: >-
  Owner of the product's engineering: backend, infrastructure and the internal admin console
period: "August 2026 to present"
status: "Live in production"
outcome: >-
  Launched to production on 3 September 2026; the AWS backend I designed took over in mid-September.
order: 1
flagship: true
pillar: "Ownership"
tracks: [backend, ai-backend, full-stack, erp-hrms]
stack:
  - TypeScript
  - React
  - TanStack Start
  - Cloudflare Workers
  - Supabase
  - PostgreSQL
  - Row-level security
  - Stripe
  - Voice AI APIs
  - Bun
problem: >-
  A dental practice wants an AI receptionist that books, reschedules and cancels appointments and checks insurance eligibility.
  It has to sit on top of the practice's existing scheduling system, serve many practices from one deployment, and keep each practice's data strictly apart.
  I joined a codebase scaffolded by an AI app builder that also committed and deployed code, so production could run things that never touched my checkout.
  My job was to make it safe to launch, then keep it running.
diagram:
  caption: "The path of one booking, from the call to the practice's own scheduling system."
  nodes:
    - id: voice
      label: "Voice provider"
      text: >-
        Answers the call. One switch picks among three providers, each with verified webhooks. Each is its own pipeline, so fixes must land in all three.
    - id: tools
      label: "Tool endpoints"
      text: >-
        The agent's only actions: booking, eligibility, lookup. It once re-derived a time from its own words, dropping the offset: 12:00 PM became 5:00 AM.
    - id: backend
      label: "Application backend"
      text: >-
        Holds the business rules and per-tenant scoping. A query missing its tenant filter leaks across tenants, as one total once showed.
    - id: database
      label: "Tenant database"
      text: >-
        Postgres with row-level security per practice. Missing grants show up as permission errors; a missing filter shows up as nothing, which is worse.
    - id: sync
      label: "Sync jobs"
      text: >-
        Scheduled jobs sync appointments, providers and time zones with the practice's scheduling system. A per-practice circuit breaker pauses a practice when its connector goes down.
  edges:
    - [voice, tools]
    - [tools, backend]
    - [backend, database]
    - [database, sync]
decisions:
  - title: "Keep the product narrow"
    chose: >-
      An AI layer on the practice's own scheduling system, which stays the system of record.
    rejected: >-
      Building records, billing or claims features into the product.
    why: >-
      The practice already runs on that system, so the product only has to be right about calls, bookings and eligibility.
    cost: >-
      It depends on that system's API and on each connector staying up. When one practice's connector went down, a queue ran away.
  - title: "Make provider identity per practice"
    chose: >-
      Each practice holds its own credentials for the eligibility API, and I removed the environment-variable fallback.
    rejected: >-
      One shared credential as a default for every practice.
    why: >-
      With a fallback, one practice's credentials could serve another. This fixes isolation at the provider boundary, not only in the data layer.
    cost: >-
      Every practice needs its own setup before eligibility checks work.
  - title: "Self-host auth instead of waiting"
    chose: >-
      I stood up a self-hosted auth stack on the staging server, and 10 of 10 raw requests then passed.
    rejected: >-
      Waiting for the vendor to fix a known upstream bug.
    why: >-
      I sent 25 raw requests straight at the managed service, bypassing my own code. All 25 failed with a "token issued in the future" error while the server's clock header advanced normally.
    cost: >-
      I now operate an auth service that a vendor used to run for me.
broke:
  - title: "A total that did not add up"
    symptom: >-
      An insurance carrier count on a screen I was redesigning read 80, and a reviewer model doubted it.
    cause: >-
      It was the exact sum of several tenants' rows. The query had no tenant filter, at a call site an earlier leak fix had missed.
    fix: >-
      I added the filter and checked it against the isolation tests.
  - title: "A queue that would not stop growing"
    symptom: >-
      After one practice's connector went down, failed-job rows passed 4,182 and were still climbing.
    cause: >-
      The scheduler advanced its last-pull time only on success, and the error was not retryable, so the already-queued guard never fired.
    fix: >-
      I tracked the last attempt as a backstop and added a per-practice circuit breaker. Production held flat at 4,519 for over 2.5 hours. I had also claimed a status still read "connected" without checking production. I checked, it was wrong, and I corrected the record.
  - title: "A date the agent never questioned"
    symptom: >-
      Asked for next Tuesday, the voice agent searched a window years in the past. The slot tool correctly found nothing, and the agent never questioned it.
    cause: >-
      The rendered prompt never stated today's date.
    fix: >-
      I reproduced it live, then fixed all three providers and both prompt paths, live-rendered and baked in.
results:
  - >-
    It launched to production on 3 September 2026, and the AWS backend I designed became its production backend in mid-September.
  - >-
    An early audit found no gap behind an alarming lint count, and showed the behavioural isolation tests covered only 6 of about 90 tenant-scoped tables.
rule:
  n: 1
  text: "Read the number that does not add up."
asOf: 2026-09-29
related:
  - aws-backend-hipaa-eligible
  - ai-agent-engineering-harness
---
