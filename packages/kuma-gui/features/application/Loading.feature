Feature: application / loading

  Background:
    Given the CSS selectors
      | Alias              | Selector                        |
      | collection-loading | [data-testid='list-skeleton']   |
      | collection         | [data-testid='mesh-collection'] |

  Scenario: Collections show a loading view
    Given the environment
      """
      KUMA_LATENCY: 300
      """
    When I visit the "/meshes" URL
    Then the "$collection-loading" element exists
    Then the "$collection" element exists but the "$collection-loading" element doesn't exist
