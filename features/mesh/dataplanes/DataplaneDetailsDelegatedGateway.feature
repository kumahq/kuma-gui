Feature: Dataplane details for delegated gateway
  Background:
    Given the CSS selectors
      | Alias              | Selector                                                        |
      | detail-view        | [data-testid='data-plane-detail-tabs-view']                     |
      | policies-view      | [data-testid='data-plane-policies-view']                        |
      | overview-tab       | #data-plane-detail-view-tab a                                   |
      | policies-tab       | #data-plane-policies-view-tab a                                 |
      | warnings           | [data-testid='dataplane-warnings']                              |
      | details            | [data-testid='dataplane-details']                               |
      | inbounds           | [data-testid='dataplane-inbounds']                              |
      | policy-item        | [data-testid='policy-list'] .accordion-item                     |
      | policy-item-button | $policy-item:nth-child(1) [data-testid='accordion-item-button'] |
      | rule-item          | [data-testid='rule-list'] .accordion-item                       |
      | rule-item-button   | $rule-item:nth-child(1) [data-testid='accordion-item-button']   |
    And the environment
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

    When I visit the "/meshes/default/data-planes/dataplane-gateway_delegated-1/overview" URL

  Scenario: Overview tab has expected content
    Then the page title contains "dataplane-gateway_delegated-1"
    And the "$detail-view" element contains "dataplane-gateway_delegated-1"
    And the "$warnings" element doesn't exist
    And the "$details" element contains "online"
    And the "$details" element contains "193.107.134.106"
    And the "$details" element contains "kuma.io/protocol:http"
    And the "$details" element contains "kuma.io/zone:zone-1"
    And the "$inbounds" element doesn't exist

  Scenario: Policies tab has expected content
    Given the URL "/meshes/default/dataplanes/dataplane-gateway_delegated-1/policies" responds with
      """
      body:
        items:
          - matchedPolicies:
              FaultInjection:
                - sources:
                   - match:
                      kuma.io/service: service-a
      """
    And the URL "/meshes/default/dataplanes/dataplane-gateway_delegated-1/rules" responds with
      """
      body:
        items:
          - name: ''
          - name: demo-app_kuma-demo_svc_5000
            service: demo-app_kuma-demo_svc_5000
            tags:
              kuma.io/service: demo-app_kuma-demo_svc_5000
      """

    When I click the "$policies-tab" element
    And I click the "$policy-item-button" element

    Then the "$policies-view" element contains "kuma.io/service:service-a"

    When I click the "$rule-item-button" element

    Then the "$policies-view" element contains "kuma.io/service:demo-app_kuma-demo_svc_5000"
