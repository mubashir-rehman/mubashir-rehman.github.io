---
name: site-ship
description: Publish the dev branch to the live site (mubashirrehman.com) and verify both deploys. Use only after the owner explicitly says "go live" for the work on the dev branch.
---

# Ship to the live site

Pushing `main` deploys two hosts: Cloudflare Pages (the canonical mubashirrehman.com) and GitHub Pages (redirect stubs for the old is-a.dev address). Approval to go live covers only the work the owner has seen; it does not carry over to later changes.

## Steps

```bash
# 0. The dev branch must already be committed, pushed and green (run the site-qa skill first).
git status --short              # must be empty
B=$(git branch --show-current)  # the session's dev branch

# 1. Fast-forward only. If this prints nothing, main has moved: stop and merge main into the dev branch first.
git fetch -q origin main && git merge-base --is-ancestor origin/main HEAD && echo FF-OK

# 2. Publish
git push origin HEAD:main

# 3. Cloudflare: poll the live HTML for a marker unique to this change (a class name or text you added)
for i in $(seq 1 30); do curl -s https://mubashirrehman.com/ | grep -q '<marker>' && { echo "live after ~$((i*20))s"; break; }; sleep 20; done

# 4. GitHub Pages workflow (tests, build gate, viewports, redirect stubs) must end "completed success"
for i in $(seq 1 40); do r=$(gh api repos/mubashir-rehman/mubashir-rehman.github.io/actions/runs?per_page=1 --jq '.workflow_runs[0] | .head_sha[0:7]+" "+.status+" "+(.conclusion//"")'); case "$r" in *completed*) echo "$r"; break;; esac; sleep 15; done

# 5. Spot check
for p in / /projects/ /about/ /contact/ /llms.txt; do echo "$p $(curl -s -o /dev/null -w '%{http_code}' https://mubashirrehman.com$p)"; done
```

Run steps 2 to 5 as one Bash call with a long timeout; it takes two to three minutes.

## Report to the owner

What is live, both deploy results, the spot-check codes. If the social card changed, remind them to re-fetch it once in LinkedIn's Post Inspector.

## Never

- Force-push `main`, push without the owner's "go live", or push a branch whose QA is red.
- Print or log `CLOUDFLARE_API_TOKEN` or any other credential. The deploy needs none: both hosts build from `main`.
