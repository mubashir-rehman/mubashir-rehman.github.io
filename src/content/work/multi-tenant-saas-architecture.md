---
title: Architecture for a multi-tenant lead-intelligence SaaS
seoTitle: Multi-tenant SaaS architecture and spec
description: >-
  How I specified a multi-tenant lead SaaS: database per tenant, shared source of truth, separate control plane. Architecture and demo, not a launch.
summary: >-
  Wrote the requirements, architecture and detailed design for a multi-tenant lead SaaS, and built a demo for client review.
role: >-
  Sole owner: architect, requirements owner, specification author and builder of the frontend demos.
period: From July 2026
status: >-
  Architecture, specification and a review demo. Not a launched product: no production backend, no users.
outcome: >-
  Three specification documents complete and a demo of each plane deployed for client review.
order: 7
flagship: false
pillar: Systems
tracks: [backend, full-stack]
stack: [Next.js, React, Tailwind CSS, Docker, Traefik]
specified: [NestJS, Python, FastAPI, Celery, PostgreSQL, OpenSearch, Redis, Auth0, Terraform]
problem: >-
  A client wanted a SaaS that ingests public-records filings, enriches each case with owner contact data from third-party contact-data APIs, validates quality, and pushes sales-ready leads into each customer's CRM. Many customers share one deployment. Enrichment costs money per lookup, so each lookup had to be billable to the tenant that asked. The filings themselves are public and identical for everyone. The client's requirements arrived in rounds, so the design had to stay stable while three decisions stayed open. I owned the specification and the demo, so the two had to agree.
diagram:
  caption: >-
    The specified path of one lead, in order. This is design: I built only the demo screens, not this pipeline.
  nodes:
    - id: ingest
      label: Filing ingest
      text: >-
        Polls public-records sources once for everyone, which keeps it cheap. If polling stalls, every tenant's filings go stale together.
    - id: shared
      label: Shared store
      text: >-
        One database holds property, owner, filing and enrichment results once. A bad write here reaches every tenant.
    - id: enrich
      label: Enrichment
      text: >-
        Contact-data lookups run only when a tenant asks, and are billed to that tenant. A provider outage delays requests, not ingestion.
    - id: tenantdb
      label: Tenant database
      text: >-
        Everything a tenant owns lives in its own database. Isolation is structural, not a query filter; the price is many migrations.
    - id: crm
      label: CRM delivery
      text: >-
        Validated, sales-ready leads are pushed into the customer's CRM. As the last hop, its failures are what the customer sees first.
    - id: control
      label: Control plane
      text: >-
        A separate repo, backend and privilege boundary for provisioning, tenant resolution and migrations. It reaches every tenant, so guard it.
  edges: [[ingest, shared], [shared, enrich], [enrich, tenantdb], [tenantdb, crm], [control, tenantdb]]
decisions:
  - title: Share the public data, isolate the paid data
    chose: >-
      One shared source-of-truth database holds property, owner, filing and enrichment results once. Everything a tenant owns sits in a database per tenant.
    rejected: >-
      Copying the public data into every tenant's database.
    why: >-
      Filings are identical for everyone, so wide, cheap ingestion should happen once. Enrichment is expensive and demand-scoped, so it stays billed to the tenant that asked.
    cost: >-
      Two data planes to keep consistent, and a bad write to the shared store reaches every tenant.
  - title: Split the control plane
    chose: >-
      A separate repo, backend and privilege boundary for the admin plane, with provisioning, tenant resolution, migration execution and shared-infrastructure placement written down.
    rejected: >-
      Building it beside the tenant backend as extra routes.
    why: >-
      The code that can create, migrate and inspect every tenant should not share a deploy or a credential set with the code every tenant's users reach.
    cost: >-
      Two backends to run, and a written contract between them that has to stay true.
  - title: Trace every requirement to a screen
    chose: >-
      Requirement IDs run from the requirements document into the demo, and the demo shows only what the document specifies.
    rejected: >-
      A richer demo with screens the document did not ask for.
    why: >-
      A reviewer can walk from any requirement to the screen that shows it, so disagreement becomes a change to the specification, not an argument about a mock-up.
    cost: >-
      The demo could not reveal what the requirements missed. That took the client's written input, which left three decisions open for me to close.
broke: []
brokeNote: >-
  Nothing broke, because nothing ran in production. The demo is a review artifact: it shows the specified screens, not a working pipeline. When I last checked, the production backend had not been started, so I have no incident to report and will not invent one.
results:
  - >-
    I finished the requirements (v1.3), architecture (v1.3) and detailed design (v1.1) documents, after a discovery pass on market, competitors, data sources, workflows and personas.
  - >-
    I closed the three decisions the client's second-round input left open: a dual-mode data-pool toggle, dismissed-date handling and a filing schema placeholder.
  - >-
    This took the architecture and demo from nothing to something a client could review. It did not take a product to launch.
rule:
  n: 7
  text: >-
    Write the specification first, and trace every requirement to a screen.
asOf: 2026-08-06
links: {}
related: [erp-ai-agents, hiretrack]
---
