Feature: zones / egresses / item
  Background:
    Given the CSS selectors
      | Alias                    | Selector                                      |
      | egress-detail-view       | [data-testid='zone-egress-detail-view']       |
      | egress-config-view       | [data-testid='zone-egress-config-view']       |
      | egress-detail-tabs-view  | [data-testid='zone-egress-detail-tabs-view']  |
      | egress-config-tab        | #zone-egress-config-view-tab a                |
    And the environment
      """
      KUMA_MODE: global
      """

  Scenario: Detail view has expected content
    And the URL "/zoneegressoverviews/item-1" responds with
      """
      body:
        zoneEgress:
          zone: zone-cp-1
          networking:
            address: '166.197.238.26'
            port: 20555
        zoneEgressInsight:
          subscriptions:
            - connectTime: 2019-07-28T16:18:09.743141Z
              disconnectTime: 2019-07-28T16:18:09.743141Z
            - connectTime: 2020-07-28T16:18:09.743141Z
              disconnectTime: !!js/undefined
      """

    When I visit the "/zones/zone-cps/zone-cp-1/egresses/item-1/overview" URL
    Then the page title contains "item-1"

    Then the "$egress-detail-tabs-view" element contains "item-1"
    Then the "$egress-detail-view" element contains "166.197.238.26:20555"
    Then the "$egress-detail-view" element contains "Connected: Jul 28, 2020, 4:18 PM"

    When I click the "$egress-config-tab" element
    Then the "$egress-config-view" element contains "type: ZoneEgress"
