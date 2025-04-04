Feature: Dataplane policies

  Background:
    Given the CSS selectors
      | Alias                              | Selector                                                              |
      | policies-view                      | [data-testid='data-plane-policies-view']                              |
      | rules-based-policies               | [data-testid='rules-based-policies']                                  |
      | sidecar-dataplane-policies         | [data-testid='sidecar-dataplane-policies']                            |
      | legacy-sidecar-policies            | [data-testid='sidecar-dataplane-policies']                            |
      | legacy-gateway-policies            | [data-testid='builtin-gateway-dataplane-policies']                    |
      | builtin-gateway-dataplane-policies | [data-testid='builtin-gateway-dataplane-policies']                    |
      | proxy-rules                        | [data-testid='proxy-rule-list']                                       |
      | proxy-rule-item                    | $proxy-rules .accordion-item                                          |
      | proxy-rule-item-button             | $proxy-rule-item:nth-child(1) [data-testid='accordion-item-button']   |
      | to-rules                           | [data-testid='to-rule-list']                                          |
      | to-rule-item                       | $to-rules .accordion-item                                             |
      | to-rule-item-button                | $to-rule-item:nth-child(1) [data-testid='accordion-item-button']      |
      | to-rule-item-content               | $to-rule-item:nth-child(1) [data-testid='accordion-item-content']     |
      | from-rule-item                     | [data-testid='from-rule-list-0'] .accordion-item                      |
      | from-rule-item-button              | $from-rule-item:nth-child(1) [data-testid='accordion-item-button']    |
      | inbound-rule-item                  | [data-testid='inbound-rule-list-0'] .accordion-item                   |
      | inbound-rule-item-button           | $inbound-rule-item:nth-child(1) [data-testid='accordion-item-button'] |
      | summary-slideout-container         | [data-testid='summary'] [data-testid='slideout-container']            |

  Rule: Any networking type

    Scenario: Policies tab has expected content (MeshHTTPRoute with to rules)
      Given the environment
        """
        KUMA_DATAPLANE_PROXY_RULE_ENABLED: false
        KUMA_DATAPLANE_RULE_COUNT: 2
        KUMA_DATAPLANE_TO_RULE_COUNT: 2
        KUMA_DATAPLANE_FROM_RULE_COUNT: 0
        """
      And the URL "/meshes/default/dataplanes/dataplane-1/_rules" responds with
        """
        body:
          rules:
            - type: MeshHTTPRoute
              toRules:
                - matchers:
                    - key: kuma.io/service
                      not: false
                      value: other-svc
                  origin:
                    - mesh: default
                      name: the-other-http-route
                      type: MeshHTTPRoute
                - matchers:
                    - key: kuma.io/service
                      not: false
                      value: backend_kuma-demo_svc_3001
                  origin:
                    - mesh: default
                      name: the-http-route
                      type: MeshHTTPRoute
            - type: MeshTimeout
              toRules:
                - matchers:
                    - key: __rule-matches-hash__
                      not: false
                      value: waFsoIISmZDTfFWYqxvY265/GASHYEWvHQTwMh/bpuU=
                    - key: kuma.io/service
                      not: false
                      value: backend_kuma-demo_svc_3001
                  origin:
                    - mesh: default
                      name: on-route
                      type: MeshTimeout
                    - mesh: default
                      name: on-service
                      type: MeshTimeout
                - matchers:
                    - key: __rule-matches-hash__
                      not: true
                      value: waFsoIISmZDTfFWYqxvY265/GASHYEWvHQTwMh/bpuU=
                    - key: kuma.io/service
                      not: false
                      value: backend_kuma-demo_svc_3001
                  origin:
                    - mesh: default
                      name: on-service
                      type: MeshTimeout
        """
      When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL
      Then the "$policies-view" element contains "MeshHTTPRoute"
      And the "$policies-view" element contains "MeshTimeout"
      When I click the "$to-rule-item:nth-child(1) [data-testid='accordion-item-button']" element
      Then the "$to-rule-item:nth-child(1)" element contains "kuma.io/service:other-svc"
      And the "$to-rule-item:nth-child(1)" element contains "kuma.io/service:backend_kuma-demo_svc_3001"
      When I click the "$to-rule-item:nth-child(2) [data-testid='accordion-item-button']" element
      Then the "$to-rule-item:nth-child(2)" element contains "__rule-matches-hash__:waFsoIISmZDTfFWYqxvY265/GASHYEWvHQTwMh/bpuU= and"
      Then the "$to-rule-item:nth-child(2)" element contains "kuma.io/service:backend_kuma-demo_svc_3001"
      And the "$to-rule-item:nth-child(2)" element contains "!__rule-matches-hash__:waFsoIISmZDTfFWYqxvY265/GASHYEWvHQTwMh/bpuU= and"
      And the "$to-rule-item:nth-child(2)" element contains "kuma.io/service:backend_kuma-demo_svc_3001"

    Scenario: Policies tab has expected content (MeshTimeout with from & to rules)
      Given the environment
        """
        KUMA_DATAPLANE_PROXY_RULE_ENABLED: false
        KUMA_DATAPLANE_RULE_COUNT: 1
        KUMA_DATAPLANE_TO_RULE_COUNT: 3
        KUMA_DATAPLANE_FROM_RULE_COUNT: 1
        KUMA_DATAPLANE_INBOUND_RULE_COUNT: 0
        KUMA_RESOURCE_COUNT: 1
        """
      And the URL "/meshes/default/dataplanes/dataplane-1/_rules" responds with
        """
        body:
          rules:
            - type: MeshTimeout
              fromRules:
                - inbound:
                    port: 8080
                    tags:
                      kuma.io/service: foo
                  rules:
                    - matchers:
                        - key: kuma.io/service
                          not: false
                          value: one
                        - key: kuma.io/service
                          not: true
                          value: two
                      origin:
                        - mesh: default
                          name: default
                          type: MeshTimeout
                      conf:
                        connectionTimeout: 20s
                        idleTimeout: 20s
                        http:
                          requestTimeout: 5s
                    - matchers:
                        - key: kuma.io/service
                          not: false
                          value: one
                        - key: kuma.io/service
                          not: true
                          value: two
                      origin:
                        - mesh: default
                          name: override
                          type: MeshTimeout
                      conf:
                        connectionTimeout: 20s
                        idleTimeout: 20s
                        http:
                          requestTimeout: 5s
                    - matchers:
                        - key: kuma.io/service
                          not: false
                          value: one
                        - key: kuma.io/service
                          not: true
                          value: two
                      origin:
                        - mesh: default
                          name: default
                          type: MeshTimeout
                      conf:
                        connectionTimeout: 20s
                        idleTimeout: 20s
                        http:
                          requestTimeout: 5s
              toRules:
                - matchers:
                    - key: kuma.io/service
                      not: false
                      value: foo
                  origin:
                    - mesh: default
                      name: default
                      type: MeshTimeout
                    - mesh: default
                      name: override
                      type: MeshTimeout
                  conf:
                    connectionTimeout: 2s
                    idleTimeout: 20s
                    http:
                      requestTimeout: 15s
                - matchers:
                    - key: kuma.io/service
                      not: false
                      value: bar
                  origin:
                    - mesh: default
                      name: default
                      type: MeshTimeout
                    - mesh: default
                      name: override
                      type: MeshTimeout
                  conf:
                    connectionTimeout: 2s
                    idleTimeout: 20s
                    http:
                      requestTimeout: 20s
                - matchers:
                    - key: kuma.io/service
                      not: true
                      value: bar
                    - key: kuma.io/service
                      not: true
                      value: foo
                  origin:
                    - mesh: default
                      name: default
                      type: MeshTimeout
                  conf:
                    connectionTimeout: 2s
                    idleTimeout: 20s
                    http:
                      requestTimeout: 10s
        """
      And the URL "/_resources" responds with
        """
        body:
          resources:
            - name: MeshTimeout
              policy:
                isFromAsRules: false
        """
      When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL
      Then the "$policies-view" element contains "MeshTimeout"
      When I click the "$to-rule-item:nth-child(1) [data-testid='accordion-item-button']" element
      Then the "$to-rule-item:nth-child(1)" element contains "kuma.io/service:foo"
      And the "$to-rule-item:nth-child(1)" element contains "kuma.io/service:bar"
      When I click the "$from-rule-item:nth-child(1) [data-testid='accordion-item-button']" element
      Then the "$from-rule-item:nth-child(1)" element contains "kuma.io/service:one and"
      Then the "$from-rule-item:nth-child(1)" element contains "!kuma.io/service:two"

    Scenario: Policies tab has expected content (MeshTimeout with proxy & to rule)
      Given the environment
        """
        KUMA_DATAPLANE_PROXY_RULE_ENABLED: true
        KUMA_DATAPLANE_RULE_COUNT: 1
        KUMA_DATAPLANE_TO_RULE_COUNT: 1
        KUMA_DATAPLANE_FROM_RULE_COUNT: 0
        """
      And the URL "/_resources" responds with
        """
        body:
          resources:
            - name: MeshProxyPatch
              path: meshproxypatches
              singularDisplayName: Mesh Proxy Patch
              pluralDisplayname: Mesh Proxy Patches
              includeInFederation: true
              readOnly: false
              scope: Mesh
              policy:
                hasFromTargetRef: false
                hasToTargetRef: false
                isFromAsRules: false
                isTargetRef: false
            - name: MeshTimeout
              path: meshtimeouts
              singularDisplayName: Mesh Timeout
              pluralDisplayname: Mesh Timeouts
              includeInFederation: true
              readOnly: false
              scope: Mesh
              policy:
                hasFromTargetRef: true
                hasToTargetRef: true
                isFromAsRules: true
                isTargetRef: true
        """
      And the URL "/meshes/default/dataplanes/dataplane-1/_rules" responds with
        """
        body:
          rules:
            - type: MeshTimeout
              toRules:
                - matchers:
                    - key: kuma.io/service
                      not: true
                      value: bar
                  origin:
                    - mesh: default
                      name: mt-on-gateway
                      type: MeshTimeout
                  conf:
                    connectionTimeout: 2s
                    idleTimeout: 20s
                    http:
                      requestTimeout: 10s
            - type: MeshProxyPatch
              proxyRule:
                origin:
                  - mesh: default
                    name: mpp-on-gateway
                    type: MeshProxyPatch
                conf:
                  appendModifications:
                    - cluster:
                        operation: Add
                        value: |-
                          name: test-cluster
                          connectTimeout: 5s
                          type: STATIC
        """
      When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL
      Then the "$policies-view" element contains "MeshTimeout"
      When I click the "$proxy-rule-item:nth-child(1) [data-testid='accordion-item-button']" element
      Then the "$proxy-rule-item:nth-child(1)" element contains "mpp-on-gateway"
      When I click the "$to-rule-item:nth-child(1) [data-testid='accordion-item-button']" element
      Then the "$to-rule-item:nth-child(1)" element contains "!kuma.io/service:bar"

    Scenario: The origin policies link in the policies rules' policy list opens the policy summary panel
      Given the environment
        """
        KUMA_DATAPLANE_PROXY_RULE_ENABLED: false
        KUMA_DATAPLANE_RULE_COUNT: 1
        KUMA_DATAPLANE_TO_RULE_COUNT: 1
        KUMA_DATAPLANE_FROM_RULE_COUNT: 0
        """
      And the URL "/meshes/default/dataplanes/dataplane-1/_rules" responds with
        """
        body:
          rules:
            - type: MeshHTTPRoute
              toRules:
                - matchers:
                    - key: kuma.io/service
                      not: false
                      value: other-svc
                  origin:
                    - mesh: default
                      name: the-other-http-route
                      type: MeshHTTPRoute
        """
      When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL
      Then the "$policies-view" element contains "MeshHTTPRoute"
      When I click the "$to-rule-item-button" element
      Then the "$to-rule-item-content" element exists
      Then the "$to-rule-item-content table tr:nth-child(1) td.origins-column a" element contains "the-other-http-route"
      When I click the "$to-rule-item-content table tr:nth-child(1) td.origins-column a" element
      Then the "$summary-slideout-container" element exists
      And the "$summary-slideout-container [data-testid='slideout-title']" element exists
      And the "$summary-slideout-container [data-testid='slideout-title'] h2 a" element contains "the-other-http-route"

    Scenario: Policies tab has expected content (inbound rules & partial from rules)
      Given the environment
        """
        KUMA_DATAPLANE_PROXY_RULE_ENABLED: false
        KUMA_DATAPLANE_RULE_COUNT: 1
        KUMA_DATAPLANE_TO_RULE_COUNT: 0
        KUMA_DATAPLANE_INBOUND_RULE_COUNT: 1
        KUMA_DATAPLANE_FROM_RULE_COUNT: 1
        """
      And the URL "/meshes/default/dataplanes/dataplane-1/_rules" responds with
        """
        body:
          rules:
            - type: MeshHTTPRoute
              fromRules:
                - inbound:
                    port: 8080
                    tags:
                      kuma.io/service: foo
              inboundRules:
                - inbound:
                    port: 8080
                    tags:
                      kuma.io/service: foo
        """
      And the URL "/_resources" responds with
        """
        body:
          resources:
            - name: MeshHTTPRoute
              policy:
                isFromAsRules: true
        """
      When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL
      Then the "$to-rule-item-content" element doesn't exist
      And the "$from-rule-item" element doesn't exist
      And the "$inbound-rule-item" element exists

  Rule: Standard proxy

    Background:
      Given the environment
        """
        KUMA_DATAPLANE_TYPE: standard
        KUMA_DATAPLANE_TO_RULE_COUNT: 1
        """

    Scenario: Federated shows the rules but no legacy content
      Given the environment
        """
        KUMA_MODE: global
        """
      When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL
      Then the "$to-rules" element exists
      And the "$legacy-sidecar-policies" element doesn't exist
      And the "$legacy-gateway-policies" element doesn't exist

    Scenario: Non-federated shows the rules and only sidecar legacy content
      Given the environment
        """
        KUMA_MODE: zone
        """
      When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL
      Then the "$to-rules" element exists
      And the "$legacy-sidecar-policies" element exists
      And the "$legacy-gateway-policies" element doesn't exist

  Rule: Delegated gateway

    Background:
      Given the environment
        """
        KUMA_DATAPLANE_TYPE: delegated
        KUMA_DATAPLANE_TO_RULE_COUNT: 1
        """

    Scenario: Federated shows the rules but no legacy content
      Given the environment
        """
        KUMA_MODE: global
        """
      When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL
      Then the "$to-rules" element exists
      And the "$legacy-sidecar-policies" element doesn't exist
      And the "$legacy-gateway-policies" element doesn't exist
    # We repeat the same test as the one before but with an omitted so we can test
    # an omitted gateway.type. If we ever stop folks accessing gateway.type and rely on the
    # data layer unit test for this instead, we can remove this test.

    Scenario: Federated (with a default/delegated type) shows the rules but no legacy content
      Given the environment
        """
        KUMA_MODE: global
        """
      And the URL "/meshes/default/dataplanes/dataplane-1/_overview" responds with
        """
        body:
          dataplane:
            networking:
              gateway:
                type: !!js/undefined
        """
      When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL
      Then the "$to-rules" element exists
      And the "$legacy-sidecar-policies" element doesn't exist
      And the "$legacy-gateway-policies" element doesn't exist

    Scenario: Non-federated shows the rules and only sidecar-like (i.e. delegated) gateway legacy content
      Given the environment
        """
        KUMA_MODE: zone
        """
      When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL
      Then the "$to-rules" element exists
      And the "$legacy-sidecar-policies" element exists
      And the "$legacy-gateway-policies" element doesn't exist

  Rule: Built-in gateway

    Background:
      Given the environment
        """
        KUMA_DATAPLANE_TYPE: builtin
        KUMA_DATAPLANE_TO_RULE_COUNT: 1
        """

    Scenario: Federated shows the rules but no legacy content
      Given the environment
        """
        KUMA_MODE: global
        """
      When I visit the "/meshes/default/data-planes/dataplane-gateway_builtin-1/policies" URL
      Then the "$to-rules" element exists
      And the "$legacy-sidecar-policies" element doesn't exist
      And the "$legacy-gateway-policies" element doesn't exist

    Scenario: Non-federated shows the rules and only builtin gateway legacy content
      Given the environment
        """
        KUMA_MODE: zone
        """
      When I visit the "/meshes/default/data-planes/dataplane-gateway-builtin-1/policies" URL
      Then the "$to-rules" element exists
      And the "$legacy-sidecar-policies" element doesn't exist
      And the "$legacy-gateway-policies" element exists
