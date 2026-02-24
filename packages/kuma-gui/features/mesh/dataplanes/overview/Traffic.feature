Feature: mesh / dataplanes / connections / Traffic

  Background:
    Given the CSS selectors
      | Alias    | Selector                                |
      | traffic  | [data-testid='dataplane-traffic']       |
      | inbound  | [data-testid='dataplane-inbound']       |
      | outbound | [data-testid='dataplane-outbound']      |
      | warning  | [data-testid*='abnormal-traffic-stats'] |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      KUMA_MESHSERVICE_MODE: Exclusive
      KUMA_DATAPLANEINBOUND_COUNT: 1
      KUMA_SERVICE_COUNT: 1
      KUMA_DATAPLANE_TYPE: standard
      """
    And the URL "/_resources" responds with
      """
      body:
        resources:
          - name: Mesh
            shortName: ,
          - name: MeshService
            shortName: msvc
          - name: MeshExternalService
            shortName: extsvc
          - name: MeshMultiZoneService
            shortName: mzsvc
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
          - kri: kri_msvc_default_scenario_kuma-system_service-less_ipv6
            port: 54321
            protocol: tcp
            proxyResourceName: kri_msvc_default_scenario_kuma-system_service-less_ipv6
      """
    When I visit the "/meshes/default/data-planes/service-less/overview" URL
    Then the "$traffic" element exists
    And the "$inbound" element exists 1 times
    And the "$inbound" element contains "12345"
    And the "$outbound" element exists 1 times
    And the "$outbound" element contains "Port 54321 (ipv6)"
    And the "$outbound" element contains "Mesh default"
    And the "$outbound" element contains "Zone scenario"
    And the "$outbound" element contains "Namespace kuma-system"
    And the "$outbound" element contains "service-less"
    And the "$outbound" element contains "Type MeshService"

  Scenario: Abnormal traffic stats are detected
    Given the URL "/meshes/default/dataplanes/service-less/_layout" responds with
      """
      body:
        inbounds:
          - kri: kri_dp_default_abnormal-traffic_kuma-system_service-less_httpport
            port: 12345
            protocol: http
            proxyResourceName: self_inbound_httpport
        outbounds:
          - kri: kri_msvc_default_abnormal-traffic_kuma-system_service-less_ipv6
            port: 54321
            protocol: tcp
            proxyResourceName: kri_msvc_default_abnormal-traffic_kuma-system_service-less_ipv6
      """
    And the URL "/meshes/default/dataplanes/service-less/stats" responds with
      """
      body: |
        cluster.kri_msvc_default_abnormal-traffic_kuma-system_service-less_ipv6.circuit_breakers.default.cx_open: 5
      """
    When I visit the "/meshes/default/data-planes/service-less/overview" URL
    Then the "$traffic" element exists
    And the "$warning" element exists
