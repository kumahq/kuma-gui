Feature: mesh / dataplanes / index
  Background:
    Given the CSS selectors
      | Alias           | Selector                              |
      | table           | [data-testid='data-plane-collection'] |
      | table-header    | $table th                             |
      | table-row       | $table tbody tr                       |
      | dataplane-title | [data-testid='data-plane-collection'] |
    And the environment
      """
      KUMA_DATAPLANE_COUNT: 9
      """
    And the URL "/meshes/default/dataplanes+insights" responds with
      """
      body:
        items:
        - name: fake-backend
          mesh: fake-default
          dataplane:
            networking:
              inbound:
              - tags:
                  kuma.io/protocol: http
          dataplaneInsight:
            subscriptions:
            - status:
                lastUpdateTime: 2021-02-16T08:33:36.442044+01:00
                total: {}
                cds: {}
                eds: {}
                lds: {}
                rds: {}
              version:
                kumaDp:
                  version: 1.0.7
            - status:
                lastUpdateTime: 2021-02-18T08:33:36.442044+01:00
                total: {}
                cds: {}
                eds: {}
                lds: {}
                rds: {}
              version:
                kumaDp:
                  version: 1.0.8
        - name: fake-frontend
      """
    When I visit the "/mesh/default/data-planes" URL

  Scenario: The Proxy listing table has the correct columns
    Then the "$table-header" element exists 8 times
    Then the "$table-header" elements contain
      | Value        |
      | Name         |
      | Service      |
      | Protocol     |
      | Zone         |
      | Last Updated |
      | Status       |
      | Warnings     |

  Scenario: The Proxy listing has the expected content and UI elements
    Then the "$table-row" element exists 9 times
    Then the "$table-row:nth-child(1)" element contains
      | Value        |
      | fake-backend |
      | http         |
      | Feb 18, 2021 |
