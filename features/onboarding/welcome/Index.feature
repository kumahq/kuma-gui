Feature: onboarding / welcome
  Background:
    Given the CSS selectors
      | Alias            | Selector                               |
      | skip-button      | [data-testid='onboarding-skip-button'] |
      | environment-text | [data-testid='kuma-environment']       |

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
