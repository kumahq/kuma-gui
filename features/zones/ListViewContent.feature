Feature: Zones: List view content
  Background:
    Given the CSS selectors
      | Alias                  | Selector                                         |
      | zone-cp-table-row      | [data-testid='zone-cp-collection'] tbody tr      |
      | zone-ingress-table-row | [data-testid='zone-ingress-collection'] tbody tr |
      | zone-egress-table-row  | [data-testid='zone-egress-collection'] tbody tr  |

  Scenario Outline: Zone CP list view has expected content
    Given the environment
      """
      KUMA_ZONE_COUNT: 3
      KUMA_SUBSCRIPTION_COUNT: 2
      KUMA_MODE: global
      """
    And the URL "/zones+insights" responds with
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
                  config: '{"environment":"kubernetes"}'
                  version:
                    kumaCp:
                      version: 1.0.0-rc2-211-not-the-version-i-want
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: !!js/undefined
                  config: '{"environment":"universal"}'
                  version:
                    kumaCp:
                      version: 1.0.0-rc2-211-g823fe8ce
          - name: zone-cp-2
            zone:
              enabled: true
            zoneInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  version:
                    kumaCp:
                      version: 1.0.0-rc2-211-not-the-version-i-want
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  config: '{"environment":"kubernetes"}'
                  version:
                    kumaCp:
                      version: 1.0.0-rc2-211-g823fe8ce
          - name: zone-cp-3
            zone:
              enabled: false
            zoneInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
      """

    When I visit the "/zones/zone-cps" URL
    Then the page title contains "Zone Control Planes"

    Then the "$zone-cp-table-row:nth-child(1) .status-column" element contains "online"
    Then the "$zone-cp-table-row:nth-child(1) .name-column" element contains "zone-cp-1"
    Then the "$zone-cp-table-row:nth-child(1) .zoneCpVersion-column" element contains "1.0.0-rc2-211-g823fe8ce"
    Then the "$zone-cp-table-row:nth-child(1) .type-column" element contains "universal"

    Then the "$zone-cp-table-row:nth-child(2) .status-column" element contains "offline"
    Then the "$zone-cp-table-row:nth-child(2) .name-column" element contains "zone-cp-2"
    Then the "$zone-cp-table-row:nth-child(2) .zoneCpVersion-column" element contains "1.0.0-rc2-211-g823fe8ce"
    Then the "$zone-cp-table-row:nth-child(2) .type-column" element contains "kubernetes"

    Then the "$zone-cp-table-row:nth-child(3) .status-column" element contains "disabled"
    Then the "$zone-cp-table-row:nth-child(3) .name-column" element contains "zone-cp-3"

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
