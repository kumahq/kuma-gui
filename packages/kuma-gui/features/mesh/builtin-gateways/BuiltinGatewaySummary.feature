Feature: BuiltinGateway summary

  Background:
    Given the CSS selectors
      | Alias             | Selector                                 |
      | summary           | [data-testid='summary']                  |
      | select-preference | $summary [data-testid='select-input']    |
      | structured-view   | $summary [data-testid='structured-view'] |
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
              kuma.io/display-name: gateway-1
      """

  Scenario: Switching to universal format and back
    When I visit the "<URL>" URL
    Then the "$select-preference" element exists
    And the "$structured-view" element exists
    When I click the "$select-preference" element
    When I click the "[data-testid='select-item-universal'] button" element
    Then the URL contains "format=universal"
    And the "[data-testid='k-code-block']" element exists
    And the "$structured-view" element doesn't exists
    When I click the "$select-preference" element
    When I click the "[data-testid='select-item-structured'] button" element
    Then the URL contains "format=structured"
    And the "$structured-view" element exists

    Examples:
      | URL                                        |
      | /meshes/default/gateways/builtin/gateway-1 |
