Feature: mesh / builtin-gateways / item

  Background:
    Given the CSS selectors
      | Alias         | Selector                                         |
      | tabs-view     | [data-testid='builtin-gateway-detail-tabs-view'] |
      | listener-card | [data-testid='listener-card']                    |
      | route-card    | [data-testid='route-card']                       |
      | dataplanes    | [data-testid='data-plane-collection']            |
      | config        | [data-testid='config']                           |
    Given the environment
      """
      KUMA_LISTENER_COUNT: 2
      KUMA_DATAPLANE_RULE_COUNT: 1
      KUMA_DATAPLANE_PROXY_RULE_ENABLED: false
      KUMA_DATAPLANE_TO_RULE_COUNT: 2
      KUMA_DATAPLANE_FROM_RULE_COUNT: 0
      KUMA_RULE_MATCHER_COUNT: 1
      KUMA_RULE_MATCH_COUNT: 2
      """
    Given the URL "/meshes/default/meshgateways/gateway-1.kuma-system" responds with
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
            - hostname: bar.com
              port: 81
              protocol: HTTP
              tags:
                listener: listener-1
              tls:
                mode: TERMINATE
      """
    Given the URL "/meshes/default/meshgateways/gateway-1.kuma-system/_rules" responds with
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
                - method: DELETE
                default:
                  backendRefs:
                  - kind: MeshService
                    name: demo-app_kuma-demo_svc_5000
                    weight: 1
              - matches:
                - path:
                    value: "/api"
                    type: PathPrefix
                - queryParams:
                  - name: size
                    type: Exact
                    value: '1'
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
            - mesh: default
              name: demo-app-2.kuma-system
              type: MeshHTTPRoute
          - conf:
              rules:
              - matches:
                - headers:
                  - name: X-Test-Header
                    value: test-1
                  - name: X-Test-Header
                    value: test-2
                default:
                  backendRefs:
                  - kind: MeshService
                    name: service-2
                    weight: 1
              hostnames:
              - bar.com
            matchers:
            - key: listener
              value: random-listener
              not: true
            origin:
            - mesh: default
              name: demo-app-3.kuma-system
              type: MeshHTTPRoute
            - mesh: default
              name: demo-app-4.kuma-system
              type: MeshHTTPRoute
      """

  Scenario: Overview tab has expected content
    When I visit the "/meshes/default/gateways/builtin/gateway-1.kuma-system/overview" URL
    Then the URL contains "/builtin/gateway-1.kuma-system/overview?listener=0"
    Then the "$tabs-view" element contains "gateway-1"
    Then the "$listener-card" element exists 2 times
    Then the "$route-card" element exists 2 times
    Then the "$listener-card:nth-child(1).active" element exists
    Then the "$listener-card:nth-child(1)" element contains "*:80"
    Then the "$listener-card:nth-child(2)" element contains "bar.com:81"
    Then the "$listener-card:nth-child(2)" element contains "TLS"
    Then the "$listener-card:nth-child(2)" element contains "TERMINATE"
    Then the "$route-card:nth-child(1)" element contains "demo-app-1.kuma-system"
    Then the "$route-card:nth-child(1)" element contains "service-1"
    Then the "$route-card:nth-child(2)" element contains "demo-app-3.kuma-system"
    Then the "$route-card:nth-child(2)" element contains "service-2"
    When I click the "$listener-card:nth-child(2) [data-action]" element
    Then the URL contains "/builtin/gateway-1.kuma-system/overview?listener=1"
    Then the "$route-card" element exists 1 times
    Then the "$listener-card:nth-child(2).active" element exists
    Then the "$route-card:nth-child(1)" element contains "demo-app-3.kuma-system"
    Then the "$route-card:nth-child(1)" element contains "service-2"

  Scenario: Navigate to overview with non-first selected listener
    When I visit the "/meshes/default/gateways/builtin/gateway-1.kuma-system/overview?listener=1" URL
    Then the "$listener-card:nth-child(2).active" element exists
    Then the "$route-card:nth-child(1)" element contains "demo-app-3.kuma-system"
    Then the "$route-card:nth-child(1)" element contains "service-2"

  Scenario: Dataplanes tab has expected content
    When I visit the "/meshes/default/gateways/builtin/gateway-1.kuma-system/dataplanes" URL
    Then the "$dataplanes" element exists

  Scenario: Config tab has expected content
    When I visit the "/meshes/default/gateways/builtin/gateway-1.kuma-system/config" URL
    Then the "$config" element exists
