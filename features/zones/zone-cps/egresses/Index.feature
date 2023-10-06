Feature: zones / egresses / index
  Background:
    Given the CSS selectors
      | Alias | Selector                                        |
      | item  | [data-testid='zone-egress-collection'] tbody tr |

  Scenario Outline: List view has expected content in <Mode> Mode
    Given the environment
      """
      KUMA_MODE: <Mode>
      KUMA_ZONEEGRESS_COUNT: 2
      KUMA_SUBSCRIPTION_COUNT: 2
      """
    And the URL "/zoneegressoverviews" responds with
      """
      body:
        items:
          - name: zone-egress-1
            zoneEgress:
              zone: zone-cp-1
            zoneEgressInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: !!js/undefined

          - name: zone-egress-2
            zoneEgress:
              zone: zone-cp-1
            zoneEgressInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z

          - name: zone-egress-3-is-not-part-of-this-zone
            zoneEgress:
              zone: zone-cp-not-zone-cp-1
            zoneEgressInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
      """

    When I visit the "<URL>" URL
    Then the page title contains "Egresses"
    And the "$item" element exists <Items> times

    Then the "$item:nth-child(1) .status-column" element contains "online"
    Then the "$item:nth-child(1) .name-column" element contains "zone-egress-1"

    Then the "$item:nth-child(2) .status-column" element contains "offline"
    Then the "$item:nth-child(2) .name-column" element contains "zone-egress-2"

    Examples:
      | Mode       | URL                                | Items |
      | global     | /zones/zone-cps/zone-cp-1/egresses | 2     |
      | standalone | /zones/egresses                    | 3     |
