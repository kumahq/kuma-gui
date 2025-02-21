Feature: application / warnings

  Background:
    Given the CSS selectors
      | Alias                     | Selector                                              |
      | memory-store-type-warning | [data-testid='notification-global-store-type-memory'] |

  Scenario: Using the memory store type shows a warning
    Given the environment
      """
      KUMA_STORE_TYPE: memory
      """
    When I visit the "/" URL
    Then the "$memory-store-type-warning" element exists

  Scenario: Using the postgres store type doesn't show a warning
    Given the environment
      """
      KUMA_STORE_TYPE: postgres
      """
    When I visit the "/" URL
    Then the "$memory-store-type-warning" element doesn't exist
