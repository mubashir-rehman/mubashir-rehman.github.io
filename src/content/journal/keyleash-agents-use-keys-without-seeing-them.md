---
title: "keyleash: my coding agents use API keys without seeing them"
description: "How keyleash lets coding agents use API keys from the system keyring, approved per command and masked in the output. An open-source Claude Code plugin."
lede: "My agents needed test keys, and every key pasted into chat had to be treated as exposed. keyleash keeps keys in the keyring, asks me before each use, and hides them in the output."
status: published
type: build-log
date: 2026-11-05
tags: ["AI agents", "Security", "Claude Code", "Open source"]
---

I'm building a healthcare product that handles patient data, and much of the work runs through coding agents. Those agents need credentials: test API keys for the voice and payment providers, logins for test accounts, a sudo password now and then.

The easy way is to paste them into the chat. The trouble is where they go next. A key pasted into a session sits in plain text in the session transcript on disk, and it is sent to the model provider with everything else. Once that has happened I can't say who has seen it, so the honest thing is to treat the key as exposed and replace it. Doing that after every round of testing gets old quickly, and it relies on me remembering every time.

I'm not the only one. GitGuardian's [State of Secrets Sprawl 2026](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/) counted 28.65 million new secrets in public GitHub commits in 2025, up 34%, and found that commits made with Claude Code leaked secrets at 3.2%, against a 1.5% baseline. They are careful to say this is not a simple tool failure: the leak still happens through a human workflow. That matches what I saw. The tools were fine; the habit around them was the weak point.

There is a quieter route too. Claude Code remembers the commands you mark "always allow" by saving them, in full, in `.claude/settings.local.json`. A key typed into such a command is saved with it, and that file has [ended up committed to public repositories](https://ironpeak.be/blog/leaking-secrets-from-the-claud/).

## The moment

While setting up my terminal, I needed to give an agent my sudo password. It opened a small desktop popup, I typed the password there, and the command ran. The agent got what it needed and never held the password.

That was the whole idea. If a popup works for sudo, it works for every key. I built the first version that night.

## How it works

keyleash is a Claude Code plugin with a small command-line tool.

1. **I add a key once.** `keyleash add STRIPE_TEST_KEY` opens a popup. The value goes into the system keyring (GNOME Keyring, KWallet or KeePassXC, through the Secret Service), encrypted with my login.
2. **The agent uses it by name.** `keyleash run STRIPE_TEST_KEY -- curl …` runs that one command with `$STRIPE_TEST_KEY` set. Nothing else gets it.
3. **I approve the command.** A popup shows the key's name, the exact command, the directory and the agent session.
4. **The output is masked.** Wherever the value appears in the command's output, the agent sees `[secret:STRIPE_TEST_KEY]` instead, and the same for its base64, hex and URL-encoded forms.

There is no command that prints a value. To see one, I open my desktop's password manager.

Because the agent writes `$STRIPE_TEST_KEY` into its commands, never the key itself, an "always allow" rule saves the name. The settings file can be committed without carrying a secret.

## Approvals that don't make me sit there

Approving every single command is safe and slow. Approving "everything for this session" is fast and gives the whole game away. The popup offers both ends and the middle, in one list:

- Allow once
- Allow *curl* commands this session (the default)
- Allow *curl* commands for 30 minutes
- Allow any command this session
- Allow any command for 30 minutes

"*curl* commands" means the program at that real path, so a `./curl` sitting in the project is not the curl I approved. Programs that can run anything, such as shells, Python, Node, npm, git or docker, only ever get "this exact command", because approving "any `sh` command" would approve everything. Deny, closing the popup or ignoring it for two minutes all mean the command doesn't run, and the agent gets exit code 77, which its instructions say means stop and ask, never look for another way.

## From a habit to something enforced

"Never paste a key into chat" was a habit, and habits break. Written down in a project's instructions, it lasts longer, but an agent can still skip an instruction. So keyleash also ships hooks that run on the agent's tool calls:

- reading the keyring directly (`secret-tool`, the Secret Service bus, the Python library), the approvals file or the settings file is blocked;
- reading another process's environment, where a running command's key lives, is blocked;
- writing something key-shaped into a file needs my approval;
- a message I send that contains something key-shaped is held back instead of sent;
- turning the guard off for a project needs my confirmation in a popup, so the agent can't do it alone.

## What my own review found

Before publishing, I had the code reviewed for security. The biggest finding was in my favourite feature. "Allow this session" approved the *key*, not the command. After one click, any later command could use it with no popup, including one that prints it slightly changed, which the masking would miss.

I didn't want to lose the fast option, because approving every command means sitting next to the machine. So 0.2.0 added the program-scoped choices above and made them the default, kept "any command" for when I want it, and says plainly in the README what each choice gives up. The same review led to showing the start and end of long commands in the popup, so nothing can hide past a cut-off, and to the guard on process environments.

## What it doesn't protect against

keyleash is a fence, not a wall, and the README says so.

- A command I approve receives the real key. If the command sends it somewhere, or prints it in a form the masking doesn't know, keyleash doesn't stop that. I still have to read what I approve.
- Any program running as me can read an unlocked keyring. The hooks stop an agent doing that by accident; they read command text, so a script written to disk and then run is not inspected.
- Passwords and other secrets without a recognisable shape aren't caught when pasted into chat.
- It is Linux only, and the hooks only work in Claude Code.

For a harder boundary there is a separate keyring with its own password, which stays locked between uses.

## Why not an existing tool

I looked at what was already there. 1Password's `op run` injects secrets and masks them in output, but it needs an account and a cloud vault, and its approval unlocks 1Password for the terminal rather than showing me each command. envchain keeps secrets in the same local keyring, but has no approval per use, no masking and no guard against an agent. Bitwarden's `bws run` needs its cloud service and leaves masking to you.

What I wanted was narrower: nothing to sign up for, nothing leaving my machine, and every use something I agreed to, with the command in front of me.

## Try it

keyleash is MIT-licensed: [github.com/mubashir-rehman/keyleash](https://github.com/mubashir-rehman/keyleash). In Claude Code:

```
/plugin marketplace add mubashir-rehman/keyleash
/plugin install keyleash@keyleash
```

It needs `python3-secretstorage` and `zenity`, which ship with Ubuntu's desktop.
