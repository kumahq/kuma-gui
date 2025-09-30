Feature: dataplanes / subscriptions

  Background:
    Given the CSS selectors
      | Alias                             | Selector                                               |
      | about-section                     | [data-testid='about-section-content']                  |
      | about-zone-ingress-subscriptions  | [data-testid='about-zone-ingress-subscriptions']       |
      | zone-ingress-subscriptions        | [data-testid='subscriptions-listing']                  |
      | zone-ingress-subscription-summary | [data-testid='zone-ingress-subscription-summary-view'] |
      | summary                           | [data-testid='summary']                                |
      | close-summary-button              | $summary [data-testid='slideout-close-icon']           |
    And the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 1
      """

  Scenario: When there are subscription the about section has expected content
    Given the URL "/zone-ingresses/east-ingress/_overview" responds with
      """
      body:
        zoneIngressInsight:
          subscriptions:
            - controlPlaneInstanceId: foo
              disconnectTime: !!js/undefined
      """
    When I visit the "/zones/east/ingresses/east-ingress/overview" URL
    Then the "$about-section" element contains "XDS connections"
    And the "$about-zone-ingress-subscriptions" element contains "foo"

  Scenario: Go to subscription detail and back
    Given the URL "/zone-ingresses/east-ingress/_overview" responds with
      """
      body:
        zoneIngressInsight:
          subscriptions:
            - controlPlaneInstanceId: foo
              id: bar
      """
    When I visit the "/zones/east/ingresses/east-ingress/overview" URL
    Then the "$about-zone-ingress-subscriptions" element exists
    Then I click the "$about-zone-ingress-subscriptions a" element
    Then the URL contains "/zones/east/ingresses/east-ingress/subscriptions"
    And the "$zone-ingress-subscriptions" element exists
    Then I click the "$zone-ingress-subscriptions table tbody tr a" element
    Then the URL contains "/zones/east/ingresses/east-ingress/subscriptions/subscription/bar"
    And the "$zone-ingress-subscription-summary" element exists
    Then I navigate "back"
    Then the URL contains "/zones/east/ingresses/east-ingress/subscriptions"
