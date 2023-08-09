Feature: zones / zone-cps / item
  Background:
    Given the CSS selectors
      | Alias                          | Selector                                 |
      | zone-control-plane-detail-view | [data-testid='zone-cp-detail-view']      |
      | nav-insights                   | #insights-tab                            |
      | nav-config                     | #config-tab                              |
      | tab-overview                   | #panel-0                                 |
      | tab-insights                   | #panel-1                                 |
      | tab-config                     | #panel-2                                 |
      | warning-no-subscriptions       | [data-testid='warning-no-subscriptions'] |

    And the URL "/config" responds with
      """
      body:
        mode: global
      """
  Scenario: Zone CP detail view has expected content
    # We always use the final subscription
    # If the disconnectTime is empty then we are online
    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 2
      """
    And the URL "/zones+insights/zone-cp-1" responds with
      """
      body:
        name: zone-cp-1
        zoneInsight:
          subscriptions:
            - connectTime: 2020-07-28T16:18:09.743141Z
              disconnectTime: 2020-07-28T16:18:09.743141Z
            - connectTime: 2020-07-28T16:18:09.743141Z
              disconnectTime: ~
              config: |
                {"dpServer": {"auth": {"type": "dpToken"}}}
      """

    When I visit the "/zones/zone-cps/zone-cp-1" URL
    Then the page title contains "Zone Control Plane"
    Then the "$zone-control-plane-detail-view" element contains "zone-cp-1 Zone Control Plane"

    Then the "$tab-overview" element contains
      | Value        |
      | ZoneOverview |
      | online       |
      | dpToken      |

    When I click the "$nav-insights" element
    Then the "$tab-insights" element contains "Connect time: Jul 28, 2020, 4:18 PM"

    When I click the "$nav-config" element
    Then the "$tab-config" element contains "dpToken"

  Scenario: When subscriptions aren't set a warning is shown
    And the URL "/zones+insights/zone-cp-1" responds with
      """
      body:
        name: zone-cp-1
        zoneInsight:
          subscriptions: ~
      """
    When I visit the "/zones/zone-cps/zone-cp-1" URL
    And I click the "$nav-config" element
    Then the "$warning-no-subscriptions" element exists
