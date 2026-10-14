import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { config } from './config';

const bddDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['src/steps/**/*.ts', 'src/fixtures/index.ts'],
});

export default defineConfig({
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Keep one worker while a single shared account is used. Data is scenario-scoped.
  workers: 1,
  outputDir: 'reports/test-results',
  timeout: 120_000,
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ['list'],
  ],
  use: {
    baseURL: config.baseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: process.env.HEADLESS !== 'false',
    actionTimeout: config.timeouts.element,
    navigationTimeout: config.timeouts.page,
  },
  projects: [
    {
      name: 'chromium',
      testDir: bddDir,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testDir: bddDir,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testDir: bddDir,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'api',
      testDir: 'tests/api',
    },
  ],
});
