Feature: onboarding / create-mesh / index
  Background:
    Given the CSS selectors
      | Alias       | Selector                                   |
      | back-button | [data-testid='onboarding-previous-button'] |

  Scenario Outline: With Mode: <Value> the back link is correct
    Given the environment
      """
      KUMA_MODE: <Value>
      """
    When I visit the "/onboarding/create-mesh" URL
    And I click the "$back-button" element
    Then the URL is "<URL>"
    Examples:
      | Value      | URL                     |
      | global     | /onboarding/multi-zone  |
      | standalone | /onboarding/configuration-types |

