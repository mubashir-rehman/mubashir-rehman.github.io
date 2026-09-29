---
title: "A production AWS backend on HIPAA-eligible services"
seoTitle: "AWS backend on HIPAA-eligible services"
description: >-
  A production AWS backend for a healthcare SaaS, built only from services AWS lists as HIPAA-eligible, with the decisions, failures and limits I hit.
summary: >-
  Designed and deployed a production AWS backend for a healthcare SaaS, checked service by service against AWS's HIPAA-eligible list.
role: >-
  Designed and deployed it independently as an infrastructure-as-code app; deploys stayed human-run
period: "2026"
status: "Live in production"
outcome: >-
  Became the production backend in mid-September 2026.
order: 4
flagship: false
pillar: "Systems"
tracks: [backend]
stack:
  - AWS CDK v2
  - TypeScript
  - RDS PostgreSQL
  - ECS on Fargate
  - Envoy
  - Application Load Balancer
  - WAFv2
  - KMS
  - Secrets Manager
  - EventBridge Scheduler
  - CloudTrail
  - Self-hosted Supabase
problem: >-
  A healthcare SaaS ran on managed services: an edge runtime, plus a managed database and auth service.
  It needed a hosting path made only of services AWS lists as HIPAA-eligible, without losing tenant isolation, and with an auth stack the team controlled.
  A managed-auth outage had already shown what waiting on someone else's fix costs.
  My feasibility audit found the lock-in lopsided: leaving the edge runtime was an estimated 8 to 15 engineer-days, leaving the managed database and auth 60 to 100.
diagram:
  caption: "A request from the internet to the database. Scheduled jobs and migrations are left out."
  nodes:
    - id: waf
      label: "Regional WAF"
      text: >-
        Filters traffic in front of the load balancer. It stands where a CDN would have, and it is regional, so it guards only this balancer.
    - id: balancer
      label: "Load balancer"
      text: >-
        Holds the certificate and listeners in front of the gateway. It was deleted once by a rollback that a bad container health check triggered.
    - id: gateway
      label: "Gateway"
      text: >-
        Envoy routes to the auth, API and storage services and answers the ready endpoint that health checks now target. HTTP/1.1 passes, 1.0 gets a 426.
    - id: services
      label: "Platform services"
      text: >-
        Self-hosted auth, REST and storage services on Fargate, for team-controlled auth. Only the storage client validates the database certificate chain, which broke replay until fixed.
    - id: database
      label: "Database"
      text: >-
        RDS Postgres, single-AZ to hold cost. Migrations replay as one-off tasks; 18 of 185 need tables the auth and storage services create at boot.
  edges:
    - [waf, balancer]
    - [balancer, gateway]
    - [gateway, services]
    - [services, database]
decisions:
  - title: "Check the vendor's own list"
    chose: >-
      I cross-checked every service against AWS's HIPAA-eligible reference, one by one.
    rejected: >-
      Building from memory of which services qualify.
    why: >-
      The list caught naming mismatches: the load balancer is listed as Elastic Load Balancing, and Security Hub appears only in its posture-management form. It also showed that third-party providers need their own business associate agreements.
    cost: >-
      Time before any code, and a list of obligations no code can close.
  - title: "Move the edge to a regional WAF"
    chose: >-
      When an account-level restriction blocked creating the CDN, I put a regional WAF on the load balancer.
    rejected: >-
      Stalling the edge layer on a support ticket.
    why: >-
      The WAF kept the protection I needed, and I designed the fallback so a CDN can be added later with nothing to tear out.
    cost: >-
      No CDN caching, which was already off in every planned behaviour, and no locking of the balancer behind a CDN. It was already internet-facing, so this is a deferral, not a regression.
  - title: "Cut cost, and name each cut"
    chose: >-
      A single-AZ database, one NAT gateway with a gateway endpoint, GitHub Actions for deploys and minimal WAF rules. Security Hub, Inspector and AWS Backup are deferred.
    rejected: >-
      Interface endpoints, CodePipeline and the fuller control set at pilot scale.
    why: >-
      At this scale interface endpoints were net-negative. My estimate is about 180 to 230 dollars a month for a pilot, against about 350 to 500 with the fuller controls.
    cost: >-
      No database failover, and deferred controls that remain open work.
broke:
  - title: "An auth crash loop on every boot"
    symptom: >-
      The auth service crash-looped silently on every boot.
    cause: >-
      The connecting database role's search_path was never set. It governs the migration-tracking lookup and every unqualified query.
    fix: >-
      I set it live and wrote it into the bootstrap runbook.
  - title: "A health check that deleted its own balancer"
    symptom: >-
      Every task failed its container health check. The platform's own circuit breaker rolled back the update and deleted the new load balancer, certificate and listeners.
    cause: >-
      The check ran a tool that is not in the image. I found it by comparing what the container did with what the check tested.
    fix: >-
      I rewrote the check to use the gateway's ready endpoint.
  - title: "A build hash that moved by itself"
    symptom: >-
      The container image digest changed between two synth runs with no source change, which would have forced needless redeploys.
    cause: >-
      Session-local directories leaked into the build context. My first fix was incomplete, and excluding the whole infra directory broke the build.
    fix: >-
      I excluded subdirectories one by one and confirmed the digest stayed stable across an unrelated edit.
results:
  - >-
    The public domain was repointed to this deployment on 15 September 2026, and it was confirmed as the production backend the next day.
  - >-
    All 185 migrations replayed end to end on the new stack.
  - >-
    Eligible services are a starting point, not a finished control set: several controls were deferred and third-party agreements were still open.
rule:
  n: 6
  text: "Check the vendor's own list, not your memory."
asOf: 2026-09-29
related:
  - dental-ai-front-desk
  - ai-agent-engineering-harness
---
