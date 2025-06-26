Feature: zones / egresses / item

  Background:
    Given the CSS selectors
      | Alias              | Selector                                      |
      | page               | [data-testid='zone-egress-detail-tabs-view']  |
      | header             | $page .app-view-title-bar                     |
      | overview-view      | [data-testid='zone-egress-detail-view']       |
      | config-view        | [data-testid='zone-egress-config-view']       |
      | subscriptions      | [data-testid='app-collection'] tbody tr       |
      | subscription       | $subscriptions:nth-child(1)                   |
      | config-tab         | [data-testid='zone-egress-config-view-tab'] a |
      | config-universal   | [data-testid='codeblock-yaml-universal']      |
      | config-k8s         | [data-testid='codeblock-yaml-k8s']            |
      | select-environment | [data-testid='select-input']                  |
    And the environment
      """
      KUMA_MODE: global
      KUMA_SUBSCRIPTION_COUNT: 2
      """

  Scenario: Detail view has expected content
    And the URL "/zoneegresses/item-1/_overview" responds with
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
    When I visit the "/zones/zone-cp-1/egresses/item-1/overview" URL
    Then the page title contains "item-1"
    Then the "$header" element contains "item-1"
    Then the "$overview-view" element contains "166.197.238.26:20555"
    Then the "$subscription" element contains "Jul 28, 2020, 4:18 PM"
    When I click the "$config-tab" element
    Then the "$config-view" element contains "type: ZoneEgress"

  Scenario: Shows config with format based on environment
    When I visit the "/zones/zone-cp-1/egresses/item-1/config" URL
    Then the "$config-universal" element exists
    And the URL contains "?environment=universal"
    When I click the "$select-environment" element
    When I click the "[data-testid='select-item-k8s'] button" element
    Then the "$config-k8s" element exists
    And the URL contains "?environment=k8s"
