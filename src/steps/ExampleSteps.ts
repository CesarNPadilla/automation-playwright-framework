import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures';

const { Given, When, Then } = createBdd(test);

/**
 * Example step definitions — replace with real application steps.
 *
 * Pattern:
 *   Given  → precondition / navigation
 *   When   → user action
 *   Then   → assertion against persisted, visible outcome
 *
 * Never assert on click-only outcomes. Check the application state after the action.
 */

Given('I navigate to {string}', async ({ homePage }, section: string) => {
  await homePage.navigateTo(section);
});

When('I perform an action on {string}', async ({ page }, target: string) => {
  // TODO: implement real interaction
  await page.getByRole('button', { name: target }).click();
});

Then('I should see {string}', async ({ page }, text: string) => {
  await page.getByText(text).waitFor({ state: 'visible' });
});
