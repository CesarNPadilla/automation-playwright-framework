const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { configureCodexAgent, configureClaudeAgent, mergeClaudeMcp } = require('./agent-config.cjs');
const root = path.resolve(__dirname, '..');
const cli = path.join(path.dirname(require.resolve('playwright/package.json')), 'cli.js');
const target = process.argv[2] || 'all';
if (!['codex', 'claude', 'all'].includes(target)) {
  console.error('Usage: node scripts/init-agents.cjs [codex|claude|all]');
  process.exit(1);
}
const mcpPath = path.join(root, '.mcp.json');
const previousMcp = target !== 'codex' && fs.existsSync(mcpPath)
  ? JSON.parse(fs.readFileSync(mcpPath, 'utf8')) : {};
for (const loop of target === 'all' ? ['codex', 'claude'] : [target]) {
  const result = spawnSync(process.execPath, [cli, 'init-agents', `--loop=${loop}`,
    '--config=playwright.agent.config.ts'], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
  const directory = path.join(root, loop === 'codex' ? '.codex/agents' : '.claude/agents');
  for (const filename of fs.readdirSync(directory)) {
    const matches = loop === 'codex'
      ? filename.startsWith('playwright_test_') && filename.endsWith('.toml')
      : filename.startsWith('playwright-test-') && filename.endsWith('.md');
    if (!matches) continue;
    const file = path.join(directory, filename);
    const content = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file, loop === 'codex' ? configureCodexAgent(content) : configureClaudeAgent(content));
  }
  if (loop === 'claude') {
    const generated = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
    fs.writeFileSync(mcpPath, JSON.stringify(mergeClaudeMcp(previousMcp, generated), null, 2) + '\n');
  }
}
