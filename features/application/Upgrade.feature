Feature: application / upgrade
  Background:
    Given the CSS selectors
      | Alias         | Selector                      |
      | upgrade-check | [data-testid='upgrade-check'] |

  Scenario: There is a new version available
    When I load the "/" URL
    And the "$upgrade-check" element exists
