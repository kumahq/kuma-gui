Feature: Zones: Detail view content
  Background:
    Given the CSS selectors
      | Alias                    | Selector                                      |
      | ingress-detail-view      | [data-testid='zone-ingress-detail-view']      |
      | ingress-config-view      | [data-testid='zone-ingress-config-view']      |
      | ingress-detail-tabs-view | [data-testid='zone-ingress-detail-tabs-view'] |
      | ingress-config-tab       | #zone-ingress-config-view-tab a               |
      | egress-detail-view       | [data-testid='zone-egress-detail-view']       |
      | egress-config-view       | [data-testid='zone-egress-config-view']       |
      | egress-detail-tabs-view  | [data-testid='zone-egress-detail-tabs-view']  |
      | egress-config-tab        | #zone-egress-config-view-tab a                |
    And the environment
      """
      KUMA_MODE: global
      """
  Scenario: Zone Ingress detail view has expected content
    And the URL "/zoneingresses+insights/zone-ingress-1" responds with
      """
      body:
        name: zone-ingress-1
        zoneIngress:
          zone: zone-cp-1
          networking:
            address: '166.197.238.26'
            port: 20555
        zoneIngressInsight:
          subscriptions:
            - connectTime: 2019-07-28T16:18:09.743141Z
              disconnectTime: 2019-07-28T16:18:09.743141Z
            - connectTime: 2020-07-28T16:18:09.743141Z
      """

    When I visit the "/zones/zone-ingresses/zone-ingress-1/overview" URL
    Then the page title contains "zone-ingress-1"
    Then the "$ingress-detail-tabs-view" element contains "zone-ingress-1"
    Then the "$ingress-detail-view" element contains "166.197.238.26:20555"
    Then the "$ingress-detail-view" element contains "Connected: Jul 28, 2020, 4:18 PM"

    When I click the "$ingress-config-tab" element
    Then the "$ingress-config-view" element contains "type: ZoneIngress"

  Scenario: Zone Egress detail view has expected content
    And the URL "/zoneegressoverviews/zone-egress-1" responds with
      """
      body:
        name: zone-egress-1
        zoneEgress:
          zone: zone-cp-2
          networking:
            address: '166.197.238.26'
            port: 20555
        zoneEgressInsight:
          subscriptions:
            - connectTime: 2019-07-28T16:18:09.743141Z
              disconnectTime: 2019-07-28T16:18:09.743141Z
            - connectTime: 2020-07-28T16:18:09.743141Z
      """

    When I visit the "/zones/zone-egresses/zone-egress-1/overview" URL
    Then the page title contains "zone-egress-1"
    Then the "$egress-detail-tabs-view" element contains "zone-egress-1"
    Then the "$egress-detail-view" element contains "166.197.238.26:20555"
    Then the "$egress-detail-view" element contains "Connected: Jul 28, 2020, 4:18 PM"

    When I click the "$egress-config-tab" element
    Then the "$egress-config-view" element contains "type: ZoneEgress"
