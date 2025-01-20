Feature: dataplanes / no-subscriptions

  Scenario: When there are no subscription I don't get an error
    Given the CSS selectors
      | Alias            | Selector                                    |
      | detail-view      | [data-testid='data-plane-detail-tabs-view'] |
      | overview-content | [data-testid='data-plane-detail-view']      |
    And the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 0
      KUMA_DATAPLANEINBOUND_COUNT: 1
      """
    And the URL "/meshes/default/dataplanes/backend/_overview" responds with
      """
      body:
        dataplane:
          networking:
            inbound:
              - state: NotReady
      """
    When I visit the "/meshes/default/data-planes/backend/overview" URL
    And the "$detail-view" element contains "backend"
    And the "$overview-content" element contains "offline"
