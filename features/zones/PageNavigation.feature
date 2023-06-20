Feature: Zone page navigation
  Background:
    Given the CSS selectors
      | Alias       | Selector                            |
      | main-nav    | .app-sidebar                        |
      | breadcrumbs | .k-breadcrumbs                      |
      | nav-tabs    | [data-testid='nav-tabs']            |
      | table       | [data-testid='data-overview-table'] |
      | table-row   | $table tbody tr                     |

  Scenario Outline: Navigating through zone pages by various means works
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
                - connectTime: 2020-07-28T16:18:09.743141Z
          - name: zone-cp-2
            zoneInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
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

    When I visit the "/" URL
    And I click the "$main-nav .nav-item-zone-cp-list-view > a" element
    Then the page title contains "Zone CPs"
    Then the "$table-row:nth-child(1) .status-column" element contains "online"
    Then the "$table-row:nth-child(1) .hasIngress-column" element contains "Yes"
    Then the "$table-row:nth-child(1) .hasEgress-column" element contains "No"
    Then the "$table-row:nth-child(2) .status-column" element contains "offline"
    Then the "$table-row:nth-child(2) .hasIngress-column" element contains "No"
    Then the "$table-row:nth-child(2) .hasEgress-column" element contains "Yes"

    When I click the "$table-row:nth-child(1) [data-testid='detail-view-link']" element
    Then the page title contains "Zone CP"

    When I click the "$nav-tabs #zone-cp-list-view-tab a" element
    Then the page title contains "Zone CPs"

    When I click the "$nav-tabs #zone-ingress-list-view-tab a" element
    Then the page title contains "Zone Ingresses"

    When I click the "$table-row:nth-child(1) [data-testid='detail-view-link']" element
    Then the page title contains "Zone Ingress"

    When I click the "$nav-tabs #zone-ingress-list-view-tab a" element
    Then the page title contains "Zone Ingresses"

    When I click the "$nav-tabs #zone-egress-list-view-tab a" element
    Then the page title contains "Zone Egresses"

    When I click the "$table-row:nth-child(1) [data-testid='detail-view-link']" element
    Then the page title contains "Zone Egress"

    When I click the "$nav-tabs #zone-egress-list-view-tab a" element
    Then the page title contains "Zone Egresses"

    When I click the "$breadcrumbs > .k-breadcrumbs-item:nth-child(1) > a" element
    Then the page title contains "Zone CPs"
