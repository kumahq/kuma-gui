Feature: Policies: Detail view content
  Background:
    Given the CSS selectors
      | Alias              | Selector                                    |
      | filter-input       | [data-testid='dataplane-search-input']      |
      | affected-dpps      | [data-testid='affected-data-plane-proxies'] |
      | affected-dpps-item | [data-testid='dataplane-name']              |

  Scenario: Affected DPPs can be filtered
    Given the URL "/meshes/default/circuit-breakers/cp-1/dataplanes" responds with
      """
      body:
        items:
          - dataplane:
              mesh: 'default'
              name: 'backend'
            attachments:
              - type: 'inbound'
                name: '192.168.0.1:80:81'
          - dataplane:
              mesh: 'default'
              name: 'db'
            attachments:
              - type: 'inbound'
                name: '192.168.0.1:80:81'
          - dataplane:
              mesh: 'default'
              name: 'frontend'
            attachments:
              - type: 'inbound'
                name: '192.168.0.1:80:81'
      """

    When I visit the "/meshes/default/policies/circuit-breakers/cb-1/overview" URL
    Then the "$affected-dpps-item" element exists 3 times
    Then the "$affected-dpps" element contains "backend"
    Then the "$affected-dpps" element contains "db"
    Then the "$affected-dpps" element contains "frontend"

    When I "type" "db" into the "$filter-input" element
    Then the "$affected-dpps-item" element exists 1 time
    Then the "$affected-dpps" element contains "db"
