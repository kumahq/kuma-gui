Feature: mesh / dataplanes / overview / summary / Outbound

  Background:
    Given the CSS selectors
      | Alias                   | Selector                                         |
      | summary                 | [data-testid='slideout-container']               |
      | outbound-policies-rules | $summary [data-testid='outbound-policies-rules'] |
      | outbound-policies-rule  | $outbound-policies-rules li:first-of-type        |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      KUMA_MESHSERVICE_MODE: Exclusive
      KUMA_DATAPLANE_TYPE: standard
      """

  Scenario: Outbound summary overview shows expected content
    Given the URL "/meshes/default/dataplanes/service-less/_layout" responds with
      """
      body:
        outbounds:
          - kri: kri_dp_default_numeric_kuma-system_service-less_httpport
            port: 12345
            protocol: http
            proxyResourceName: kri_dp_default_numeric_kuma-system_service-less_httpport
      """
    And the URL "/meshes/default/dataplanes/service-less/_outbounds/kri_dp_default_numeric_kuma-system_service-less_httpport/_policies" responds with
      """
      body:
        policies:
          - kind: FaultInjection
            conf:
              delay:
                percentage: 10
                fixedDelay: 100ms
            origins:
              - kri: kri_policy_default_pigsty_jury_innovation_appliance
      """
    When I visit the "/meshes/default/data-planes/service-less/overview/outbound/kri_dp_default_numeric_kuma-system_service-less_httpport/overview" URL
    And the "$summary" element exists
    And the "$summary" element contains "Outbound: kri_dp_default_numeric_kuma-system_service-less_httpport"
    And the "$summary" element contains "HTTP"
    And the "$outbound-policies-rule" element contains "FaultInjection"
    And the "$outbound-policies-rule" element contains "kri_policy_default_pigsty_jury_innovation_appliance"
    And the "$outbound-policies-rule [data-testid='k-code-block']" element exists

  Scenario: Clicking on origin leads to policy detail view
    Given the environment
      """
      KUMA_DATAPLANE_RULE_COUNT: 1
      """
    And the URL "/meshes/default/dataplanes/service-less/_layout" responds with
      """
      body:
        outbounds:
          - kri: kri_dp_default_numeric_kuma-system_service-less_httpport
            port: 12345
            protocol: http
            proxyResourceName: kri_dp_default_numeric_kuma-system_service-less_httpport
      """
    And the URL "/meshes/default/dataplanes/service-less/_outbounds/kri_dp_default_numeric_kuma-system_service-less_httpport/_policies" responds with
      """
      body:
        policies:
          - kind: CircuitBreaker
            origins:
              - kri: kri_policy_default_pigsty_jury_the-policy-name_appliance
      """
    When I visit the "/meshes/default/data-planes/service-less/overview/outbound/kri_dp_default_numeric_kuma-system_service-less_httpport/overview" URL
    Then I click on the "$outbound-policies-rule ul:first-of-type li:first-of-type a:first-of-type" element
    Then the URL contains "/gui/meshes/default/policies/circuit-breakers/the-policy-name/overview/overview"
