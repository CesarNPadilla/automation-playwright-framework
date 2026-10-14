# Playwright BDD automation framework

These rules are shared by Codex and Claude Code. CLAUDE.md imports this file;
client agent formats and setup are documented in docs/agent-workflow.md.
For token-conscious coding tasks, use docs/agent-cli-workflow.md. CLI and MCP
validation are distinct; never silently label a CLI run as named MCP execution.

Read README.md and docs/framework-guide.md before changing the framework.

- Author application coverage in features/ and src/steps/. Browser details belong
  in src/pages/. Never edit .features-gen/.
- Use scenario-owned state. No ordering dependencies or guessed application APIs/IDs.
- Require persisted outcomes; a click or hidden form is insufficient.
- Preserve assertions. Do not skip failures or bypass actionability to get green.
- Use dedicated nonproduction accounts. Do not expose credentials, cookies,
  connector secrets, or unredacted tenant records in logs/plans.
- Exploration uses playwright.agent.config.ts and tests/agents/seed.spec.ts.
  Login is permitted; subsequent exploration is read-only unless the user
  explicitly authorizes the scenario's mutations.
- Healer changes need review. Product failures remain failures.
- Run npm run check, npm run test:framework, and npm run test:helpers.
  Report live tenant validation separately from offline verification.
