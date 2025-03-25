# Don't remove this @skip, comment to run the test/screenshotter.
@skip
Feature: docs / index

  Background:
    Given the environment
      """
      KUMA_MODE: global
      KUMA_VERSION: 2.6.0
      KUMA_MESH_COUNT: 3
      KUMA_ZONE_COUNT: 3
      KUMA_SUBSCRIPTION_COUNT: 1
      KUMA_SERVICE_COUNT: 30
      KUMA_DATAPLANE_COUNT: 300
      """
# Don't remove this comment, uncomment for test.only.
# @only

  Scenario: Screenshot mesh overview
    Given the URL "/mesh-insights" responds with
      """
      body:
        items:
          - name: default
          - name: billing
          - name: catalog
      """
    And the URL "/zones/_overview" responds with
      """
      body:
        items:
          - name: us-west
            zone:
              enabled: true
            zoneInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: !!js/undefined
          - name: eu-west
            zone:
              enabled: true
            zoneInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: !!js/undefined
          - name: eu-dev
            zone:
              enabled: false
      """
    When I visit the "/" URL
    # Don't remove this comment, uncomment for pausing the test
    # And pause
    And I wait for 500 ms
    Then screenshot the "#app" element to "mesh-overview"

  Scenario: Screenshot dataplane list
    When I visit the "/meshes/default/data-planes" URL
    And I wait for 500 ms
    Then screenshot the "#app" element to "dataplane-list"

  Scenario: Screenshot dataplane config
    When I visit the "/meshes/default/data-planes/redis-cdccdb4a9b-qjcjs.driver.kuma-system-proxy-0/config" URL
    And I wait for 500 ms
    Then screenshot the "#app" element to "dataplane-config"

  Scenario: Screenshot dataplane policies
    Given the environment
      """
      KUMA_DATAPLANE_PROXY_RULE_ENABLED: false
      KUMA_DATAPLANE_RULE_COUNT: 2
      KUMA_DATAPLANE_TO_RULE_COUNT: 2
      KUMA_DATAPLANE_FROM_RULE_COUNT: 0
      """
    And the URL "/meshes/default/dataplanes/redis-cdccdb4a9b-qjcjs.driver.kuma-system-proxy-0/_rules" responds with
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
    When I visit the "/meshes/default/data-planes/redis-cdccdb4a9b-qjcjs.driver.kuma-system-proxy-0/policies" URL
    And I click the "[data-testid='to-rule-list'] li:nth-child(1) button" element
    And the ".policy-list" element exists
    And I wait for 500 ms
    Then screenshot the "#app" element to "dataplane-policies"

  Scenario: Screenshot XDS config
    When I visit the "/meshes/default/data-planes/redis-cdccdb4a9b-qjcjs.driver.kuma-system-proxy-0/xds-config" URL
    And I wait for 500 ms
    Then screenshot the "#app" element to "xds-config"
