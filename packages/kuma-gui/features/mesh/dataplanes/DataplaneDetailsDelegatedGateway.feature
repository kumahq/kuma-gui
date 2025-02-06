Feature: Dataplane details for delegated gateway

  Background:
    Given the CSS selectors
      | Alias       | Selector                                    |
      | detail-view | [data-testid='data-plane-detail-tabs-view'] |
      | warnings    | [data-testid='dataplane-warnings']          |
      | details     | [data-testid='dataplane-details']           |

  Scenario: Overview tab has expected content
    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 2
      KUMA_DATAPLANEINBOUND_COUNT: 0
      KUMA_MODE: global
      """
    And the URL "/meshes/default/dataplanes/dataplane-gateway_delegated-1/_overview" responds with
      """
      body:
        mesh: default
        dataplane:
          networking:
            address: 193.107.134.106
            gateway:
              type: DELEGATED
              tags:
                kuma.io/protocol: http
                kuma.io/zone: zone-1
            inbound: !!js/undefined
        dataplaneInsight:
          mTLS: !!js/undefined
          subscriptions:
            - controlPlaneInstanceId: 'dpp-1-cp-instance-id'
              connectTime: 2021-02-17T07:33:36.412683Z
              disconnectTime: 2021-02-17T07:33:36.412683Z
              version: !!js/undefined
            - controlPlaneInstanceId: 'dpp-1-cp-instance-id'
              connectTime: 2021-02-17T07:33:36.412683Z
              disconnectTime: !!js/undefined
              version:
                kumaDp:
                  version: 1.0.8
                  kumaCpCompatible: true
                envoy:
                  kumaDpCompatible: true
      """
    When I visit the "/meshes/default/data-planes/dataplane-gateway_delegated-1/overview" URL
    Then the page title contains "dataplane-gateway_delegated-1"
    And the "$detail-view" element contains "dataplane-gateway_delegated-1"
    And the "$details" element contains
      | Value                 |
      | online                |
      |       193.107.134.106 |
      | kuma.io/protocol:http |
      | kuma.io/zone:zone-1   |
    And the "$warnings" element exists
