Feature: legacy-services / mesh / builtin-gateways / item

  Background:
    Given the CSS selectors
      | Alias                 | Selector                                         |
      | tabs-view             | [data-testid='builtin-gateway-detail-tabs-view'] |
      | route-card            | [data-testid='route-card']                       |
      | service-link-internal | $tabs-view a[href*='services/internal']          |
    And the environment
      """
      KUMA_LEGACY_SERVICES_ENABLED: true
      KUMA_LISTENER_COUNT: 1
      KUMA_DATAPLANE_RULE_COUNT: 0
      KUMA_DATAPLANE_TO_RULE_COUNT: 0
      KUMA_DATAPLANE_FROM_RULE_COUNT: 0
      """
    And the URL "/meshes/default/meshgateways/gateway-1.kuma-system" responds with
      """
      body:
        conf:
          listeners:
            - hostname: !!js/undefined
              port: 80
              protocol: HTTP
              tags:
                listener: listener-0
              tls: !!js/undefined
      """
    And the URL "/meshes/default/meshgateways/gateway-1.kuma-system/_rules" responds with
      """
      body:
        rules:
        - type: MeshHTTPRoute
          toRules:
          - conf:
              rules:
              - matches:
                - path:
                    value: "/api"
                    type: PathPrefix
                default:
                  backendRefs:
                  - kind: MeshService
                    name: service-1
                    weight: 1
            matchers:
            - key: listener
              value: listener-0
              not: false
            origin:
            - mesh: default
              name: demo-app-1.kuma-system
              type: MeshHTTPRoute
      """

  Scenario: With legacy services a MeshService route backendRef links to the internal service detail
    When I visit the "/meshes/default/gateways/builtin/gateway-1.kuma-system/overview" URL
    Then the "$route-card:nth-child(1)" element contains "service-1"
    And the "$service-link-internal" element exists
