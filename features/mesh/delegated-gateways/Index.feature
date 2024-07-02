Feature: mesh / delegated-gateways / index

  Background:
    Given the CSS selectors
      | Alias                     | Selector                                                                     |
      | items                     | [data-testid='delegated-gateway-collection']                                 |
      | items-header              | $items th                                                                    |
      | item                      | $items tbody tr                                                              |
      | action-group              | $item [data-testid='x-action-group-control']                                 |
      | view                      | $item [data-testid='x-action-group'] li:first-child [data-testid='x-action'] |
      | action                    | $item [data-action]                                                          |
      | delegated-gateway-sub-tab | [data-testid='delegated-gateway-list-view-sub-tab']                          |
    And the environment
      """
      KUMA_SERVICE_COUNT: 1
      """
    And the URL "/meshes/default/service-insights" responds with
      """
      body:
        items:
          - name: gateway-1
            serviceType: gateway_delegated
            status: partially_degraded
            addressPort: 1.2.3.4:8000
            dataplanes:
              total: 2
              online: 1
              offline: 1
      """

  Scenario: Sub navigation has expected content
    When I visit the "/meshes/default/gateways/delegated" URL
    Then the "$delegated-gateway-sub-tab" element exists

  Scenario: The items have the correct columns
    When I visit the "/meshes/default/gateways/delegated" URL
    Then the "$items-header" element exists 5 times
    Then the "$items-header" elements contain
      | Value                       |
      | Name                        |
      | Address                     |
      | DP proxies (online / total) |
      | Status                      |

  Scenario: The items have the expected content and UI elements
    When I visit the "/meshes/default/gateways/delegated" URL
    Then the "[data-testid='gateway-list-tabs-view-tab'].active" element exists
    Then the "$item" element exists 1 times
    Then the "$item:nth-child(1)" element contains
      | Value              |
      | gateway-1          |
      |       1.2.3.4:8000 |
      |              1 / 2 |
      | partially degraded |

  Scenario: Clicking View details goes to the detail page and back again
    When I visit the "/meshes/default/gateways/delegated" URL
    Then the "$item:nth-child(1) td:nth-child(1)" element contains "gateway-1"
    When I click the "$action-group" element
    And I click the "$view" element
    Then the URL contains "/gateways/delegated/gateway-1/overview"
    Then the "[data-testid='delegated-gateway-detail-view-tab'].active" element exists
