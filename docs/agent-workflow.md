# Creating and maintaining scenarios with Codex and Claude Code

Playwright provides the same three agent roles for both clients, with different
configuration formats. Codex reads TOML in `.codex/agents/`; Claude Code reads
Markdown with YAML frontmatter in `.claude/agents/`.

| Codex name | Claude Code name | Intended output |
|---|---|---|
| `playwright_test_planner` | `playwright-test-planner` | Scenario plan based on requirements and live exploration |
| `playwright_test_generator` | `playwright-test-generator` | Native Playwright draft for a reviewed scenario |
| `playwright_test_healer` | `playwright-test-healer` | Failure diagnosis and a proposed repair |

`AGENTS.md` is the shared repository policy. Claude Code's `CLAUDE.md` imports it.
Generated definitions also receive the shared framework requirements from
`scripts/agent-config.cjs`, so regeneration keeps those requirements.

## Setup and verify readiness

1. Open this repository as the working project; read `AGENTS.md` and the framework guide.
2. Configure a dedicated approved DEV account in the ignored `.env` and install Chromium.
3. Verify preflight and the login smoke test before exploring a new page.
4. Confirm the client can discover the three project agents and their MCP tools.

```powershell
npm install
npx playwright install chromium
npm run preflight
npm run agents:check
npm run test:smoke -- --project=chromium
npx playwright test --config=playwright.agent.config.ts --list
```

Definitions are already checked in. Regenerate after upgrading Playwright:

```powershell
npm run agents:init
# Regenerate only one client's files when needed.
npm run agents:init:codex
npm run agents:init:claude
```

Run `npm run agents:check:live` for a live MCP validation exercise against the
configured DEV environment.

## Step 1: Plan a small scenario

Supply acceptance criteria, role, prerequisite data, environment, allowed actions
and expected outcomes. Start with a read-only flow while learning the framework.

Example Claude Code prompt (replace placeholders with real details):

```text
Read CLAUDE.md and docs/agent-workflow.md. Use playwright-test-planner to inspect
the DEV [Feature Name] flow using playwright.agent.config.ts and
tests/agents/seed.spec.ts.

Acceptance criteria: the [role] can [action] and see [expected outcome].
Use the dedicated configured test account.
Login and navigation are allowed; creating/updating/deleting records is not.
Check existing coverage first and identify whether a new scenario is justified.

Save the plan in specs/[feature-name].md. Include prerequisites, steps,
expected outcomes, data dependencies and unanswered questions. Do not implement
tests or invent business rules. Return the plan path and coverage recommendation.
```

## Step 2: Generate a draft from the reviewed plan

Use this only after choosing a coverage gap in the plan:

```text
Delegate the selected scenario in specs/[feature-name].md to
playwright-test-generator. Use tests/agents/seed.spec.ts and
playwright.agent.config.ts. Verify locators and assertions against the live page.
Generate only the selected scenario as a native draft under tests/agents/.
Respect the plan's allowed actions. Report the draft path, execution evidence
and any unmet prerequisites. Do not change existing application scenarios.
```

## Step 3: Adapt into the framework

Ask the parent Claude Code session to do the repository edits:

```text
Adapt the reviewed native draft and plan into this repository's BDD architecture.
Reuse existing bindings first. Put the scenario in features/, new sentences in
src/steps/, browser behavior in page objects, and reusable dependencies in fixtures.
Keep prerequisites scenario-owned and environment values in configuration.
Do not edit .features-gen/ or weaken assertions. Run npm run check,
npm run test:framework and npm run test:helpers. Report the changed files and
the command selecting the scenario. Do not execute tenant mutations.
```

## Step 4: Execute the approved coverage

```powershell
npm run generate
npx playwright test --project=chromium --grep '@YOUR_TAG' --list
npx playwright test --project=chromium --grep '@YOUR_TAG'
```

## Step 5: Diagnose and repair failures

```text
Delegate diagnosis of the named failing test to playwright-test-healer.
Read AGENTS.md first. Use the supplied error context and trace to distinguish
locator/timing issues, data/configuration problems and product defects.
Propose the smallest source repair and explain the evidence. Preserve assertions
and failure status; do not skip the test, change expected business outcomes or
edit .features-gen/. Return the proposed patch and targeted verification command
for review.
```

## Completion criteria

A scenario is ready when its expected outcomes are reviewed, code follows the
framework layers, offline checks pass, and authorized targeted execution has
evidence. A successful exploration or native draft alone is not completed BDD
integration.
