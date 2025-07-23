Feature: zones / index

  Background:
    Given the CSS selectors
      | Alias             | Selector                                    |
      | zone-cp-table-row | [data-testid='zone-cp-collection'] tbody tr |

  Scenario: List view has expected content
    Given the environment
      """
      KUMA_ZONE_COUNT: 3
      KUMA_SUBSCRIPTION_COUNT: 2
      KUMA_MODE: global
      """
    And the URL "/zones/_overview" responds with
      """
      body:
        items:
          - name: zone-cp-1
            zone:
              enabled: true
            zoneInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  config: '{"store": {"type": "memory"}}'
                  version:
                    kumaCp:
                      version: 1.0.0-rc2-211-g823fe8ce
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: !!js/undefined
                  config: '{"store": {"type": "memory"}}'
                  version:
                    kumaCp:
                      version: 1.0.0-rc2-211-not-the-version-i-want
          - name: zone-cp-2
            zone:
              enabled: true
            zoneInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  config: '{"store": {"type": "memory"}}'
                  version:
                    kumaCp:
                      version: 1.0.0-rc2-211-g823fe8ce
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  version:
                    kumaCp:
                      version: 1.0.0-rc2-211-not-the-version-i-want
          - name: zone-cp-3
            zone:
              enabled: false
            zoneInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
      """
    When I visit the "/zones" URL
    Then the page title contains "Zone control planes"
    Then the "$zone-cp-table-row:nth-child(1) .state-column" element contains "Online"
    Then the "$zone-cp-table-row:nth-child(1) .name-column" element contains "zone-cp-1"
    Then the "$zone-cp-table-row:nth-child(1) .zoneCpVersion-column" element contains "1.0.0-rc2-211-g823fe8ce"
    Then the "$zone-cp-table-row:nth-child(2) .state-column" element contains "Offline"
    Then the "$zone-cp-table-row:nth-child(2) .name-column" element contains "zone-cp-2"
    Then the "$zone-cp-table-row:nth-child(2) .zoneCpVersion-column" element contains "1.0.0-rc2-211-g823fe8ce"
    Then the "$zone-cp-table-row:nth-child(3) .state-column" element contains "Disabled"
    Then the "$zone-cp-table-row:nth-child(3) .name-column" element contains "zone-cp-3"
