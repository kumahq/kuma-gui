Feature: Zones: List view content
  Background:
    Given the CSS selectors
      | Alias                  | Selector                                         |
      | zone-ingress-table-row | [data-testid='zone-ingress-collection'] tbody tr |
      | zone-egress-table-row  | [data-testid='zone-egress-collection'] tbody tr  |

  Scenario Outline: Zone Ingress list view has expected content
    Given the environment
      """
      KUMA_ZONEINGRESS_COUNT: 1
      KUMA_SUBSCRIPTION_COUNT: 2
      KUMA_MODE: global
      """
    And the URL "/zoneingresses+insights" responds with
      """
      body:
        items:
          - name: zone-ingress-1
            zoneIngress:
              zone: zone-cp-1
            zoneIngressInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: !!js/undefined
          - name: zone-ingress-2
            zoneIngress:
              zone: zone-cp-2
            zoneIngressInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
      """

    When I visit the "/zones/zone-ingresses" URL
    Then the page title contains "Ingresses"

    Then the "$zone-ingress-table-row:nth-child(1) .status-column" element contains "online"
    Then the "$zone-ingress-table-row:nth-child(1) .name-column" element contains "zone-ingress-1"

    Then the "$zone-ingress-table-row:nth-child(2) .status-column" element contains "offline"
    Then the "$zone-ingress-table-row:nth-child(2) .name-column" element contains "zone-ingress-2"

  Scenario Outline: Zone Egress list view has expected content
    Given the environment
      """
      KUMA_ZONEEGRESS_COUNT: 1
      KUMA_SUBSCRIPTION_COUNT: 2
      KUMA_MODE: global
      """
    And the URL "/zoneegressoverviews" responds with
      """
      body:
        items:
          - name: zone-egress-1
            zoneEgress:
              zone: zone-cp-2
            zoneEgressInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                - disconnectTime: !!js/undefined
          - name: zone-egress-2
            zoneEgress:
              zone: zone-cp-1
            zoneEgressInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
      """

    When I visit the "/zones/zone-egresses" URL
    Then the page title contains "Egresses"

    Then the "$zone-egress-table-row:nth-child(1) .status-column" element contains "online"
    Then the "$zone-egress-table-row:nth-child(1) .name-column" element contains "zone-egress-1"

    Then the "$zone-egress-table-row:nth-child(2) .status-column" element contains "offline"
    Then the "$zone-egress-table-row:nth-child(2) .name-column" element contains "zone-egress-2"
