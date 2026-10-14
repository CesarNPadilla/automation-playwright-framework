// Check the actual MCP protocol without exposing browser snapshots or application data.
const path = require('node:path');
const { spawn } = require('node:child_process');
const readline = require('node:readline');

async function checkReadiness() {
  const root = path.resolve(__dirname, '..');
  const live = process.argv.includes('--live');
  if (live) {
    require('./register-typescript.cjs');
    const { config, validateCredentials } = require('../config/index.ts');
    if (config.env !== 'dev') throw new Error('The live agent exercise is DEV-only.');
    validateCredentials();
  }
  const cli = path.join(path.dirname(require.resolve('playwright/package.json')), 'cli.js');
  const child = spawn(process.execPath, [cli, 'run-test-mcp-server', '--headless', '--config', 'playwright.agent.config.ts'],
    { cwd: root, stdio: ['pipe', 'pipe', 'pipe'] });
  const pending = new Map();
  let nextId = 0;
  child.stderr.on('data', () => {}); // Never forward server diagnostics or application values.
  const lines = readline.createInterface({ input: child.stdout });
  const failPending = () => {
    for (const waiter of pending.values()) waiter.reject(new Error('MCP server stopped before responding.'));
    pending.clear();
  };
  child.on('error', failPending);
  child.on('exit', failPending);
  lines.on('line', line => {
    let message;
    try { message = JSON.parse(line); } catch { return; }
    const waiter = pending.get(message.id);
    if (!waiter) return;
    pending.delete(message.id);
    if (message.error) waiter.reject(new Error('MCP request failed; inspect client configuration.'));
    else waiter.resolve(message.result);
  });
  function request(method, params) {
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`MCP ${method} timed out.`)); }, live ? 180000 : 30000);
      pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value); },
        reject: error => { clearTimeout(timer); reject(error); } });
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
    });
  }
  try {
    await request('initialize', { protocolVersion: '2024-11-05', capabilities: {},
      clientInfo: { name: 'framework-readiness', version: '1.0.0' } });
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
    const result = await request('tools/list', {});
    const names = new Set(result.tools.map(tool => tool.name));
    for (const required of ['planner_setup_page', 'generator_setup_page', 'test_list', 'test_run', 'test_debug']) {
      if (!names.has(required)) throw new Error(`Required MCP capability missing: ${required}`);
    }
    console.log(`MCP initialize/tools-list passed: ${names.size} tools; planner, generator and test/debug capabilities available.`);
    if (!live) console.log('No seed, browser, login or tenant operation was executed. Named-client agent discovery is a separate check.');
    if (live) {
      // The live exercise navigates to the home page and logs out.
      // Update the navigation and logout selectors below for your application.
      const call = async (name, args) => {
        const response = await request('tools/call', { name, arguments: args });
        if (response.isError) throw new Error(`MCP ${name} failed; browser output withheld to protect application data.`);
        return response;
      };
      try {
        await call('planner_setup_page', { seedFile: 'tests/agents/seed.spec.ts' });
        console.log('planner_setup_page: live seed passed. Update agent-readiness.cjs with real navigation assertions.');
      } finally {
        if (names.has('browser_close')) await request('tools/call', { name: 'browser_close', arguments: {} }).catch(() => {});
      }
    }
  } finally {
    lines.close();
    child.stdin.end();
    child.kill();
  }
}
checkReadiness().catch(error => { console.error(error.message); process.exitCode = 1; });
