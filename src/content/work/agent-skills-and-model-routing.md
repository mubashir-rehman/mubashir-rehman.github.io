---
title: "Skills and model routing for AI coding agents"
seoTitle: "Skills and model routing for AI agents"
description: >-
  How I give AI coding agents current API docs through skills, run builds and tests the same way every time, and match each task to the right model.
summary: >-
  Skills that hand agents current third-party docs, builds, tests and browser sessions, with each kind of task sent to the right model.
role: >-
  Sole designer of the workflow
period: "2026 to present"
status: "In use on the projects I lead"
outcome: >-
  Skills for third-party APIs, builds, test suites and browser sessions, and a model chosen per kind of task.
order: 5.5
flagship: false
pillar: "Applied AI"
tracks: [ai-backend]
stack:
  - Claude Code
  - OpenCode
  - Project skills
  - Claude Opus
  - Claude Sonnet
  - Claude Haiku
  - Playwright
  - MCP servers
  - Test suites
  - Stripe API
problem: >-
  An AI coding agent writes code from what it remembers, and for a third-party API that memory can be a year old.
  Searching the web on every task to make up for it costs time and session quota, and so does running the strongest
  model for routine commands. I wanted agents that work from current docs, run the project's builds and tests the same
  way every time, and spend the most capable model only where a mistake costs the most.
diagram:
  caption: "How one task moves from plan to a reviewed build, and which model does each step."
  nodes:
    - id: docs
      label: "Initial documentation"
      text: >-
        The most capable model (Opus) writes the first project documentation, so every later task starts from the same written ground.
    - id: plan
      label: "Plan per task"
      text: >-
        The mid-tier model (Sonnet) plans each task on its own, reading the project skills and the downloaded API references instead of searching again.
    - id: review
      label: "Plan review"
      text: >-
        The most capable model reviews that plan before any code is written. This is where a wrong assumption is cheapest to catch.
    - id: code
      label: "Implementation"
      text: >-
        The mid-tier model writes the code. Small inline fixes go to the smallest model (Haiku).
    - id: routine
      label: "Routine runs"
      text: >-
        The smallest model handles pull, push, builds, reading logs, user-acceptance checks and research, through skills that run each one the same way.
    - id: final
      label: "Final overview"
      text: >-
        Once the build compiles without errors and the test suites pass, the most capable model reviews the whole implementation.
  edges:
    - [docs, plan]
    - [plan, review]
    - [review, code]
    - [code, routine]
    - [routine, final]
decisions:
  - title: "Match the model to the task"
    chose: >-
      The most capable model for initial documentation, reviewing each plan and the final overview; the mid-tier model for planning and coding; the smallest for inline fixes and routine runs.
    rejected: >-
      One model for everything, either the strongest (quota runs out) or the cheapest (mistakes reach review).
    why: >-
      Session quota is finite. Pull, push, builds, logs and user-acceptance checks do not need deep reasoning, while a plan or a finished implementation is where an error is most expensive.
    cost: >-
      More handoffs, and a cheaper model can miss something, so the build, the test suites and the final review have to catch it.
  - title: "Fetch the docs once, then read them locally"
    chose: >-
      A skill per third-party API that explains how to call it, with its documentation fetched once from the live reference and kept as the skill's resources.
    rejected: >-
      A web search on every task, or trusting what the model remembers about the API.
    why: >-
      One search and a download replace repeated searches, and the agent reads current docs instead of guessing from a knowledge cutoff.
    cost: >-
      The local copy can fall behind the vendor, so a skill has to fetch the live reference again when the API changes.
  - title: "Turn routine commands into skills"
    chose: >-
      Skills for running local builds, running the test suites and keeping a persistent Playwright session, so new work is checked against what already works.
    rejected: >-
      Letting each agent rediscover the commands and open a fresh browser session through the Playwright MCP tools for every check.
    why: >-
      The same steps run the same way every time, the test suites guard existing behaviour, and a persistent session needs fewer Playwright MCP tool calls.
    cost: >-
      The skills have to be kept in step with the project as its build and test setup change.
broke:
  - title: "A payment API the model thought was new"
    symptom: >-
      An AI agent built a Stripe payment integration on an API version that was later deprecated, and the model never flagged it.
    cause: >-
      Its knowledge of that API was about a year old, so it took the version as recently introduced and unlikely to be deprecated soon.
    fix: >-
      I wrote a Stripe skill that fetches the live reference first. Working from it, the agent caught the deprecation and the integration was fixed.
results:
  - >-
    Work against a third-party API starts from a skill and its downloaded reference: one search, then local reads.
  - >-
    The Stripe skill's live reference caught a deprecated API version that the model's own knowledge missed.
  - >-
    Builds, test suites and browser checks run through skills, and agents reuse one persistent Playwright session.
  - >-
    I have not measured accuracy, cost or quota savings, so I quote no figures. These describe the practice.
rule:
  n: 10
  text: "Give the agent today's docs, not its memory."
asOf: 2026-10-02
related:
  - ai-agent-engineering-harness
---
