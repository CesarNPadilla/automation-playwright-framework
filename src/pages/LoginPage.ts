import { Page } from '@playwright/test';
import { config } from '../../config';

/**
 * Generic login page. Update selectors to match the target application.
 *
 * Selector strategy: prefer ARIA roles and accessible names over CSS classes.
 * Fall back to stable data-testid attributes when ARIA is unavailable.
 */
export class LoginPage {
  private readonly usernameInput = this.page.getByLabel('Username');
  private readonly passwordInput = this.page.getByLabel('Password');
  private readonly submitButton  = this.page.getByRole('button', { name: /log in|sign in/i });
  private readonly logoutTrigger = this.page.getByRole('button', { name: /log out|sign out/i });

  constructor(private readonly page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto(config.baseUrl);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async waitForHomePage(): Promise<void> {
    // TODO: update the expected URL pattern or heading for the application's home page.
    await this.page.waitForURL('**/home**', { timeout: config.timeouts.page });
  }

  async login(username: string, password: string): Promise<void> {
    await this.navigate();
    await this.enterCredentials(username, password);
    await this.submit();
    await this.waitForHomePage();
  }

  async logoutIfAuthenticated(): Promise<void> {
    if (await this.logoutTrigger.isVisible()) {
      await this.logoutTrigger.click();
    }
  }
}
