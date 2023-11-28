Feature: Dataplane details for built-in gateway
  Background:
    Given the CSS selectors
      | Alias             | Selector                                                           |
      | detail-view       | [data-testid='data-plane-detail-tabs-view']                        |
      | policies-view     | [data-testid='data-plane-policies-view']                           |
      | overview-tab      | #data-plane-detail-view-tab a                                      |
      | policies-tab      | #data-plane-policies-view-tab a                                    |
      | warnings          | [data-testid='dataplane-warnings']                                 |
      | details           | [data-testid='dataplane-details']                                  |
      | inbounds          | [data-testid='dataplane-inbounds']                                 |
      | route-item        | [data-testid='builtin-gateway-dataplane-policies'] .accordion-item |
      | route-item-button | $route-item:nth-child(1) [data-testid='accordion-item-button']     |
    And the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 2
      KUMA_DATAPLANEINBOUND_COUNT: 0
      KUMA_MODE: global
      """
    And the URL "/meshes/default/dataplanes/dataplane-gateway_builtin-1/_overview" responds with
      """
      body:
        mesh: default
        dataplane:
          networking:
            address: 193.107.134.106
            gateway:
              type: BUILTIN
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

    When I visit the "/meshes/default/data-planes/dataplane-gateway_builtin-1/overview" URL

  Scenario: Overview tab has expected content
    Then the page title contains "dataplane-gateway_builtin-1"
    And the "$detail-view" element contains "dataplane-gateway_builtin-1"
    And the "$details" element contains
      | Value                 |
      | online                |
      | 193.107.134.106       |
      | kuma.io/protocol:http |
      | kuma.io/zone:zone-1   |
    And the "$warnings" element doesn't exist
    And the "$inbounds" element doesn't exist

  Scenario: Policies tab has expected content
    Given the URL "/meshes/default/dataplanes/dataplane-gateway_builtin-1/policies" responds with
      """
      body:
        listeners:
          - hosts:
              - routes:
                 - destinations:
                    - tags:
                        kuma.io/service: demo-app_kuma-demo_svc_5000
                      policies:
                        CircuitBreaker:
                          name: circuit-breaker-1
        policies:
          TrafficLog:
            name: traffic-log-1
          TrafficTrace:
            name: traffic-trace-1
      """

    When I click the "$policies-tab" element

    Then the "$policies-view" element contains "traffic-log-1"
    And the "$policies-view" element contains "traffic-trace-1"

    When I click the "$route-item-button" element

    Then the "$policies-view" element contains "circuit-breaker-1"
    And the "$policies-view" element contains "demo-app_kuma-demo_svc_5000"
