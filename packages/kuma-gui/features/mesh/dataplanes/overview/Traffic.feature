Feature: mesh / dataplanes / connections / Traffic

  Background:
    Given the CSS selectors
      | Alias    | Selector                           |
      | traffic  | [data-testid='dataplane-traffic']  |
      | inbound  | [data-testid='dataplane-inbound']  |
      | outbound | [data-testid='dataplane-outbound'] |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      KUMA_MESHSERVICE_MODE: Exclusive
      KUMA_DATAPLANEINBOUND_COUNT: 1
      KUMA_DATAPLANEOUTBOUND_COUNT: 1
      KUMA_DATAPLANE_TYPE: standard
      """

  Scenario: Traffic listing shows expected content
    And the URL "/meshes/default/dataplanes/service-less/_layout" responds with
      """
      body:
        inbounds:
          - kri: kri_dp_default_numeric_kuma-system_service-less_httpport
            port: 12345
            protocol: http
            proxyResourceName: self_inbound_httpport
        outbounds:
          - kri: kri_dp_default_scenario_kuma-system_service-less_ipv6
            port: 54321
            protocol: tcp
            proxyResourceName: kri_dp_default_scenario_kuma-system_service-less_ipv6
      """
    When I visit the "/meshes/default/data-planes/service-less/overview" URL
    And the "$traffic" element exists
    And the "$inbound" element exists 1 times
    And the "$inbound" element contains "httpport"
    And the "$inbound" element contains "self_inbound_httpport"
    And the "$outbound" element exists 1 times
    And the "$outbound" element contains "ipv6"
    And the "$outbound" element contains "kri_dp_default_scenario_kuma-system_service-less_ipv6"
