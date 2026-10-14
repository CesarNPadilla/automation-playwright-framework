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
