---
title: "A harness for AI coding agents near production"
seoTitle: "Harness for AI coding agents"
description: >-
  A harness of project skills, subagents and guardrails that lets AI coding agents diagnose production while a human approves every fix.
summary: >-
  Built project skills, defined subagents and guardrails so AI agents could diagnose production safely, with a human approving every fix.
role: >-
  Sole designer and operator of the process
period: "August 2026 to present"
status: "In use on a live production project"
outcome: >-
  11 project skills, 3 agent definitions and 168 tracked issues with root causes.
order: 5
flagship: false
pillar: "Applied AI"
tracks: [ai-backend]
stack:
  - Claude Code
  - Subagents
  - Project skills
  - MCP servers
  - Playwright
  - Git worktrees
  - GitHub Actions
  - GitHub Issues
problem: >-
  The repository had a second author: an AI app builder that committed and deployed code without passing through my checkout.
  Early on, my local copy was behind production, which ran a function that did not exist on my disk.
  Agents also lost their context at every compaction, and a paid campaign was about to point real traffic at the system.
  I needed agents that could diagnose a live system in parallel and still could not break it.
diagram:
  caption: "How one finding moves from diagnosis to production."
  nodes:
    - id: analyze
      label: "Analysis agents"
      text: >-
        Each reproduces one issue, read-only against production, and writes one root-cause file. Parallel runs collided in a shared browser until each got its own context.
    - id: approve
      label: "Human approval"
      text: >-
        I read each root cause and approve a plan before code is written. The gate sits where blast radius changes, and I am the bottleneck.
    - id: fix
      label: "Fix agent"
      text: >-
        Plans first, then implements in its own git worktree after I approve. A stronger reviewer model is consulted before and after; I check its claims.
    - id: promote
      label: "Promotion chain"
      text: >-
        Fixes move through a chain of branches; the app builder's branch feeds staging. Agents cannot deploy infrastructure, and every task starts with a sync.
    - id: tracker
      label: "Issue tracker"
      text: >-
        Anything undecided or broken lands here with root cause and plan, tagged found by AI or by human. Memory holds only per-machine facts.
  edges:
    - [analyze, approve]
    - [approve, fix]
    - [fix, promote]
    - [promote, tracker]
decisions:
  - title: "Split diagnosis from fixing"
    chose: >-
      Separate defined agents: analysis is read-only and runs in parallel, and fixing is plan-only until I approve, in its own worktree.
    rejected: >-
      Spawning ad hoc agents and tightening their prompts, after they started stepping on each other.
    why: >-
      Diagnosis is safe to parallelise and fixes are not. A live campaign raised the stakes, so the split sits where blast radius changes.
    cost: >-
      Every fix waits for my approval, and each agent definition needs maintaining.
  - title: "Gate on a stronger model, then check it"
    chose: >-
      I consulted a stronger reviewer model before and after implementing and before anything irreversible, and verified its claims against the data.
    rejected: >-
      Deferring to it, or skipping it to save quota.
    why: >-
      It caught a cross-tenant leak, a false claim in a vendor report and a hardening step that would have silently stopped load balancer logs. It also flagged an authorization risk in two functions that already enforced auth, so I did not act on it.
    cost: >-
      Usage limits. I hit the weekly cap mid-test-pass, so mechanical agents moved to a cheaper model and only real diagnosis escalated.
  - title: "Keep knowledge in files, not chat"
    chose: >-
      Rules, procedures and open problems live in versioned files. Each skill traces to a dated incident, and memory holds per-machine facts only.
    rejected: >-
      Leaning on session memory and long chats.
    why: >-
      Agents lose their working context at every compaction, and the files survive it. The sync-first skill exists because my copy fell behind production.
    cost: >-
      A ritual before every compaction: update skills and memory, then compact. And discipline about which file a fact belongs in.
broke:
  - title: "Agents racing in one browser"
    symptom: >-
      Logging in as admin in one tab redirected another tab's signup page into the admin app.
    cause: >-
      Every tab shared one browser context, so one cookie jar.
    fix: >-
      Named, isolated contexts held in a registry on the automation server. I confirmed it persists across subagent calls before relying on it.
  - title: "One agent's cleanup nearly erased another's work"
    symptom: >-
      A fix agent's post-commit cleanup ran a checkout that reverted another agent's uncommitted changes. They survived only because that agent kept writing.
    cause: >-
      Two agents shared one checkout.
    fix: >-
      Each agent now commits from its own worktree and never discards changes it did not create.
  - title: "A debugging loop"
    symptom: >-
      The agent kept trying fixes for the auth crash loop and none held.
    cause: >-
      It was fixing before diagnosing.
    fix: >-
      I stopped it and reset the method: use the official docs actually in use, get the reviewer's read, read the logs as far as they go, log every attempted fix, then diagnose. The root cause followed.
results:
  - >-
    Nearly every skill and agent definition was written after a specific incident and is dated to it.
  - >-
    Across two sessions from 16 August to 29 September 2026, I directed 55 of 155 reviewer-model consultations, and 20 of 55 subagent spawns came from my own definitions.
  - >-
    These figures describe practice, not results. I have no speed, quality or cost measurement, so I quote none.
rule:
  n: 2
  text: "Split diagnosis from fixing where the blast radius changes."
asOf: 2026-09-29
related:
  - agent-skills-and-model-routing
  - dental-ai-front-desk
---
