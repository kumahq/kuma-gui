Feature: dataplanes / no-subscriptions
  Scenario:
    Given the CSS selectors
      | Alias            | Selector                                    |
      | detail-view      | [data-testid='data-plane-detail-tabs-view'] |
      | overview-content | [data-testid='data-plane-detail-view']      |
    And the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 0
      """
    When I visit the "/mesh/default/data-plane/dpp-1" URL
    And the "$detail-view" element contains "dpp-1"
    And the "$overview-content" element contains "offline"
