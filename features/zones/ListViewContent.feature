Feature: Zones: List view content
  Background:
    Given the CSS selectors
      | Alias                  | Selector                                    |
      | summary                | [data-testid='list-view-summary']           |
      | table                  | [data-testid='data-overview-table']         |
      | table-row              | $table tbody tr                             |
      | zone-cp-table-row      | [data-testid='zone-cp-table'] tbody tr      |
      | zone-ingress-table-row | [data-testid='zone-ingress-table'] tbody tr |

  Scenario Outline: Zone CP list view has expected content
    Given the environment
      """
      KUMA_ZONE_COUNT: 2
      KUMA_ZONEINGRESS_COUNT: 1
      KUMA_ZONEEGRESS_COUNT: 1
      """
    And the URL "/config" responds with
      """
      body:
        mode: global
      """
    And the URL "/zones+insights" responds with
      """
      body:
        items:
          - name: zone-cp-1
            zoneInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  status: {}
                - connectTime: 2020-07-28T16:18:09.743141Z
                  status: {}
          - name: zone-cp-2
            zoneInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  status: {}
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  status: {}
      """
    And the URL "/zoneingresses+insights" responds with
      """
      body:
        items:
          - name: zone-ingress-1
            zoneIngress:
              zone: zone-cp-1
      """
    And the URL "/zoneegressoverviews" responds with
      """
      body:
        items:
          - name: zone-egress-1
            zoneEgress:
              zone: zone-cp-2
      """

    When I visit the "/zones/zone-cps" URL
    Then the page title contains "Zone CPs"

    Then the "$zone-cp-table-row:nth-child(1) .status-column" element contains "online"
    Then the "$zone-cp-table-row:nth-child(1) .name-column" element contains "zone-cp-1"
    Then the "$zone-cp-table-row:nth-child(1) .zoneCpVersion-column" element contains "1.0.0-rc2-211-g823fe8ce"
    Then the "$zone-cp-table-row:nth-child(1) .storeType-column" element contains "memory"
    Then the "$zone-cp-table-row:nth-child(1) .hasIngress-column" element contains "Yes"
    Then the "$zone-cp-table-row:nth-child(1) .hasEgress-column" element contains "No"

    Then the "$zone-cp-table-row:nth-child(2) .status-column" element contains "offline"
    Then the "$zone-cp-table-row:nth-child(2) .name-column" element contains "zone-cp-2"
    Then the "$zone-cp-table-row:nth-child(2) .zoneCpVersion-column" element contains "1.0.0-rc2-211-g823fe8ce"
    Then the "$zone-cp-table-row:nth-child(2) .storeType-column" element contains "memory"
    Then the "$zone-cp-table-row:nth-child(2) .hasIngress-column" element contains "No"
    Then the "$zone-cp-table-row:nth-child(2) .hasEgress-column" element contains "Yes"

  Scenario Outline: Zone Ingress list view has expected content
    Given the environment
      """
      KUMA_ZONEINGRESS_COUNT: 1
      """
    And the URL "/config" responds with
      """
      body:
        mode: global
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
                  status: {}
                - connectTime: 2020-07-28T16:18:09.743141Z
                  status: {}
          - name: zone-ingress-2
            zoneIngress:
              zone: zone-cp-2
            zoneIngressInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  status: {}
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  status: {}
      """

    When I visit the "/zones/zone-ingresses" URL
    Then the page title contains "Zone Ingresses"

    Then the "$zone-ingress-table-row:nth-child(1) .status-column" element contains "online"
    Then the "$zone-ingress-table-row:nth-child(1) .name-column" element contains "zone-ingress-1"

    Then the "$zone-ingress-table-row:nth-child(2) .status-column" element contains "offline"
    Then the "$zone-ingress-table-row:nth-child(2) .name-column" element contains "zone-ingress-2"

  Scenario Outline: Zone Egress list view has expected content
    Given the environment
      """
      KUMA_ZONEEGRESS_COUNT: 1
      """
    And the URL "/config" responds with
      """
      body:
        mode: global
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
                  status: {}
                - connectTime: 2020-07-28T16:18:09.743141Z
                  status: {}
          - name: zone-egress-2
            zoneEgress:
              zone: zone-cp-1
            zoneEgressInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  status: {}
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  status: {}
      """

    When I visit the "/zones/zone-egresses" URL
    Then the page title contains "Zone Egresses"

    Then the "$table-row:nth-child(1) .status-column" element contains "online"
    Then the "$table-row:nth-child(1) .entity-column" element contains "zone-egress-1"

    Then the "$table-row:nth-child(2) .status-column" element contains "offline"
    Then the "$table-row:nth-child(2) .entity-column" element contains "zone-egress-2"

    Then the "$summary" element contains "Zone Egress: zone-egress-1"
