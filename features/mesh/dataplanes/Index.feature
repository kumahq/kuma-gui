Feature: mesh / dataplanes / index
  Background:
    Given the CSS selectors
      | Alias           | Selector                                     |
      | button-back     | [data-testid='data-plane-ns-back-button']    |
      | button-refresh  | [data-testid='data-overview-refresh-button'] |
      | table           | [data-testid='data-overview-table']          |
      | table-header    | $table th                                    |
      | table-row       | $table tbody tr                              |
      | dataplane-title | [data-testid='data-overview-table']          |
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
              version:
                kumaDp:
                  version: 1.0.7
            - status:
                lastUpdateTime: 2021-02-18T08:33:36.442044+01:00
              version:
                kumaDp:
                  version: 1.0.8
        - name: fake-frontend
      """
    When I visit the "/mesh/default/data-planes" URL

  Scenario: The Proxy listing table has the correct columns
    Then the "$table-header" element exists 7 times
    Then the "$table-header" elements contain
      | Value           |
      | Status          |
      | Name            |
      | Service         |
      | Protocol        |
      | Zone            |
      | Last Updated    |
      | Kuma DP version |

  Scenario: The Proxy listing has the expected content and UI elements
    Then the "$button-back" element doesn't exist
    Then the "$button-refresh" element exists
    Then the "$table-row" element exists 9 times
    Then the "$table-row:nth-child(1)" element contains
      | Value             |
      | fake-backend      |
      | http              |
      | February 18, 2021 |
      | 1.0.8             |


  Scenario: The Proxy listing shows information of selected DPP when clicked
    Then the "$dataplane-title" element contains "fake-backend"
    Then the URL contains "dpp=fake-backend"
    Then the "$table-row:nth-child(2)" element contains "fake-frontend"
    Then the "$table-row:nth-child(2):not(.is-selected)" element exists
    When I "click" the "$table-row:nth-child(2) td:first-child" element
    Then the "$table-row:nth-child(2).is-selected" element exists
    Then the "$dataplane-title" element contains "fake-frontend"
    Then the URL contains "dpp=fake-frontend"
