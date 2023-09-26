Feature: onboarding / multi-zone / index
  Background:
    Given the CSS selectors
      | Alias             | Selector                               |
      | next-button       | [data-testid='onboarding-next-button'] |
      | loading           | [data-testid='loading']                |
      | zone-connected    | [data-testid='zone-connected']         |
      | ingress-connected | [data-testid='zone-ingress-connected'] |

  Scenario: Loading the zone list and showing the state
    Given the environment
      """
      KUMA_ZONE_COUNT: 0
      """
    When I visit the "/onboarding/multi-zone" URL
    Then the "$loading" element exists
    And the "$zone-connected" element doesn't exist
    And the "$next-button[disabled]" element exists
    And the environment
      """
      KUMA_ZONE_COUNT: 1
      """
    And the URL "/zones" responds with
      """
      body:
        items:
          - name: zone-test
      """
    Then the "$loading" element doesn't exist
    And the "$zone-connected" element exists
    And the "$ingress-connected" element exists
    And the "$next-button:not([disabled])" element exists
