import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures';
import { config } from '../../config';

const { Given, When, Then } = createBdd(test);

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.navigate();
});

When('I log in with valid credentials', async ({ loginPage }) => {
  await loginPage.enterCredentials(config.credentials.username, config.credentials.password);
  await loginPage.submit();
});

Then('I should be on the home page', async ({ homePage }) => {
  await homePage.assertLoaded();
});

Given('I am logged in', async ({ loginPage }) => {
  await loginPage.login(config.credentials.username, config.credentials.password);
});
