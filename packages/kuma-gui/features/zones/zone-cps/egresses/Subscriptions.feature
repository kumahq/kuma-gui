Feature: dataplanes / subscriptions

  Background:
    Given the CSS selectors
      | Alias                            | Selector                                              |
      | about-section                    | [data-testid='about-section-content']                 |
      | about-zone-egress-subscriptions  | [data-testid='about-zone-egress-subscriptions']       |
      | zone-egress-subscriptions        | [data-testid='subscriptions-listing']                 |
      | zone-egress-subscription-summary | [data-testid='zone-egress-subscription-summary-view'] |
      | summary                          | [data-testid='summary']                               |
      | close-summary-button             | $summary [data-testid='slideout-close-icon']          |
    And the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 1
      """

  Scenario: When there are subscription the about section has expected content
    Given the URL "/zoneegresses/east-egress/_overview" responds with
      """
      body:
        zoneEgressInsight:
          subscriptions:
            - controlPlaneInstanceId: foo
              disconnectTime: !!js/undefined
      """
    When I visit the "/zones/east/egresses/east-egress/overview" URL
    Then the "$about-section" element contains "XDS connections"
    And the "$about-zone-egress-subscriptions" element contains "foo"

  Scenario: Go to subscription detail and back
    Given the URL "/zoneegresses/east-egress/_overview" responds with
      """
      body:
        zoneEgressInsight:
          subscriptions:
            - controlPlaneInstanceId: foo
              id: bar
      """
    When I visit the "/zones/east/egresses/east-egress/overview" URL
    Then the "$about-zone-egress-subscriptions" element exists
    Then I click the "$about-zone-egress-subscriptions a" element
    Then the URL contains "/zones/east/egresses/east-egress/subscriptions"
    And the "$zone-egress-subscriptions" element exists
    Then I click the "$zone-egress-subscriptions table tbody tr a" element
    Then the URL contains "/zones/east/egresses/east-egress/subscriptions/subscription/bar"
    And the "$zone-egress-subscription-summary" element exists
    Then I navigate "back"
    Then the URL contains "/zones/east/egresses/east-egress/subscriptions"
