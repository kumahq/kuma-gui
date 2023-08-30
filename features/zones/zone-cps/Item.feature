Feature: zones / zone-cps / item
  Background:
    Given the CSS selectors
      | Alias                    | Selector                                 |
      | zone-detail-tabs-view    | [data-testid='zone-cp-detail-tabs-view'] |
      | tab-overview             | [data-testid='zone-cp-detail-view']      |
      | warning-no-subscriptions | [data-testid='warning-no-subscriptions'] |

    And the URL "/config" responds with
      """
      body:
        mode: global
      """
  Scenario: Zone CP detail view has expected content
    # We always use the final subscription
    # If the disconnectTime is empty then we are online
    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 2
      """
    And the URL "/zones+insights/zone-cp-1" responds with
      """
      body:
        name: zone-cp-1
        zone:
          enabled: true
        zoneInsight:
          subscriptions:
            - connectTime: 2020-07-28T16:18:09.743141Z
              disconnectTime: 2020-07-28T16:18:09.743141Z
            - connectTime: 2020-07-28T16:18:09.743141Z
              disconnectTime: ~
              config: |
                { "environment": "universal", "dpServer": { "auth": { "type": "dpToken" } } }
      """

    When I visit the "/zones/zone-cps/zone-cp-1" URL
    Then the page title contains "zone-cp-1"
    Then the "$zone-detail-tabs-view" element contains "zone-cp-1"

    Then the "$tab-overview" element contains
      | Value     |
      | universal |
      | online    |
      | dpToken   |

    Then the "$tab-overview" element contains "Connected: Jul 28, 2020, 4:18 PM"

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
