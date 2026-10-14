import { APIRequestContext } from '@playwright/test';
import { config } from '../../config';

/**
 * Authenticated REST client for the application under test.
 *
 * IMPORTANT: Only use this client with playwright.api.config.ts (trace: 'off').
 * The apiClient fixture enforces this to prevent tokens from appearing in traces.
 *
 * Replace the authentication and endpoint patterns below with the real application's API.
 */
export class AppApiClient {
  constructor(private readonly request: APIRequestContext) {}

  /** Verify the application is reachable. */
  async healthCheck(): Promise<boolean> {
    const response = await this.request.get(`${config.baseUrl}/health`, {
      failOnStatusCode: false,
    });
    return response.ok();
  }

  // TODO: add authenticated endpoints once the API contract is known.
  // Example:
  //
  // async getUser(id: string) {
  //   const response = await this.request.get(`${config.baseUrl}/api/users/${id}`);
  //   return response.json();
  // }
}
