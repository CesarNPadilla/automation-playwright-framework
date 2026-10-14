import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { config } from '../../config';

/**
 * Agent exploration seed — used with playwright.agent.config.ts only.
 *
 * Logs in and leaves the page authenticated so the AI agent can explore.
 * Use a dedicated test account; log out and close the browser when done.
 * This test is excluded from normal regression by playwright.agent.config.ts.
 */
test('authenticated exploration seed', async ({ page }) => {
  const login = new LoginPage(page);
  await login.navigate();
  await login.enterCredentials(config.credentials.username, config.credentials.password);
  await login.submit();
  await login.waitForHomePage();
  // Leave the page available for the exploration tool.
});
