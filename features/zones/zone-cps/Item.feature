Feature: zones / item
  Background:
    Given the CSS selectors
      | Alias                 | Selector                                 |
      | zone-detail-tabs-view | [data-testid='zone-cp-detail-tabs-view'] |
      | tab-overview          | [data-testid='zone-cp-detail-view']      |
    And the environment
      """
      KUMA_MODE: global
      """

  Scenario: Detail view has expected content
    # We always use the final subscription
    # If the disconnectTime is empty then we are online
    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 2
      """
    And the URL "/zones/zone-cp-1/_overview" responds with
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
              disconnectTime: !!js/undefined
              config: |
                { "environment": "universal", "store": {"type": "memory"}, "dpServer": { "auth": { "type": "dpToken" } } }
      """

    When I visit the "/zones/zone-cp-1/overview" URL
    Then the page title contains "zone-cp-1"
    Then the "$zone-detail-tabs-view" element contains "zone-cp-1"

    Then the "$tab-overview" element contains
      | Value     |
      | Universal |
      | online    |
      | dpToken   |

    Then the "$tab-overview" element contains "Connected: Jul 28, 2020, 4:18 PM"
