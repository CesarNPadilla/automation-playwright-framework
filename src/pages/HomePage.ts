import { Page, expect } from '@playwright/test';

/**
 * Home page / dashboard page object.
 *
 * Replace the selector constants below with ones from the target application.
 * Each method should assert a persisted, visible outcome — not just a click.
 */
export class HomePage {
  private readonly pageHeading = this.page.getByRole('heading', { level: 1 });

  constructor(private readonly page: Page) {}

  async assertLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }

  async navigateTo(section: string): Promise<void> {
    // TODO: implement navigation to the named section using the application's nav structure.
    await this.page.getByRole('navigation').getByRole('link', { name: section }).click();
  }
}
