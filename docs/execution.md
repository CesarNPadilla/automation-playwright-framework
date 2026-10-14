# Execution guide

## Local setup

```powershell
npm install
npx playwright install chromium   # add firefox, webkit as needed
cp .env.example .env
# Edit .env with your target environment and credentials
npm run preflight                  # validate config without tenant access
```

## Running tests

```powershell
# Full BDD suite (Chromium)
npm run test:chromium

# Specific tag
bddgen && npx playwright test --project=chromium --grep '@smoke'

# All browsers
npm test

# Generate BDD files and list (no execution)
npm run check
```

## Viewing reports

```powershell
npm run report
```

HTML reports open in the browser. Traces and videos may contain sensitive data.
Restrict report access appropriately.

## Changing target environment

```powershell
$env:ENV = 'qa'
npm run preflight
npm run test:chromium
```

## CI pipeline

The `.gitlab-ci.yml` template defines these stages:

| Job | Trigger | Purpose |
|-----|---------|---------|
| `framework-check` | Every push | Typecheck + generate + offline tests (no tenant) |
| `smoke-test` | Push to protected main | `@smoke` on DEV |
| `regression` | Manual | Full suite |
| `on-demand` | Manual | Configurable tag + browser |
| `api-smoke` | Push to main | Application URL reachability |

Update the image, variables, and job triggers to match your CI environment.

## Debugging failures

1. Open the HTML report: `npm run report`
2. Click on a failing test to view traces, screenshots and video
3. Use `npx playwright test --headed --debug` for interactive debugging
4. For healer-assisted diagnosis: see [agent-workflow.md](agent-workflow.md) Step 5
