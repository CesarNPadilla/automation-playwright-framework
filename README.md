# Automation Playwright Framework

A BDD automation framework built on [Playwright](https://playwright.dev/) and
[playwright-bdd](https://vitalets.github.io/playwright-bdd/) for end-to-end testing
of web applications.

## Adapting this template for a new project

This is a ready-to-clone scaffold. Follow these steps once per new engagement:

1. **Copy and initialise**
   ```powershell
   cp -r automation-playwright-framework-template my-project-name
   cd my-project-name
   git init && git add . && git commit -m "chore: initialise framework from template"
   ```

2. **Install dependencies and browsers**
   ```powershell
   npm install
   npx playwright install chromium
   ```

3. **Configure the target application**
   ```powershell
   cp .env.example .env
   # Edit .env: set ENV, DEV_BASE_URL, APP_USERNAME, APP_PASSWORD
   ```

4. **Update page object selectors**
   - [src/pages/LoginPage.ts](src/pages/LoginPage.ts) — update the `usernameInput`, `passwordInput`, `submitButton`,
     `logoutTrigger` selectors and the `waitForHomePage()` URL pattern to match the target application.
   - [src/pages/HomePage.ts](src/pages/HomePage.ts) — update `pageHeading` and navigation selectors.

5. **Validate configuration**
   ```powershell
   npm run preflight
   npm run check
   ```

6. **Run the smoke suite**
   ```powershell
   npm run test:smoke -- --project=chromium
   ```

7. **Add real scenarios** — replace [features/example.feature](features/example.feature) with real Gherkin,
   add page objects in `src/pages/`, step definitions in `src/steps/`, and wire them into [src/fixtures/index.ts](src/fixtures/index.ts).
   See [docs/writing-scenarios.md](docs/writing-scenarios.md) and [docs/agent-workflow.md](docs/agent-workflow.md).

---

## Prerequisites

- Node.js 20+
- npm 10+

## Quick start

```powershell
npm install
npx playwright install chromium
cp .env.example .env
# Edit .env: set ENV, BASE_URL, credentials
npm run preflight
npm run test:smoke -- --project=chromium
```

## Project structure

```
features/          Gherkin scenarios (source of truth)
src/steps/         Step definitions (createBdd bindings)
src/pages/         Page objects (locators + assertions)
src/fixtures/      Extended test object (fixtures)
src/support/       Scenario state + helpers
src/api/           Authenticated API client (tracing off)
config/            Environment resolution + validation
tests/agents/      Agent exploration seed
tests/api/         Reachability checks
tests/framework/   Offline unit tests for helpers
docs/              Architecture guides and how-tos
specs/             Agent-produced plans + reviewed drafts
scripts/           Preflight, agent init, CI helpers
```

## Available scripts

| Script | Purpose |
|--------|---------|
| `npm run generate` | Regenerate BDD test files from features |
| `npm test` | Run all BDD scenarios |
| `npm run test:smoke` | Run @smoke-tagged scenarios |
| `npm run test:chromium` | Run scenarios in Chromium |
| `npm run test:firefox` | Run scenarios in Firefox |
| `npm run test:webkit` | Run scenarios in WebKit |
| `npm run check` | Typecheck + generate + list tests |
| `npm run preflight` | Validate local config (no tenant access) |
| `npm run test:framework` | Offline unit tests |
| `npm run test:helpers` | Browser helper tests |
| `npm run report` | Open HTML report |
| `npm run agents:init` | Regenerate agent definitions |
| `npm run agents:check` | Verify MCP server readiness |

## Configuration

Copy `.env.example` to `.env` and fill in values for your target environment.
See [docs/framework-guide.md](docs/framework-guide.md) for architecture details
and [docs/agent-workflow.md](docs/agent-workflow.md) for AI agent usage.

## AI agents

Three specialized agents support the plan → generate → heal workflow:

| Agent | Purpose |
|-------|---------|
| `playwright-test-planner` | Explore the app and produce a test plan in specs/ |
| `playwright-test-generator` | Execute plan steps live and write a native draft |
| `playwright-test-healer` | Debug failures and propose source repairs |

See [docs/agent-workflow.md](docs/agent-workflow.md) for step-by-step instructions.

### Before triggering any agent

> **The agent reads the target URL and login credentials from `.env`, not from the prompt.**
> Set `DEV_BASE_URL`, `APP_USERNAME`, and `APP_PASSWORD` in `.env` before running any agent prompt.
> Run `npm run preflight` and `npm run test:smoke -- --project=chromium` to confirm the configuration is valid.

```env
ENV=dev
DEV_BASE_URL=https://your-app-url.com
APP_USERNAME=your-test-account@example.com
APP_PASSWORD=your-test-password
```

### Prompt: Step 1 — trigger the test planner

Use this prompt in a Claude Code session to explore a feature and produce a plan in `specs/`.

```text
Read CLAUDE.md and docs/agent-workflow.md. Use playwright-test-planner to inspect
the DEV [Feature Name] flow using playwright.agent.config.ts and
tests/agents/seed.spec.ts.

Acceptance criteria:
- The [role] can [action] and see [expected outcome].
- [Add additional criteria as bullet points.]

Use the dedicated configured test account from .env.
Login and navigation are allowed; creating/updating/deleting records is NOT allowed.

Check existing coverage in features/ first and identify whether a new scenario
is justified. Do not duplicate existing scenarios.

Save the plan in specs/[feature-name].md. The plan must include:
- Prerequisites and starting state
- Step-by-step scenario instructions
- Expected outcomes per step
- Data dependencies
- Edge cases and negative scenarios
- Unanswered questions or blockers

Do not implement tests or invent business rules.
Return the plan file path and a coverage recommendation.
```

**Concrete example:**

```text
Read CLAUDE.md and docs/agent-workflow.md. Use playwright-test-planner to inspect
the DEV User Login flow using playwright.agent.config.ts and
tests/agents/seed.spec.ts.

Acceptance criteria:
- A standard user can log in with valid credentials and land on the dashboard.
- A standard user sees an error message when entering an incorrect password.
- A locked account cannot log in and sees an appropriate message.

Use the dedicated configured test account from .env.
Login is allowed; no record creation, updates, or deletions.

Check existing coverage in features/ first.

Save the plan in specs/user-login.md. Include prerequisites, step-by-step
instructions, expected outcomes, edge cases (empty fields, SQL injection input,
session expiry), data dependencies, and any unanswered questions.

Do not implement tests or invent business rules.
Return the plan path and coverage recommendation.
```

### Prompt: Step 2 — trigger the test generator

Use this prompt after reviewing the plan produced in Step 1. Pick one scenario from the plan that represents a coverage gap, then run this prompt. The agent executes each step live in the browser and writes a native Playwright draft under `tests/agents/`.

```text
Delegate the selected scenario in specs/[feature-name].md to
playwright-test-generator. Use tests/agents/seed.spec.ts and
playwright.agent.config.ts.

Scenario to generate: [Scenario title from the plan, e.g. "1.1 Successful login with valid credentials"]

Verify locators and assertions against the live page.
Generate only the selected scenario as a native draft under tests/agents/.
Respect the plan's allowed actions — no mutations unless the plan explicitly permits them.

Report:
- The draft file path (tests/agents/[scenario-name].spec.ts)
- Execution evidence (steps completed, assertions verified)
- Any unmet prerequisites or locator issues found

Do not change existing application scenarios or edit .features-gen/.
```

**Concrete example:**

```text
Delegate the selected scenario in specs/user-login.md to
playwright-test-generator. Use tests/agents/seed.spec.ts and
playwright.agent.config.ts.

Scenario to generate: "1.1 Successful login with valid credentials"

Verify locators and assertions against the live page.
Generate only this scenario as a native draft under tests/agents/.
No record creation, updates, or deletions.

Report the draft path, execution evidence, and any unmet prerequisites.
Do not change existing application scenarios or edit .features-gen/.
```

> **After this step** the parent Claude Code session (not the generator agent) adapts the reviewed draft into the BDD framework: Gherkin in `features/`, step definitions in `src/steps/`, browser behaviour in `src/pages/`.

### Step 3 — test healer (triggered automatically, no prompt needed)

The `playwright-test-healer` agent **does not need a manual trigger prompt** under normal workflow. It is invoked explicitly only when a test is already failing. When you need it, supply the failing test name and any error context:

```text
Delegate diagnosis of the failing test [test file or test name] to
playwright-test-healer. Read AGENTS.md first.

Error context: [paste the failure message or trace path]

Distinguish between locator/timing issues, data/configuration problems,
and product defects. Propose the smallest source repair and explain the evidence.

Preserve assertions and failure status. Do not skip the test, change expected
business outcomes, or edit .features-gen/.
Return the proposed patch and the targeted verification command for review.
```

> The healer runs all failing tests, debugs each one, proposes a repair, and verifies it by re-running. Its output is always a **proposed patch for human review** — never a silent fix.
