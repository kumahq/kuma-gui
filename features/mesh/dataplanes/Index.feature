Feature: mesh / dataplanes / index
  Background:
    Given the CSS selectors
      | Alias         | Selector                              |
      | table         | [data-testid='data-plane-collection'] |
      | table-header  | $table th                             |
      | item          | $table tbody tr                       |
      | service-cell  | $item:nth-child(1) td:nth-child(2)    |
      | protocol-cell | $item:nth-child(1) td:nth-child(3)    |
      | zone-cell     | $item:nth-child(1) td:nth-child(4)    |
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
                - health:
                    ready: true
                  tags:
                    kuma.io/service: service-1
                    kuma.io/protocol: http
                    kuma.io/zone: zone-1
          dataplaneInsight:
            mTLS:
              certificateExpirationTime: 2023-11-03T09:10:17Z
            subscriptions:
              - connectTime: 2021-02-17T07:33:36.412683Z
                disconnectTime: 2021-02-17T07:33:36.412683Z
              - connectTime: 2021-02-17T07:33:36.412683Z
                disconnectTime: !!js/undefined
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

    Then the "$item" element exists 9 times
    Then the "$item:nth-child(1)" element contains
      | Value                |
      | fake-backend         |
      | service-1            |
      | http                 |
      | zone-1               |
      | Nov 3, 2023, 9:10 AM |
      | online               |

  Scenario: The Data Plane Proxy list has the expected minimal content
    Given the environment
      """
      KUMA_DATAPLANE_COUNT: 1
      KUMA_SUBSCRIPTION_COUNT: 1
      """
    And the URL "/meshes/default/dataplanes/_overview" responds with
      """
      body:
        items:
          - name: dpp-2
            mesh: fake-default
            dataplane:
              networking:
                inbound:
                  - health:
                      ready: true
                    tags:
                      kuma.io/service: !!js/undefined
                      kuma.io/protocol: !!js/undefined
                      kuma.io/zone: !!js/undefined
            dataplaneInsight:
              mTLS:
                certificateExpirationTime: !!js/undefined
              subscriptions:
                - connectTime: 2021-02-17T07:33:36.412683Z
                  disconnectTime: 2021-02-17T07:33:36.412683Z
      """
    When I visit the "/meshes/default/data-planes" URL

    Then the "$service-cell" element is empty
    Then the "$protocol-cell" element is empty
    Then the "$zone-cell" element is empty

    Then the "$item:nth-child(1)" element contains
      | Value          |
      | dpp-2          |
      | No certificate |
      | offline        |
