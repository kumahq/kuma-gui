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
      KUMA_SUBSCRIPTION_COUNT: 2
      """
    And the URL "/meshes/default/dataplanes/_overview" responds with
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
            mTLS:
              certificateExpirationTime: 2023-11-03T09:10:17Z
        - name: fake-frontend
      """

  Scenario: The Proxy listing table has the correct columns (mode: global)
    Given the environment
      """
      KUMA_MODE: global
      """

    When I visit the "/meshes/default/data-planes" URL

    Then the "$table-header" element exists 8 times
    And the "$table-header" elements contain
      | Value            |
      | Name             |
      | Service          |
      | Protocol         |
      | Zone             |
      | Certificate Info |
      | Status           |
      | Warnings         |

  Scenario: The Proxy listing table has the correct columns (mode: standalone)
    Given the environment
      """
      KUMA_MODE: standalone
      """

    When I visit the "/meshes/default/data-planes" URL

    Then the "$table-header" element exists 7 times
    And the "$table-header" elements contain
      | Value            |
      | Name             |
      | Service          |
      | Protocol         |
      | Certificate Info |
      | Status           |
      | Warnings         |

  Scenario: The Proxy listing has the expected content and UI elements
    When I visit the "/meshes/default/data-planes" URL

    Then the "$table-row" element exists 9 times
    Then the "$table-row:nth-child(1)" element contains
      | Value                |
      | fake-backend         |
      | http                 |
      | Nov 3, 2023, 9:10 AM |
