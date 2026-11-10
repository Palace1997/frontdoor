---
name: web-build
description: Plan and run multi-file website builds with a lead session and cheap subagents. Use when a request touches more than 5 files, adds a new page or section, or changes shared components.
---

# Web Build

One lead session plans and judges. Short-lived subagents do bounded work. Review effort goes on the plan, not on the finished code.

## Core rules

- The lead's context is the scarce resource. Do not read 40 files yourself. Send a subagent and take back a summary.
- Cheap agents do bounded work. Opus plans. Sonnet builds. Haiku scans.
- A plan change costs a paragraph. A post-build change costs a rebuild. Review the plan.
- Use fresh agents. Long agents get expensive because every step re-reads the whole conversation.
- Every subagent call sets `model` and `effort` explicitly. Never inherit the lead's model.

## Step 0: Project facts

Before planning, confirm these. Check CLAUDE.md and the repo first. Ask John only for what you cannot find.

- Framework and build command (Astro, Next, WordPress, plain HTML, etc.)
- Where the design system lives (CLAUDE.md, tokens file, Figma)
- Whether the site has dark mode. If not, drop it from screenshots.
- Who approves the plan. Send the approval message there.

## Pick the level

Use the lowest level whose trigger is met. Never move up because a task feels important.

| Level | Trigger | What to do |
|---|---|---|
| 1. Solo | A few files you know (copy change, one section, a style fix) | Work directly. No subagents. |
| 2. Orchestrate | Broad search, 2+ independent parts, or more than 5 files | Dispatch subagents, in parallel where independent. Keep an in-session todo list. |
| 3. Plan file | Level 2, and 3+ subagents need the same spec, or the build outlives one session | Write `plans/<feature>-plan.md`. Subagents read the file. |
| 4. Tracker | Work spans several sessions or is handed off | Tracker file plus one plan per phase. |

Examples: a CTA color fix across 3 pages is Level 1. A pricing page with 4 new components is Level 2. A full section with 6 pages, shared components, and new nav is Level 3.

## Model and effort

| Task | Model | Effort |
|---|---|---|
| Find files, grep hardcoded colors, list pages using a component | haiku | low |
| Scans: broken links, missing alt text, missing meta tags, leftover placeholders | haiku | low |
| Build one page or component from a clear packet; run lint, build, Lighthouse | sonnet | medium |
| Design-system review of a built page | sonnet | medium |
| Plan a new section, layout or architecture, ambiguous bugs | opus | high |

Default down, escalate up. If a cheap agent returns weak results, rerun one tier up. Do not repeat the same setting.

## Build flow

1. **Write the plan file.** Split phases by functional area. Shared components first, then pages that use them. Each phase has a `Touches:` line listing folders it changes.
2. **Plan review.** Dispatch reviewers in one message. Give them only the plan path and repo path, never your reasoning.
   - Design-system lens (sonnet/medium): does the plan reuse existing components, tokens, and layouts?
   - Spec lens (sonnet/medium): does the plan cover every page, state, and breakpoint in the brief?
   - Add a security lens only if the plan touches forms, third-party scripts, analytics, or anything that sends data.
3. **Review Checklist.** Fold reviewer items into the plan as `## Review Checklist`. Tag each MUST or SHOULD and the phase that delivers it, for example `[P2]`.
4. **One approval gate.** One message with: phases, checklist count, and every open decision in one table. After approval, build to the end with no per-phase pauses.
5. **Move Card before each phase** (3 lines):
   ```
   MOVE: <what is being built>
     where: <files>
     done when: <screenshots at 1440 and 375, build passes>
   ```
6. **Builders.** One fresh subagent per 5-8 files, sized to finish in about 60 tool uses. Never continue a finished builder for the next part. Start a new one with a short packet: what landed, commit hash, what is next. If a builder reports over about 80 tool uses, make the next packets smaller.
7. **After each phase.** Commit. Then a haiku/low conformance check compares the diff to that phase's checklist items and returns MET, NOT MET, or UNCLEAR. Only a MUST that is NOT MET goes back to the reviewer who wrote it, and only for that phase's diff.
8. **Recap Card after each phase** (3-5 lines): what changed, where, how to verify, checklist status, next move.

## Builder packet

Subagents have no chat history. The packet is their whole brief. Every packet carries:

```
Repo: <path>
Objective: <one sentence, what the page or component must do>
Files you own: <exact list>. Do not edit anything else.
Read first: CLAUDE.md design system section, <existing component to copy from>
Contract: <props, slots, data shape, copy source>
Verification: lint the files you changed, run the site build, open the page
  in the browser at 1440 and 375 wide (light and dark if the site has it),
  save screenshots to .playwright-screenshots/ and list the paths.
  No full test suites.
Stop and report if: the code does not match this packet, you need files
  outside your list, or a command fails again after one reasonable fix.
Never: commit, push, create branches, or start other agents.
Report (under 300 words): status DONE/PARTIAL/BLOCKED, files changed one
  line each, commands run with pass/fail, screenshot paths, open questions.
  No whole files, no raw logs.
```

The lead commits, by file path, after reviewing the diff and spot-checking the cited lines. Reports are leads, not facts.

## Closeout

- Run the web-reviewer agent (or a sonnet/medium design-system review) on every built page. Fix findings.
- Give one outcome line.
- Give a before/now table, one row per page that changed. Problems are rows, not footnotes.
- List screenshot paths for each changed page (1440, 375, dark mode if the site has it).

## Token savers

- Delegate broad reads before reading yourself.
- One fresh builder per 5-8 files.
- Haiku for scans and checks.
- Plan file, not a pasted plan.
- Ask for file:line references and pass/fail lines. Never whole files or raw logs.
- Lint and check changed files per phase. Run full-site audits once at the end.
- Never rerun a check without a code change. Save output to a log and read it.
- Run anything over about 5 minutes in the background.
- Skip plan review for one-page fixes. Level 1 goes straight to build.

## Companion agents

This repo has `.claude/agents/web-builder.md` (sonnet, builds one packet) and `.claude/agents/web-reviewer.md` (sonnet, read-only, returns PASS, WARN, or BLOCK). Use them.

## Rules

- Every subagent call sets model and effort.
- No full-site audits per phase.
- Subagents never commit. The lead commits by path.
- This site deploys from `main` on GitHub Pages. Every push goes live, so check pages before you push.
