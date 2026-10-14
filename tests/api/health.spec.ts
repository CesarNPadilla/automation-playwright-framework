import { test, expect } from '@playwright/test';
import { config } from '../../config';

test('application URL is reachable', async ({ request }) => {
  const response = await request.get(config.baseUrl, { failOnStatusCode: false });
  expect(response.status(), `Expected ${config.baseUrl} to respond; got ${response.status()}`).toBeLessThan(500);
});
