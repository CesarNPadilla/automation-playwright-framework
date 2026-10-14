@example
Feature: Example feature

  # This is a placeholder feature demonstrating the Gherkin + BDD structure.
  # Replace with real scenarios once the target application is known.
  #
  # Tag conventions:
  #   @smoke        — critical path; run on every push
  #   @devOnly      — mutations allowed only in DEV (enforced by fixture policy)
  #   @regression   — full regression suite
  #   @TestCase_XXX — traceability link to a test management system

  Background:
    Given I am logged in

  Scenario: Navigate to a section and verify content
    Given I navigate to "Example Section"
    Then I should see "Example Content"
