# Framework guide

## Execution flow

```
features/*.feature  →  bddgen  →  Playwright Test
                                       ↓
config/ (env + credentials)  →  Fixtures  →  Steps  →  Pages  →  Application
                                       ↓
                              Reports + traces + resource manifest
```

`features/` describes behavior; `src/steps/` maps sentences to page actions;
`src/pages/` owns locators and assertions; `src/fixtures/` provides objects
and per-scenario state; `config/` resolves the environment.

## Authentication

Every Gherkin scenario starts with a fresh browser context and explicitly logs in.
There is no saved authentication state — login coverage exercises a real login flow.
One worker is used because a shared account may have session limits.
Failed scenarios attempt logout to reduce abandoned server sessions.

## Scenario isolation

Scenario state (`ScenarioState` in `src/support/scenarioState.ts`) is an
in-memory object that is unique to each test attempt and never shared across
retries. Use UUID-based names for created records to separate parallel or
retry runs.

The `scenarioPolicy` fixture (auto-used) enforces `@devOnly` restrictions and
extends the timeout for mutation scenarios.

The `sessionCleanup` fixture (auto-used) logs out on failure to avoid
stranded sessions.

## Environments

`.env` is loaded before URL resolution. Shell and CI environment variables
take precedence. `ENV` selects `dev`, `qa`, `staging`, or `prod`. Unknown
environments and missing URLs cause an early failure. All URLs must use HTTPS
and must not contain embedded credentials.

Use `${ENV}_APP_USERNAME`/`${ENV}_APP_PASSWORD` for environment-specific
credentials. `APP_USERNAME`/`APP_PASSWORD` are the fallback local credentials.

```powershell
$env:ENV = 'qa'
npm run preflight
npm run test:chromium
```

`npm run preflight` validates local configuration without connecting to the
application. It does not verify tenant permissions, resource existence, or
connectivity.

## Playwright configurations

| File | Purpose |
|------|---------|
| `playwright.config.ts` | Main BDD execution: 3 browsers + api project |
| `playwright.agent.config.ts` | Agent exploration only (`tests/agents/`) |
| `playwright.api.config.ts` | Authenticated API diagnostics (tracing off) |
| `playwright.framework.config.ts` | Offline browser helper unit tests |

## Assertions and evidence

Always assert against persisted, visible outcomes. A click or a hidden DOM
element is not sufficient evidence that a state change occurred.

Reports are written to `reports/`. Traces and videos may contain sensitive
data — restrict report access appropriately.

## AI assistance

Agent definitions live in `.claude/agents/` (Claude Code Markdown) and
`.codex/agents/` (Codex TOML). The shared repository rules are in `AGENTS.md`.
The agent MCP server uses `playwright.agent.config.ts` and
`tests/agents/seed.spec.ts`.

Regenerate definitions after upgrading Playwright:

```powershell
npm run agents:init
```

For step-by-step instructions see [agent-workflow.md](agent-workflow.md).
