# Writing scenarios

## Gherkin authoring rules

- Every scenario must be independent — no execution-order dependencies.
- Use `Background:` only for preconditions shared by **all** scenarios in the file.
- Tag every scenario with at least one category tag (`@smoke`, `@regression`, etc.)
  and optionally a traceability tag (`@TestCase_XXX`).
- Use `@devOnly` for mutation scenarios that are only safe on DEV. The fixture
  enforces this — no application-code guard needed.

## Step vocabulary

Keep step sentences in plain English that a non-technical stakeholder can read.
Match the `Given` / `When` / `Then` intent:

| Keyword | Purpose | Examples |
|---------|---------|---------|
| `Given` | Precondition or starting state | "I am logged in", "I am on the [Page] page" |
| `When`  | User action | "I create a new [Record] named {string}" |
| `Then`  | Persisted, observable outcome | "I should see [Record] in the list" |

## What counts as a sufficient assertion

A click or a hidden DOM element is **not** sufficient. Require:
- The record appears in a **refreshed** list query (not from local state)
- Or a detail page reloads and shows the **persisted** field values
- Or an API/backend confirmation visible in the UI

## Template: new scenario

```gherkin
@smoke @my-feature
Feature: [Feature Name]

  Background:
    Given I am logged in

  Scenario: [Descriptive name — what succeeds]
    Given [precondition]
    When [action]
    Then [persisted visible outcome]
```

## Template: new page object

```typescript
import { Page, expect } from '@playwright/test';

export class MyFeaturePage {
  private readonly heading = this.page.getByRole('heading', { name: 'My Feature' });
  private readonly createButton = this.page.getByRole('button', { name: 'Create' });

  constructor(private readonly page: Page) {}

  async assertLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async clickCreate(): Promise<void> {
    await this.createButton.click();
  }
}
```

## Template: new step file

```typescript
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures';

const { Given, When, Then } = createBdd(test);

// Add the new page object to fixtures/index.ts first.
Given('I am on the My Feature page', async ({ myFeaturePage }) => {
  await myFeaturePage.assertLoaded();
});

When('I create a new record named {string}', async ({ myFeaturePage }, name: string) => {
  await myFeaturePage.clickCreate();
  // ... fill form, submit
});

Then('I should see {string} in the list', async ({ myFeaturePage }, name: string) => {
  await myFeaturePage.assertRecordVisible(name);
});
```
