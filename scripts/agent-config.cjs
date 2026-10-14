const sharedInstructions = `Repository requirements: read AGENTS.md and docs/agent-workflow.md before using tools.
Use playwright.agent.config.ts and tests/agents/seed.spec.ts. Keep plans in specs/.
Native drafts are intermediate: final application coverage belongs in features/, src/steps/, src/pages/ and fixtures.
Never edit .features-gen/, expose secrets, skip failures, or weaken assertions. Healer output is a proposed source repair for review.
Use only authorized actions against the target application.`;

function configureCodexAgent(text) {
  let updated = text.replace('"run-test-mcp-server"]',
    '"run-test-mcp-server", "--config", "playwright.agent.config.ts"]');
  if (!updated.includes('"--config", "playwright.agent.config.ts"')) throw new Error('Generated Codex MCP format changed; review the initializer.');
  if (!updated.includes('"--headless"')) updated = updated.replace('"run-test-mcp-server",', '"run-test-mcp-server", "--headless",');
  if (!updated.includes(sharedInstructions)) {
    if (!updated.includes('developer_instructions = """')) throw new Error('Generated Codex instruction format changed.');
    updated = updated.replace('developer_instructions = """', 'developer_instructions = """\n' + sharedInstructions + '\n');
  }
  return updated;
}

function configureClaudeAgent(text) {
  if (text.includes(sharedInstructions)) return text;
  const frontmatter = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(text);
  if (!frontmatter) throw new Error('Generated Claude agent frontmatter changed.');
  return frontmatter[0] + '\n' + sharedInstructions + '\n' + text.slice(frontmatter[0].length);
}

function mergeClaudeMcp(previous, generated) {
  const merged = { ...previous, ...generated,
    mcpServers: { ...previous.mcpServers, ...generated.mcpServers } };
  const server = merged.mcpServers['playwright-test'];
  if (!server || !Array.isArray(server.args) || !server.args.includes('run-test-mcp-server')) {
    throw new Error('Generated Claude MCP server format changed.');
  }
  const configIndex = server.args.indexOf('--config');
  if (configIndex < 0) server.args.push('--config', 'playwright.agent.config.ts');
  else server.args[configIndex + 1] = 'playwright.agent.config.ts';
  if (!server.args.includes('--headless')) server.args.splice(server.args.indexOf('run-test-mcp-server') + 1, 0, '--headless');
  return merged;
}

module.exports = { configureCodexAgent, configureClaudeAgent, mergeClaudeMcp };
