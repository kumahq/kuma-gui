Feature: mesh / builtin-gateways / item
  Background:
    Given the CSS selectors
      | Alias              | Selector                                         |
      | tabs-view          | [data-testid='builtin-gateway-detail-tabs-view'] |
      | detail-view        | [data-testid='builtin-gateway-detail-view']      |
      | filter-input       | [data-testid='dataplane-search-input']           |
      | affected-dpps      | [data-testid='affected-data-plane-proxies']      |
      | affected-dpps-item | [data-testid='dataplane-name']                   |
    Given the URL "/meshes/default/meshgateways/gateway-1" responds with
      """
      body:
        networking:
          address: '1.2.3.4'
      """
    Given the URL "/meshes/default/meshgateways/gateway-1/_resources/dataplanes" responds with
      """
      body:
        items:
          - name: backend
          - name: db
          - name: frontend
      """

  Scenario: Overview tab has expected content
    When I visit the "/meshes/default/gateways/builtin/gateway-1/overview" URL

    Then the "$tabs-view" element contains "gateway-1"
    Then the "$detail-view" element contains "gateway-1"

  Scenario: Affected DPPs can be filtered
    When I visit the "/meshes/default/gateways/builtin/gateway-1/overview" URL

    Then the "$affected-dpps-item" element exists 3 times
    And the "$affected-dpps" element contains "backend"
    And the "$affected-dpps" element contains "db"
    And the "$affected-dpps" element contains "frontend"

    When I "type" "db" into the "$filter-input" element

    Then the "$affected-dpps-item" element exists 1 time
    And the "$affected-dpps" element contains "db"
    And the URL contains "/overview?dataplane=db"

  Scenario: URL with dataplane query parameter filters affected DPP list
    When I visit the "/meshes/default/gateways/builtin/gateway-1/overview?dataplane=db" URL

    Then the "$affected-dpps-item" element exists 1 time
    And the "$affected-dpps" element contains "db"
    And the URL contains "/overview?dataplane=db"
