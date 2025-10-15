Feature: mesh / dataplanes / overview / summary / Inbound

  Background:
    Given the CSS selectors
      | Alias                  | Selector                                        |
      | summary                | [data-testid='slideout-container']              |
      | inbound-policies-rules | $summary [data-testid='inbound-policies-rules'] |
      | inbound-policies-rule  | $inbound-policies-rules li:first-of-type        |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      KUMA_MESHSERVICE_MODE: Exclusive
      KUMA_DATAPLANEINBOUND_COUNT: 1
      KUMA_DATAPLANE_TYPE: standard
      """

  Scenario: Inbound summary overview shows expected content
    Given the URL "/meshes/default/dataplanes/service-less/_layout" responds with
      """
      body:
        inbounds:
          - kri: kri_dp_default_numeric_kuma-system_service-less_http
            port: 12345
            protocol: http
            proxyResourceName: self_inbound_http
      """
    And the URL "/meshes/default/dataplanes/service-less/_inbounds/kri_dp_default_numeric_kuma-system_service-less_http/_policies" responds with
      """
      body:
        policies:
          - kind: MeshFaultInjection
            rules:
              - conf:
                  delay: 
                    percentage: 10
                    fixedDelay: 100ms
            origins:
              - kri: kri_mfi_default_pigsty_jury_innovation_appliance
      """
    And the URL "/meshes/default/dataplanes/service-less/_overview" responds with
      """
      body:
        dataplane:
          networking:
            inbound:
              - name: http
                port: 12345
                tags:
                  kuma.io/protocol: http
      """
    When I visit the "/meshes/default/data-planes/service-less/overview/inbound/self_inbound_http/overview" URL
    And the "$summary" element exists
    And the "$summary" element contains "Inbound: self_inbound_http"
    And the "$summary" element contains "HTTP"
    And the "$inbound-policies-rule" element contains "MeshFaultInjection"
    And the "$inbound-policies-rule" element contains "kri_mfi_default_pigsty_jury_innovation_appliance"
    And the "$inbound-policies-rule [data-testid='k-code-block']" element exists

  Scenario: Clicking on origin leads to policy detail view
    Given the environment
      """
      KUMA_DATAPLANE_RULE_COUNT: 1
      """
    And the URL "/meshes/default/dataplanes/service-less/_layout" responds with
      """
      body:
        inbounds:
          - kri: kri_dp_default_numeric_kuma-system_service-less_http
            port: 12345
            protocol: http
            proxyResourceName: self_inbound_http
      """
    And the URL "/meshes/default/dataplanes/service-less/_inbounds/kri_dp_default_numeric_kuma-system_service-less_http/_policies" responds with
      """
      body:
        policies:
          - kind: MeshFaultInjection
            origins:
              - kri: kri_mfi_default_pigsty_jury_the-policy-name_appliance
      """
    And the URL "/meshes/default/dataplanes/service-less/_overview" responds with
      """
      body:
        dataplane:
          networking:
            inbound:
              - name: http
                port: 12345
                tags:
                  kuma.io/protocol: http
      """
    When I visit the "/meshes/default/data-planes/service-less/overview/inbound/self_inbound_http/overview" URL
    Then I click on the "$inbound-policies-rule ul:first-of-type li:first-of-type a:first-of-type" element
    Then the URL contains "/gui/meshes/default/policies/meshfaultinjections/kri_mfi_default_pigsty_jury_the-policy-name_appliance/overview/overview"
