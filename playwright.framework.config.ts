import { defineConfig } from '@playwright/test';

// Offline browser helper tests — never connects to the application under test.
export default defineConfig({
  testDir: 'tests/framework',
  testMatch: '*.spec.ts',
  outputDir: 'reports/framework-results',
  use: {
    browserName: 'chromium',
    headless: true,
  },
});
