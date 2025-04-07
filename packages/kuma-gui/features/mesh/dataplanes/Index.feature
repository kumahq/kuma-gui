Feature: mesh / dataplanes / index

  Background:
    Given the CSS selectors
      | Alias            | Selector                                         |
      | table            | [data-testid='data-plane-collection']            |
      | table-header     | $table th                                        |
      | item             | $table tbody tr                                  |
      | service-cell     | $item:nth-child(1) td:nth-child(3) .cell-wrapper |
      | select-type      | [data-testid='select-input']                     |
      | select-option    | .select-item                                     |
      | select-standard  | [data-testid='select-item-standard'] button      |
      | select-builtin   | [data-testid='select-item-builtin'] button       |
      | select-delegated | [data-testid='select-item-delegated'] button     |
      | input-search     | [data-testid='filter-bar-filter-input']          |
      | button-search    | [data-testid='filter-bar-submit-query-button']   |
    And the environment
      """
      KUMA_MODE: global
      KUMA_DATAPLANE_COUNT: 9
      KUMA_DATAPLANEINBOUND_COUNT: 1
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
              gateway: !!js/undefined
              inbound:
                - tags:
                    kuma.io/service: service-1
                    kuma.io/zone: zone-1
                  state: Ready
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

  Scenario: The Proxy listing table has the correct columns
    When I visit the "/meshes/default/data-planes" URL
    Then the "$table-header" element exists 9 times

  Scenario: The Proxy listing has the expected content and UI elements
    When I visit the "/meshes/default/data-planes" URL
    Then the "$item" element exists 9 times
    Then the "$item:nth-child(1)" element contains
      | Value                |
      | fake-backend         |
      | Proxy                |
      | service-1            |
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
                gateway: !!js/undefined
                inbound:
                  - tags:
                      kuma.io/service: !!js/undefined
                    state: Ready
            dataplaneInsight:
              mTLS:
                certificateExpirationTime: !!js/undefined
              subscriptions:
                - connectTime: 2021-02-17T07:33:36.412683Z
                  disconnectTime: 2021-02-17T07:33:36.412683Z
      """
    When I visit the "/meshes/default/data-planes" URL
    Then the "$service-cell" element is empty
    Then the "$item:nth-child(1)" element contains
      | Value          |
      | dpp-2          |
      | No certificate |
      | offline        |

  Scenario: Searching by tag doesn't overwrite the existing service tag
    When I visit the "/meshes/default/data-planes" URL
    Then the "$input-search" element isn't disabled
    And I wait for 500 ms
    When I "type" "service:system-1" into the "$input-search" element
    And I "type" "{enter}" into the "$input-search" element
    Then the URL "/meshes/default/dataplanes/_overview" was requested with
      """
      searchParams:
        tag:
          - "kuma.io/service:system-1"
        offset: 0
        size: 50
      """

  Rule: The listing can be filtered by type

    Scenario: Filtering by "builtin"
      Given the environment
        """
        KUMA_DATAPLANE_COUNT: 1
        KUMA_DATAPLANEINBOUND_COUNT: 0
        """
      And the URL "/meshes/default/dataplanes/_overview" responds with
        """
        body:
          items:
            - name: fake-transmitter-gateway_builtin-0
              dataplane:
                networking:
                  gateway:
                    type: 'BUILTIN'
                    tags:
                      kuma.io/service: service-1
        """
      When I visit the "/meshes/default/data-planes" URL
      And I click the "$select-type" element
      Then the "$select-option" element exists 4 times
      When I click the "$select-builtin" element
      Then the URL "/meshes/default/dataplanes/_overview" was requested with
        """
        searchParams:
          gateway: builtin
        """
      And the "$item" element exists 1 time
      And the "$item:nth-child(1)" element contains
        | Value                              |
        | fake-transmitter-gateway_builtin-0 |
        | Built-in gateway                   |

    Scenario: Filtering by "delegated"
      Given the environment
        """
        KUMA_DATAPLANE_COUNT: 1
        KUMA_DATAPLANEINBOUND_COUNT: 0
        """
      And the URL "/meshes/default/dataplanes/_overview" responds with
        """
        body:
          items:
            - name: fake-alarm-gateway_delegated-0
              dataplane:
                networking:
                  gateway:
                    type: 'DELEGATED'
                    tags:
                      kuma.io/service: service-1
        """
      When I visit the "/meshes/default/data-planes" URL
      And I click the "$select-type" element
      Then the "$select-option" element exists 4 times
      When I click the "$select-delegated" element
      Then the URL "/meshes/default/dataplanes/_overview" was requested with
        """
        searchParams:
          gateway: delegated
        """
      And the "$item" element exists 1 time
      And the "$item:nth-child(1)" element contains
        | Value                          |
        | fake-alarm-gateway_delegated-0 |
        | Delegated gateway              |

    Scenario: Filtering by "standard"
      Given the environment
        """
        KUMA_DATAPLANE_COUNT: 1
        """
      And the URL "/meshes/default/dataplanes/_overview" responds with
        """
        body:
          items:
            - name: fake-system-proxy-0
              dataplane:
                networking:
                  gateway: !!js/undefined
        """
      When I visit the "/meshes/default/data-planes" URL
      And I click the "$select-type" element
      Then the "$select-option" element exists 4 times
      When I click the "$select-standard" element
      Then the URL "/meshes/default/dataplanes/_overview" was requested with
        """
        searchParams:
          gateway: 'false'
        """
      And the "$item" element exists 1 time
      And the "$item:nth-child(1)" element contains
        | Value               |
        | fake-system-proxy-0 |
        | Proxy               |
