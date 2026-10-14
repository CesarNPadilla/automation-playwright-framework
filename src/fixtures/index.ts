import { test as base } from 'playwright-bdd';
import { LoginPage }  from '../pages/LoginPage';
import { HomePage }   from '../pages/HomePage';
import { ScenarioState } from '../support/scenarioState';
import { config } from '../../config';
import { writeFile } from 'node:fs/promises';

interface Fixtures {
  scenarioPolicy:  void;
  sessionCleanup:  void;
  loginPage:       LoginPage;
  homePage:        HomePage;
  /** State owned by this scenario only. */
  scenarioState:   ScenarioState;
  /** Updates the current scenario's in-memory state. */
  saveState:       (patch: Partial<ScenarioState>) => void;
}

export const test = base.extend<Fixtures>({
  scenarioPolicy: [async ({}, use, testInfo) => {
    if (testInfo.tags.includes('@devOnly')) {
      if (config.env !== 'dev') throw new Error('This scenario is restricted to DEV.');
      testInfo.setTimeout(180_000);
    }
    await use();
  }, { auto: true }],

  sessionCleanup: [async ({ scenarioPolicy, page }, use, testInfo) => {
    await use();
    if (testInfo.status !== 'passed') {
      try {
        await new LoginPage(page).logoutIfAuthenticated();
      } catch (error) {
        await testInfo.attach('session-cleanup-failure', {
          body: String(error), contentType: 'text/plain',
        });
      }
    }
  }, { auto: true }],

  loginPage:  async ({ page }, use) => use(new LoginPage(page)),
  homePage:   async ({ page }, use) => use(new HomePage(page)),

  scenarioState: async ({}, use, testInfo) => {
    const state: ScenarioState = {};
    await use(state);
    if (Object.keys(state).length) {
      const manifestPath = testInfo.outputPath('created-resources.json');
      await writeFile(manifestPath, JSON.stringify({
        environment: config.env,
        test: testInfo.title,
        retry: testInfo.retry,
        resources: state,
      }, null, 2));
      await testInfo.attach('created-resource-manifest', {
        path: manifestPath,
        contentType: 'application/json',
      });
    }
  },

  saveState: async ({ scenarioState }, use) => {
    await use((patch) => Object.assign(scenarioState, patch));
  },
});

export { expect } from '@playwright/test';
