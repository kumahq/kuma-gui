Feature: mesh / builtin-gateways / index
  Background:
    Given the CSS selectors
      | Alias        | Selector                                   |
      | items        | [data-testid='builtin-gateway-collection'] |
      | items-header | $items th                                  |
      | item         | $items tbody tr                            |
    And the environment
      """
      KUMA_MESHGATEWAY_COUNT: 1
      """
    And the URL "/meshes/default/meshgateways" responds with
      """
      body:
        items:
          - name: gateway-1
            labels:
              kuma.io/origin: zone
              kuma.io/zone: zone-1
      """

  Scenario: The items have the correct columns
    When I visit the "/meshes/default/gateways/builtin" URL

    Then the "$items-header" element exists 3 times
    Then the "$items-header" elements contain
      | Value |
      | Name  |
      | Zone  |

  Scenario: The items have the expected content and UI elements
    When I visit the "/meshes/default/gateways/builtin" URL

    Then the "#gateway-list-tabs-view-tab.active" element exists
    Then the "$item" element exists 1 times
    Then the "$item:nth-child(1)" element contains
      | Value     |
      | gateway-1 |

  Scenario: Clicking View details goes to the detail page and back again
    When I visit the "/meshes/default/gateways/builtin" URL

    Then the "$item:nth-child(1) td:nth-child(1)" element contains "gateway-1"

    When I click the "$item:nth-child(1) [data-testid='details-link']" element

    Then the URL contains "/gateways/builtin/gateway-1/overview"
    Then the "#builtin-gateway-detail-view-tab a" element exists
