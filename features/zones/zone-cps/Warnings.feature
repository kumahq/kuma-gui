Feature: zones / zone-cps / warnings
  Background:
    Given the CSS selectors
      | Alias                    | Selector                                                             |
      | warning-no-subscriptions | [data-testid='warning-no-subscriptions']                             |
      | warning-zone-memory      | [data-testid='warning-ZONE_STORE_TYPE_MEMORY']                       |
      | zone-cp-table-row        | [data-testid='zone-cp-collection'] tbody tr                          |
      | warning-trigger          | $zone-cp-table-row:nth-child(1) span[data-testid="warning"]          |
      | warning-memory           | $zone-cp-table-row:nth-child(1) [data-testid="warning-store_memory"] |
    And the environment
      """
      KUMA_ZONE_COUNT: 1
      KUMA_MODE: global
      """

  Scenario: When subscriptions aren't set a warning is shown
    And the URL "/zones+insights/zone-cp-1" responds with
      """
      body:
        name: zone-cp-1
        zoneInsight:
          subscriptions: ~
      """
    When I visit the "/zones/zone-cps/zone-cp-1/overview" URL
    And I click the "#zone-cp-config-view-tab a" element
    Then the "$warning-no-subscriptions" element exists

  Scenario: When zone store type is memory a warning is shown in listings
    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 1
      """
    And the URL "/config" responds with
      """
      body:
        store:
          type: kubernetes
      """
    And the URL "/zones+insights" responds with
      """
      body:
        items:
          - zoneInsight:
              subscriptions:
                - config: '{"environment":"kubernetes", "store": {"type": "memory"}}'
      """
    When I visit the "/zones/zone-cps" URL
    And I hover on the "$warning-trigger" element
    Then the "$warning-memory" element exists

  Scenario Outline: When store type is memory a warning is shown "<URL>"
    And the URL "/config" responds with
      """
      body:
        store:
          type: memory
      """
    When I visit the "<URL>" URL
    Then the "$warning-zone-memory" element exists
    Examples:
      | URL                                |
      | /zones/zone-cps/zone-cp-1/overview |
      | /zones/zone-cps/zone-cp-1/config   |

  Scenario Outline: When store type is kubernetes a warning isn't shown at "<URL>"
    And the URL "/config" responds with
      """
      body:
        store:
          type: kubernetes
      """
    When I visit the "<URL>" URL
    Then the "$warning-zone-memory" element doesn't exist
    Examples:
      | URL                                |
      | /zones/zone-cps/zone-cp-1/overview |
      | /zones/zone-cps/zone-cp-1/config   |
