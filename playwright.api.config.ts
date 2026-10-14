import { defineConfig } from '@playwright/test';

// Tracing off: keep authenticated tokens out of recordings.
export default defineConfig({
  testDir: 'tests/api-auth',
  workers: 1,
  retries: 0,
  outputDir: 'reports/api-auth-results',
  use: {
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },
});
