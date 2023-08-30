Feature: onboarding / index
  Background:
    Given the CSS selectors
      | Alias           | Selector                              |
      | skip-button           | [data-testid='onboarding-skip-button'] |
      | table-header    | $table th                             |
      | table-row       | $table tbody tr                       |
      | dataplane-title | [data-testid='data-plane-collection'] |
  Scenario: Visiting onboarding redirects to either welcome or root
    When I visit the "/onboarding" URL
    Then the URL is "/onboarding/welcome"
    Then I click the "$skip-button" element
    And I wait for 300 milliseconds
    Then the URL is "/"
    Then I visit the "/onboarding" URL
    Then the URL is "/"
