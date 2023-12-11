Feature: Dataplane policies
  Rule: Standard proxy
    Background:
      Given the CSS selectors
        | Alias                       | Selector                                                            |
        | policies-view               | [data-testid='data-plane-policies-view']                            |
        | standard-dataplane-policies | [data-testid='standard-dataplane-policies']                         |
        | policy-list                 | [data-testid='policy-list']                                         |
        | proxy-rule-item             | [data-testid='proxy-rule-list'] .accordion-item                     |
        | proxy-rule-item-button      | $proxy-rule-item:nth-child(1) [data-testid='accordion-item-button'] |
        | to-rule-item                | [data-testid='to-rule-list'] .accordion-item                        |
        | to-rule-item-button         | $to-rule-item:nth-child(1) [data-testid='accordion-item-button']    |
        | from-rule-item              | [data-testid='from-rule-list-0'] .accordion-item                    |
        | from-rule-item-button       | $from-rule-item:nth-child(1) [data-testid='accordion-item-button']  |

    Scenario: Dataplane policies view shows expected content for standard proxy (mode: global)
      Given the environment
        """
        KUMA_MODE: global
        """
      And the URL "/meshes/default/dataplanes/dataplane-1/_overview" responds with
        """
        body:
          mesh: default
          dataplane:
            networking:
              gateway: !!js/undefined
        """
      When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL

      Then the "$standard-dataplane-policies" element exists
      And the "$policy-list" element doesn't exist

    Scenario: Dataplane policies view shows expected content for standard proxy (mode: standalone)
      Given the environment
        """
        KUMA_MODE: standalone
        """
      And the URL "/meshes/default/dataplanes/dataplane-1/_overview" responds with
        """
        body:
          mesh: default
          dataplane:
            networking:
              gateway: !!js/undefined
        """
      When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL

      Then the "$standard-dataplane-policies" element exists
      And the "$policy-list" element exists

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
                        - mesh: default
                          name: override
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

  Rule: Delegated gateway
    Background:
      Given the CSS selectors
        | Alias                          | Selector                                    |
        | standard-dataplane-policies    | [data-testid='standard-dataplane-policies'] |
        | standard-dataplane-policy-list | [data-testid='policy-list']                 |

    Scenario: Dataplane policies view shows expected content for delegated gateway
      Given the URL "/meshes/default/dataplanes/dataplane-1/_overview" responds with
        """
        body:
          mesh: default
          dataplane:
            networking:
              gateway:
                type: DELEGATED
        """

      When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL

      Then the "$standard-dataplane-policies" element exists

    Scenario: Dataplane policies view shows expected content for delegated gateway (with omitted type field)
      Given the URL "/meshes/default/dataplanes/dataplane-1/_overview" responds with
        """
        body:
          mesh: default
          dataplane:
            networking:
              gateway:
                type: !!js/undefined
        """

      When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL

      Then the "$standard-dataplane-policies" element exists

  Rule: Built-in gateway
    Background:
      Given the CSS selectors
        | Alias                              | Selector                                           |
        | builtin-gateway-dataplane-policies | [data-testid='builtin-gateway-dataplane-policies'] |

    Scenario: Dataplane policies view shows expected content for built-in gateway
      Given the URL "/meshes/default/dataplanes/dataplane-1/_overview" responds with
        """
        body:
          mesh: default
          dataplane:
            networking:
              gateway:
                type: BUILTIN
        """

      When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL

      Then the "$builtin-gateway-dataplane-policies" element exists
