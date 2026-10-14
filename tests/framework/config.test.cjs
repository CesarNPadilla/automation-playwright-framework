const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('config validation', () => {
  const originalEnv = { ...process.env };

  function restoreEnv() {
    for (const key of Object.keys(process.env)) delete process.env[key];
    Object.assign(process.env, originalEnv);
  }

  it('rejects unknown environment names', () => {
    process.env.ENV = 'unknown';
    process.env.UNKNOWN_BASE_URL = 'https://example.com';
    try {
      assert.throws(() => {
        delete require.cache[require.resolve('../../config/index.ts')];
        delete require.cache[require.resolve('../../config/environments.ts')];
        require('../../scripts/register-typescript.cjs');
        require('../../config/index.ts');
      }, /Unknown environment/);
    } finally {
      restoreEnv();
    }
  });

  it('rejects http base URLs', () => {
    process.env.ENV = 'dev';
    process.env.DEV_BASE_URL = 'http://insecure.example.com';
    try {
      assert.throws(() => {
        delete require.cache[require.resolve('../../config/index.ts')];
        delete require.cache[require.resolve('../../config/environments.ts')];
        require('../../scripts/register-typescript.cjs');
        require('../../config/index.ts');
      }, /HTTPS/);
    } finally {
      restoreEnv();
    }
  });
});
