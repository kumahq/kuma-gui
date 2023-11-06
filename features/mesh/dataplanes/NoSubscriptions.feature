Feature: dataplanes / no-subscriptions
  Scenario: When there are no subscription I don't get an error
    Given the CSS selectors
      | Alias            | Selector                                    |
      | detail-view      | [data-testid='data-plane-detail-tabs-view'] |
      | overview-content | [data-testid='data-plane-detail-view']      |
    And the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 0
      """
    When I visit the "/meshes/default/data-planes/dpp-1/overview" URL
    And the "$detail-view" element contains "dpp-1"
    And the "$overview-content" element contains "offline"
