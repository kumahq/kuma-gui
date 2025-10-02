Feature: zones / ingresses / item

  Background:
    Given the CSS selectors
      | Alias              | Selector                                       |
      | page               | [data-testid='zone-ingress-detail-tabs-view']  |
      | header             | $page .app-view-title-bar                      |
      | overview-view      | [data-testid='zone-ingress-detail-view']       |
      | config-view        | [data-testid='zone-ingress-config-view']       |
      | navigation         | [data-testid='zone-ingress-tabs'] ul           |
      | config-tab         | [data-testid='zone-ingress-config-view-tab'] a |
      | config-universal   | [data-testid='codeblock-yaml-universal']       |
      | config-k8s         | [data-testid='codeblock-yaml-k8s']             |
      | select-environment | [data-testid='select-input']                   |
    And the environment
      """
      KUMA_MODE: global
      KUMA_SUBSCRIPTION_COUNT: 2
      """

  Scenario: Clicking through the secondary navigation
    When I visit the "/zones/zone-cp-1/ingresses/item-1/overview" URL
    Then I click the "$navigation li:nth-child(2) a" element
    Then I click the "$navigation li:nth-child(3) a" element
    Then I click the "$navigation li:nth-child(4) a" element
    Then I click the "$navigation li:nth-child(5) a" element
    Then I click the "$navigation li:nth-child(6) a" element
    Then I click the "$navigation li:nth-child(1) a" element

  Scenario: Detail view has expected content
    And the URL "/zone-ingresses/item-1/_overview" responds with
      """
      body:
        zoneIngress:
          zone: zone-cp-1
          networking:
            address: '166.197.238.26'
            advertisedAddress: !!js/undefined
            port: 20555
      """
    When I visit the "/zones/zone-cp-1/ingresses/item-1/overview" URL
    Then the "$header" element contains "item-1"
    Then the "$overview-view" element contains "166.197.238.26:20555"
    When I click the "$config-tab" element
    Then the "$config-view" element contains "type: ZoneIngress"

  Scenario: Shows config with format based on environment
    When I visit the "/zones/zone-cp-1/ingresses/item-1/config" URL
    Then the "$config-universal" element exists
    And the URL contains "?environment=universal"
    When I click the "$select-environment" element
    When I click the "[data-testid='select-item-k8s'] button" element
    Then the "$config-k8s" element exists
    And the URL contains "?environment=k8s"
