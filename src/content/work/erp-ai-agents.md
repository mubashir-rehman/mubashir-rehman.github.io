---
title: "AI agents working inside a live ERP"
description: >-
  AI agents that act inside a live ERP, from expense-claim automation to multi-company procurement and inventory. I wrote the platform and its ERP contract.
summary: >-
  Built an agent platform over an ERP: it began as expense-claim automation and became multi-company procurement and inventory intelligence.
role: "Author of the platform and its ERP integration contract"
period: "2026 to present"
status: "Live, with a demo and a production deployment"
outcome: >-
  Two live deployments, a demo and a production one.
order: 3
flagship: true
pillar: "Applied AI"
tracks: [ai-backend, erp-hrms, backend]
stack:
  - Python
  - ERPNext
  - Frappe REST API
  - Model Context Protocol
  - OCR
  - LLM tool-calling
  - PostgreSQL
  - Docker
  - Traefik
  - Server-sent events
  - Webhooks
  - OAuth2
problem: >-
  An ERP holds stock, suppliers and purchase orders, yet decisions across companies, currencies and warehouses still needed a person to read and reconcile.
  It began as a demo of expense-claim automation.
  The aim then became AI agents doing real work inside the existing ERP: first on expense claims, then on procurement and inventory for two companies with different currencies and warehouse sets.
  The agents had to act through the ERP's own API, so the ERP stayed the system of record.
  Results also had to reach people on a live dashboard, signed in through the ERP's own accounts.
diagram:
  caption: "How a document reaches the ERP through an agent, and how the dashboard reads the result."
  nodes:
    - id: intake
      label: "Intake"
      text: >-
        An ERP webhook announces a receipt or quotation, and OCR turns it into text. A poor scan gives the agent poor text.
    - id: agent
      label: "Agent"
      text: >-
        An LLM with forced tool-calling, so it acts only through named tools. It can still pick the wrong one, so writes share one contract.
    - id: contract
      label: "Agent contract"
      text: >-
        One versioned contract shared by expense and procurement. Downstream consumers rely on it, so a careless change breaks callers.
    - id: resolver
      label: "Company resolver"
      text: >-
        Resolves company, currency, warehouse and price list per sales order. Unknown companies get a fallback. Only this layer knows the trigger.
    - id: adapter
      label: "ERP adapter"
      text: >-
        A generic ERP adapter for agent tooling, forked from an open-source one. I specified it and did not build it. It never chooses a company.
    - id: dashboard
      label: "Dashboard API"
      text: >-
        Postgres read models, supplier scoring, demand forecast and purchase-order drafts. Actions are validated and audit-logged, so a wrong one can be traced.
  edges:
    - [intake, agent]
    - [agent, contract]
    - [contract, resolver]
    - [resolver, adapter]
    - [adapter, dashboard]
decisions:
  - title: "Company resolution stays outside the adapter"
    chose: >-
      I kept the adapter generic and put company resolution in the callers that know the business trigger. I wrote the decision down in the adapter's specification.
    rejected: >-
      Hard-coding the known companies into the adapter's tools.
    why: >-
      The adapter is a generic ERP adapter. It cannot know why a request was made, so it cannot know which company the request belongs to.
    cost: >-
      Every procurement caller has to implement company-aware filters itself.
  - title: "One resolver for many companies"
    chose: >-
      I made the platform resolve company, currency, warehouse and price list per sales order, with a fallback for unregistered companies and a warehouse policy per item.
    rejected: >-
      Procurement hard-coded to a single company, and a warehouse chosen from a company string.
    why: >-
      The two companies had different currencies and warehouse sets. A company string does not say which warehouse holds an item.
    cost: >-
      Every procurement path now has to carry company context from start to finish.
  - title: "Reuse the pattern for procurement"
    chose: >-
      I pointed the same OCR, tool-calling and ERP layer at procurement, and moved expense and procurement onto one shared contract in a single commit.
    rejected: >-
      Rebuilding the agent and ERP layer from scratch for procurement.
    why: >-
      The hard parts, reading documents and acting through the ERP's API, already worked.
    cost: >-
      Expense and procurement now share a contract, so a change made for one can break the other.
brokeNote: >-
  The history holds no outage, revert or data-loss commit, so I will not invent an incident. The honest boundary is what I left undone: dashboard cross-origin rules moved from open to an explicit allowlist, but hardening them for production stayed as recorded debt.
results:
  - >-
    The ERP integration contract is documented, and downstream consumers rely on it.
  - >-
    Dashboard sign-in goes through the ERP's own OAuth2, so people use the accounts they already have.
  - >-
    The platform commits sit under a shared team identity, so my authorship is my own statement, not something git proves.
  - >-
    I have no usage, uptime or user figures, and I claim none.
rule:
  n: 4
  text: "Keep the adapter generic. Put business rules where the business trigger lives."
specified:
  - >-
    The ERP adapter for agent tooling, a fork of an open-source adapter: I wrote its specification and the decision record that keeps it company-agnostic, not its code.
  - >-
    The stock-reorder agent: I wrote its specification and a multi-company requirements note. Someone else built its original pipeline.
asOf: 2026-08-06
related:
  - social-signal-intelligence-backend
  - dental-ai-front-desk
---
