Feature: zones / ingresses / item
  Background:
    Given the CSS selectors
      | Alias            | Selector                                                                    |
      | detail-view      | [data-testid='zone-ingress-detail-view']                                    |
      | config-view      | [data-testid='zone-ingress-config-view']                                    |
      | detail-tabs-view | [data-testid='zone-ingress-detail-tabs-view']                               |
      | config-tab       | #zone-ingress-config-view-tab a                                             |
      | navigation       | [data-testid='zone-ingress-detail-tabs-view'] [data-testid='nav-tabs'] > ul |

    And the environment
      """
      KUMA_MODE: global
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
        zoneIngressInsight:
          subscriptions:
            - connectTime: 2019-07-28T16:18:09.743141Z
              disconnectTime: 2019-07-28T16:18:09.743141Z
            - connectTime: 2020-07-28T16:18:09.743141Z
              disconnectTime: !!js/undefined
      """

    When I visit the "/zones/zone-cp-1/ingresses/item-1/overview" URL
    Then the page title contains "item-1"

    Then the "$detail-tabs-view" element contains "item-1"
    Then the "$detail-view" element contains "166.197.238.26:20555"
    Then the "$detail-view" element contains "Connected: Jul 28, 2020, 4:18 PM"

    When I click the "$config-tab" element
    Then the "$config-view" element contains "type: ZoneIngress"
