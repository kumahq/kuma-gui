Feature: Zones: Detail view content
  Background:
    Given the CSS selectors
      | Alias   | Selector                            |
      | details | [data-testid='detail-view-details'] |
      | warning-no-subscriptions | [data-testid='warning-no-subscriptions'] |
    And the URL "/config" responds with
      """
      body:
        mode: global
      """
  Scenario: Zone CP detail view has expected content
    Given the URL "/zones+insights/zone-cp-1" responds with
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

  Scenario: When subscriptions aren't set a warning is shown
    And the URL "/zones+insights/zone-cp-1" responds with
      """
      body:
        name: zone-cp-1
        zoneInsight:
          subscriptions: ~
      """
    When I visit the "/zones/zone-cps/zone-cp-1" URL
    And I click the "#config-tab" element
    Then the "$warning-no-subscriptions" element exists

