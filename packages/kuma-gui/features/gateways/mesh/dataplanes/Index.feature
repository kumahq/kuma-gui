Feature: gateways / mesh / dataplanes / index

  Background:
    Given the CSS selectors
      | Alias                | Selector                                     |
      | table                | [data-testid='data-plane-collection']        |
      | item                 | $table tbody tr                              |
      | select-type          | [data-testid='select-input']                 |
      | select-option        | .select-item                                 |
      | select-builtin       | [data-testid='select-item-builtin'] button   |
      | select-delegated     | [data-testid='select-item-delegated'] button |
      | service-link-gateway | $table a[href*='gateways/delegated']         |
    And the environment
      """
      KUMA_GATEWAYS_ENABLED: true
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      KUMA_MODE: global
      KUMA_DATAPLANE_COUNT: 9
      KUMA_DATAPLANEINBOUND_COUNT: 1
      KUMA_DATAPLANELISTENER_COUNT: 0
      KUMA_SUBSCRIPTION_COUNT: 2
      """
    # we use an undefined display-name here to show that things will fallback
    And the URL "/meshes/default/dataplanes/_overview" responds with
      """
      body:
        items:
        - name: fake-backend
          mesh: fake-default
          labels:
            kuma.io/display-name: !!js/undefined
            kuma.io/zone: !!js/undefined
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
          labels:
            kuma.io/display-name: fake-frontend
      """

  Scenario: A delegated gateway proxy links its service to the delegated gateway
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
            labels:
              kuma.io/display-name: fake-alarm-gateway_delegated-0
            dataplane:
              networking:
                gateway:
                  type: 'DELEGATED'
                  tags:
                    kuma.io/service: service-1
      """
    When I visit the "/meshes/default/data-planes" URL
    Then the "$item" element exists 1 time
    And the "$service-link-gateway" element exists

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
              labels:
                kuma.io/display-name: fake-transmitter-gateway_builtin-0
              dataplane:
                networking:
                  gateway:
                    type: 'BUILTIN'
                    tags:
                      kuma.io/service: service-1
        """
      When I visit the "/meshes/default/data-planes" URL
      And I click the "$select-type" element
      Then the "$select-option" element exists 6 times
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
              labels:
                kuma.io/display-name: fake-alarm-gateway_delegated-0
              dataplane:
                networking:
                  gateway:
                    type: 'DELEGATED'
                    tags:
                      kuma.io/service: service-1
        """
      When I visit the "/meshes/default/data-planes" URL
      And I click the "$select-type" element
      Then the "$select-option" element exists 6 times
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
