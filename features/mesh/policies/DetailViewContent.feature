Feature: Policies: Detail view content
  Background:
    Given the CSS selectors
      | Alias              | Selector                                    |
      | filter-input       | [data-testid='dataplane-search-input']      |
      | affected-dpps      | [data-testid='affected-data-plane-proxies'] |
      | affected-dpps-item | [data-testid='dataplane-name']              |
    And the environment
      """
      KUMA_DATAPLANE_COUNT: 3
      """
    And the URL "/meshes/default/circuit-breakers/cb-1/_resources/dataplanes" responds with
      """
      body:
        items:
          - name: backend
          - name: db
          - name: frontend
      """

  Scenario: Affected DPPs can be filtered
    When I visit the "/meshes/default/policies/circuit-breakers/cb-1/overview" URL
    Then the "$affected-dpps-item" element exists 3 times
    And the "$affected-dpps" element contains "backend"
    And the "$affected-dpps" element contains "db"
    And the "$affected-dpps" element contains "frontend"

    When I "type" "db" into the "$filter-input" element

    Then the "$affected-dpps-item" element exists 1 time
    And the "$affected-dpps" element contains "db"
    And the URL contains "/overview?dataplane=db"

  Scenario: URL with dataplane query parameter filters affected DPP list
    When I visit the "/meshes/default/policies/circuit-breakers/cb-1/overview?dataplane=db" URL

    Then the "$affected-dpps-item" element exists 1 time
    And the "$affected-dpps" element contains "db"
    And the URL contains "/overview?dataplane=db"
