Feature: dataplanes / subscriptions

  Background:
    Given the CSS selectors
      | Alias                        | Selector                                          |
      | about-section                | [data-testid='about-section-content']             |
      | about-zone-cp-subscriptions  | [data-testid='about-zone-cp-subscriptions']       |
      | zone-cp-subscriptions        | [data-testid='subscriptions-listing']             |
      | zone-cp-subscription-summary | [data-testid='zone-cp-subscription-summary-view'] |
      | summary                      | [data-testid='summary']                           |
      | close-summary-button         | $summary [data-testid='slideout-close-icon']      |
    And the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 1
      """

  Scenario: When there are subscription the about section has expected content
    Given the URL "/zones/east/_overview" responds with
      """
      body:
        zoneInsight:
          subscriptions:
            - zoneInstanceId: foo
              disconnectTime: !!js/undefined
      """
    When I visit the "/zones/east/overview" URL
    Then the "$about-section" element contains "KDS connections"
    And the "$about-zone-cp-subscriptions" element contains "foo"

  Scenario: Go to subscription detail and back
    Given the URL "/zones/east/_overview" responds with
      """
      body:
        zoneInsight:
          subscriptions:
            - zoneInstanceId: foo
              id: bar
      """
    When I visit the "/zones/east/overview" URL
    Then the "$about-zone-cp-subscriptions" element exists
    Then I click the "$about-zone-cp-subscriptions a" element
    Then the URL contains "/zones/east/subscriptions"
    And the "$zone-cp-subscriptions" element exists
    Then I click the "$zone-cp-subscriptions table tbody tr a" element
    Then the URL contains "/zones/east/subscriptions/subscription/bar"
    And the "$zone-cp-subscription-summary" element exists
    Then I navigate "back"
    Then the URL contains "/zones/east/subscriptions"
