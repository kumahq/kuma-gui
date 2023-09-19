Feature: onboarding / index
  Background:
    Given the CSS selectors
      | Alias            | Selector                               |
      | skip-button      | [data-testid='onboarding-skip-button'] |
      | environment-text | [data-testid='kuma-environment']       |

  Scenario: Visiting onboarding redirects to welcome
    When I visit the "/onboarding" URL
    Then the URL is "/onboarding/welcome"

  Scenario Outline: The onboarding "<URL>" page skip button works
    When I visit the "<URL>" URL
    Then I click the "$skip-button" element
    Then the URL is "/"
    Examples:
      | URL                 |
      | /onboarding/welcome |
      | /onboarding/deployment-types |
      | /onboarding/configuration-types |
      | /onboarding/multi-zone |
      | /onboarding/create-mesh |
      | /onboarding/add-services |
      | /onboarding/add-services-code |
      | /onboarding/dataplanes-overview |

