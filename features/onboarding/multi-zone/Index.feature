Feature: onboarding / multi-zone / index

  Background:
    Given the CSS selectors
      | Alias       | Selector                                   |
      | next-button | [data-testid='onboarding-next-button']     |
      | loading     | [data-testid='loading']                    |
      | connected   | [data-testid='zone-online-ingress-online'] |

  Scenario: Loading the zone list and showing the state
    Given the environment
      """
      KUMA_ZONE_COUNT: 0
      KUMA_ZONEINGRESS_COUNT: 0
      """
    When I visit the "/onboarding/multi-zone" URL
    Then the "$loading" element exists
    And the "$connected" element doesn't exist
    And the "$next-button[disabled]" element exists
    And the environment
      """
      KUMA_ZONE_COUNT: 1
      KUMA_ZONEINGRESS_COUNT: 1
      """
    And the URL "/zones/_overview" responds with
      """
      body:
        items:
          - name: zone-test
            zone:
              enabled: true
            zoneInsight:
              subscriptions:
                - connectTime: 2021-02-17T07:33:36.412683Z
                  disconnectTime: !!js/undefined
      """
    And the URL "/zone-ingresses/_overview" responds with
      """
      body:
        items:
          - name: zone-ingress-test
            zoneIngressInsight:
              subscriptions:
                - connectTime: 2021-02-17T07:33:36.412683Z
                  disconnectTime: !!js/undefined
      """
    Then the "$loading" element doesn't exist
    And the "$connected" element exists
    And the "$next-button:not([disabled])" element exists
