@smoke @login
Feature: Login

  Background:
    Given I am on the login page

  Scenario: Successful login with valid credentials
    When I log in with valid credentials
    Then I should be on the home page
