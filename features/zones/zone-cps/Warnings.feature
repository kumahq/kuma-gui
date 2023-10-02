Feature: zones / zone-cps / warnings
  Background:
    Given the CSS selectors
      | Alias                    | Selector                                  |
      | warning-no-subscriptions | [data-testid='warning-no-subscriptions']  |
      | warning-memory           | [data-testid='warning-STORE_TYPE_MEMORY'] |
    And the environment
      """
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
    When I visit the "/zones/zone-cps/zone-cp-1" URL
    And I click the "#zone-cp-config-view-tab a" element
    Then the "$warning-no-subscriptions" element exists

  Scenario Outline: When store type is memory a warning is shown "<URL>"
    And the URL "/config" responds with
      """
      body:
        store:
          type: memory
      """
    When I visit the "<URL>" URL
    Then the "$warning-memory" element exists
    Examples:
      | URL                              |
      | /zones/zone-cps                  |
      | /zones/zone-cps/zone-cp-1        |
      | /zones/zone-cps/zone-cp-1/config |

  Scenario Outline: When store type is kubernetes a warning isn't shown at "<URL>"
    And the URL "/config" responds with
      """
      body:
        store:
          type: kubernetes
      """
    When I visit the "<URL>" URL
    Then the "$warning-memory" element doesn't exist
    Examples:
      | URL                              |
      | /zones/zone-cps                  |
      | /zones/zone-cps/zone-cp-1        |
      | /zones/zone-cps/zone-cp-1/config |

