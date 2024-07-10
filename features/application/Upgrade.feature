Feature: application / upgrade

  Background:
    Given the CSS selectors
      | Alias         | Selector                      |
      | upgrade-check | [data-testid='upgrade-check'] |
    And the environment
      """
        KUMA_VERSION: 2.0.0
      """

  Scenario: There is a new version available
    When I visit the "/" URL
    And the "$upgrade-check" element exists
