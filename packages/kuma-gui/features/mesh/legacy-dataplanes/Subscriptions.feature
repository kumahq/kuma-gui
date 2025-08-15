Feature: dataplanes / subscriptions

  Background:
    Given the CSS selectors
      | Alias                   | Selector                                             |
      | about-section           | [data-testid='about-section-content']                |
      | about-dp-subscriptions  | [data-testid='about-dataplane-subscriptions']        |
      | dp-subscriptions        | [data-testid='dataplane-subscriptions']              |
      | dp-subscription-summary | [data-testid='data-plane-subscription-summary-view'] |
      | summary                 | [data-testid='summary']                              |
      | close-summary-button    | $summary [data-testid='slideout-close-icon']         |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: false
      KUMA_SUBSCRIPTION_COUNT: 1
      KUMA_DATAPLANEINBOUND_COUNT: 1
      """

  Scenario: When there are subscription the about section has expected content
    Given the URL "/meshes/default/dataplanes/backend/_overview" responds with
      """
      body:
        dataplaneInsight:
          subscriptions:
            - controlPlaneInstanceId: foo
              disconnectTime: !!js/undefined
      """
    When I visit the "/meshes/default/data-planes/backend/overview" URL
    Then the "$about-section" element contains "XDS connections"
    And the "$about-dp-subscriptions" element contains "foo"

  Scenario: Go to subscription detail and back
    Given the URL "/meshes/default/dataplanes/backend/_overview" responds with
      """
      body:
        dataplaneInsight:
          subscriptions:
            - controlPlaneInstanceId: foo
              id: bar
      """
    When I visit the "/meshes/default/data-planes/backend/overview/subscriptions" URL
    Then the "$about-dp-subscriptions" element exists
    Then I click the "$about-dp-subscriptions a" element
    Then the URL contains "/meshes/default/data-planes/backend/overview/subscriptions"
    And the "$dp-subscriptions" element exists
    And I wait for 500 ms
    Then I click the "$dp-subscriptions table tbody tr a" element
    Then the URL contains "/meshes/default/data-planes/backend/overview/subscriptions/subscription/bar"
    And the "$dp-subscription-summary" element exists
    Then I navigate "back"
    Then the URL contains "/meshes/default/data-planes/backend/overview/subscriptions"
    Then I click the "$close-summary-button" element
    Then the "$dp-subscription-summary" element doesn't exist
    And the URL contains "/meshes/default/data-planes/backend/overview"
