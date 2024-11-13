Feature: application / loading

  Background:
    Given the CSS selectors
      | Alias              | Selector                                                    |
      | collection-loading | [data-testid$='-collection'] [data-testid='table-skeleton'] |

  Scenario: Collections show a loading view
    Given the environment
      """
      KUMA_LATENCY: 300
      """
    When I visit the "/meshes" URL
    Then the "$collection-loading" element exists
    Then the "$collection-loading" element doesn't exist
