Feature: zones / item

  Background:
    Given the CSS selectors
      | Alias                  | Selector                                           |
      | tabs-view              | [data-testid='zone-cp-detail-tabs-view']           |
      | detail-view            | [data-testid='zone-cp-detail-view']                |
      | config-view            | [data-testid='zone-cp-config-view']                |
      | status-circuit-breaker | [data-testid='subscription-status-CircuitBreaker'] |
      | version-outdated       | .version.outdated                                  |
    And the environment
      """
      KUMA_MODE: global
      KUMA_SUBSCRIPTION_COUNT: 1
      """

  Scenario: Detail view has expected content
    # We always use the final subscription
    # If the disconnectTime is empty then we are online
    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 2
      """
    And the URL "/zones/zone-cp-1/_overview" responds with
      """
      body:
        name: zone-cp-1
        zone:
          enabled: true
        zoneInsight:
          subscriptions:
            - connectTime: 2020-07-28T16:18:09.743141Z
              disconnectTime: 2020-07-28T16:18:09.743141Z
              version:
                kumaCp:
                  version: 100.0.0
            - connectTime: 2020-07-28T16:18:09.743141Z
              disconnectTime: !!js/undefined
              config: |
                { "environment": "universal", "store": {"type": "memory"}, "dpServer": { "auth": { "type": "dpToken" } } }
              status:
                stat:
                  CircuitBreaker:
                    responsesSent: '12'
                    responsesAcknowledged: '10'
      """
    When I visit the "/zones/zone-cp-1/overview" URL
    Then the page title contains "zone-cp-1"
    And the "$tabs-view" element contains "zone-cp-1"
    And the "$detail-view" element contains
      | Value     |
      | Universal |
      | 100.0.0   |
      | online    |
      | dpToken   |
    And the "$detail-view" element contains "Connected: Jul 28, 2020, 4:18 PM"
    And the "$version-outdated" element doesn't exist

  Scenario: Outdated versions are highlighted
    And the URL "/zones/zone-cp-1/_overview" responds with
      """
      body:
        zoneInsight:
          subscriptions:
            - version:
                kumaCp:
                  version: 0.0.0
      """
    When I visit the "/zones/zone-cp-1/overview" URL
    And the "$version-outdated" element contains "0.0.0"

  Scenario: Config view has expected content
    Given the URL "/zones/zone-cp-1/_overview" responds with
      """
      body:
        name: default
        zoneInsight:
          subscriptions:
            - connectTime: 2020-07-28T16:18:09.743141Z
              disconnectTime: !!js/undefined
              config: |
                { "multizone": { "zone": { "globalAddress": "grpcs://localhost:123" } } }
      """
    When I visit the "/zones/zone-cp-1/config" URL
    Then the "$config-view" element contains "globalAddress"
    And the "$config-view" element contains "grpcs://localhost:123"
