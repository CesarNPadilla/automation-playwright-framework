# Automation framework instructions for Claude Code

@AGENTS.md

The imported file is the shared source of repository rules for Codex and Claude Code.
Read docs/agent-workflow.md for project-specific setup and the BDD adaptation workflow.

Claude project agents are playwright-test-planner, playwright-test-generator and
playwright-test-healer under .claude/agents/. Their playwright-test MCP server is
configured in .mcp.json and uses playwright.agent.config.ts. Do not replace this
with the main traced BDD configuration or change global Claude settings.

Use the named agents only for the requested task. Have the parent coding session
adapt reviewed drafts into the framework and apply source repairs. Do not let
generated native tests or skipped failures substitute for reviewed BDD coverage.
