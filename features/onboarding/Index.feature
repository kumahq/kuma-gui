Feature: onboarding / index
  Background:
    Given the CSS selectors
      | Alias            | Selector                               |
      | skip-button      | [data-testid='onboarding-skip-button'] |
      | table-header     | $table th                              |
      | table-row        | $table tbody tr                        |
      | dataplane-title  | [data-testid='data-plane-collection']  |
      | environment-text | [data-testid='kuma-environment']       |

  Scenario: Visiting onboarding redirects to either welcome or root
    When I visit the "/onboarding" URL
    Then the URL is "/onboarding/welcome"
    Then I click the "$skip-button" element
    And I wait for 300 milliseconds
    Then the URL is "/"

  Scenario Outline: The onboarding welcome shows the correct text for <Value>
    Given the environment
      """
      KUMA_ENVIRONMENT: <Value>
      """
    When I visit the "/onboarding/welcome" URL
    Then the "$environment-text" element contains "<Text>"
    Examples:
      | Value      | Text       |
      | universal  | Universal  |
      | kubernetes | Kubernetes |
