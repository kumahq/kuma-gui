Feature: onboarding / configuration-types / index
  Background:
    Given the CSS selectors
      | Alias            | Selector                               |
      | next-button      | [data-testid='onboarding-next-button'] |
  Scenario Outline: With Mode: <Value> the next link is correct
    Given the environment
      """
      KUMA_MODE: <Value>
      """
    When I visit the "/onboarding/configuration-types" URL
    And I click the "$next-button" element
    Then the URL is "<URL>"
    Examples:
      | Value      | URL                     |
      | global     | /onboarding/multi-zone  |
      | standalone | /onboarding/create-mesh |
