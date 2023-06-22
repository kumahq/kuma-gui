Feature: Zones: Detail view content
  Background:
    Given the CSS selectors
      | Alias   | Selector                            |
      | details | [data-testid='detail-view-details'] |

  Scenario Outline: Zone CP detail view has expected content
    Given the URL "/config" responds with
      """
      body:
        mode: global
      """
    And the URL "/zones+insights/zone-cp-1" responds with
      """
      body:
        name: zone-cp-1
        zoneInsight:
          subscriptions:
            - connectTime: 2020-07-28T16:18:09.743141Z
              disconnectTime: 2020-07-28T16:18:09.743141Z
              status: {}
            - connectTime: 2020-07-28T16:18:09.743141Z
              status: {}
      """

    When I visit the "/zones/zone-cps/zone-cp-1" URL
    Then the page title contains "Zone CP"
    Then the "$details" element contains "Zone CP: zone-cp-1"
    Then the "$details" element contains "ZoneOverview"
    Then the "$details" element contains "online"
    Then the "$details" element contains "dpToken"

    When I click the "#insights-tab" element
    Then the "$details" element contains "Connect time: July 28, 2020 at 4:18:09 PM"

    When I click the "#config-tab" element
    Then the "$details" element contains "adminAccessLogPath"

  Scenario Outline: Zone Ingress detail view has expected content
    Given the URL "/config" responds with
      """
      body:
        mode: global
      """
    And the URL "/zoneingresses+insights/zone-ingress-1" responds with
      """
      body:
        name: zone-ingress-1
        zoneIngress:
          zone: zone-cp-1
        zoneIngressInsight:
          subscriptions:
            - connectTime: 2020-07-28T16:18:09.743141Z
              disconnectTime: 2020-07-28T16:18:09.743141Z
              status: {}
            - connectTime: 2020-07-28T16:18:09.743141Z
              status: {}
      """

    When I visit the "/zones/zone-ingresses/zone-ingress-1" URL
    Then the page title contains "Zone Ingress"
    Then the "$details" element contains "Zone Ingress: zone-ingress-1"
    Then the "$details" element contains "ZoneIngressOverview"

    When I click the "#insights-tab" element
    Then the "$details" element contains "Connect time: July 28, 2020 at 4:18:09 PM"

  Scenario Outline: Zone Egress detail view has expected content
    Given the URL "/config" responds with
      """
      body:
        mode: global
      """
    And the URL "/zoneegressoverviews/zone-egress-1" responds with
      """
      body:
        name: zone-egress-1
        zoneEgress:
          zone: zone-cp-2
        zoneEgressInsight:
          subscriptions:
            - connectTime: 2020-07-28T16:18:09.743141Z
              disconnectTime: 2020-07-28T16:18:09.743141Z
              status: {}
            - connectTime: 2020-07-28T16:18:09.743141Z
              status: {}
      """

    When I visit the "/zones/zone-egresses/zone-egress-1" URL
    Then the page title contains "Zone Egress"
    Then the "$details" element contains "Zone Egress: zone-egress-1"
    Then the "$details" element contains "ZoneEgressOverview"

    When I click the "#insights-tab" element
    Then the "$details" element contains "Connect time: July 28, 2020 at 4:18:09 PM"
