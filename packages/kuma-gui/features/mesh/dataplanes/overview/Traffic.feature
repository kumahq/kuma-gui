Feature: mesh / dataplanes / connections / Traffic

  Background:
    Given the CSS selectors
      | Alias    | Selector                                |
      | traffic  | [data-testid='dataplane-traffic']       |
      | inbound  | [data-testid='dataplane-inbound']       |
      | outbound | [data-testid='dataplane-outbound']      |
      | warning  | [data-testid*='abnormal-traffic-stats'] |
      | loading-warning | [data-testid^='notification-data-planes.notifications.stats-not-enhanced'] |
      | about-section   | [data-testid='dataplane-about-section']                                    |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      KUMA_MESHSERVICE_MODE: Exclusive
      KUMA_SERVICE_COUNT: 1
      KUMA_DATAPLANE_TYPE: standard
      """
    And the URL "/_resources" responds with
      """
      body:
        resources:
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
    # TODO: These need correcting so that the mock produces a single inbound
    # and outbound if that is what the intention of the test is
    # for the moment :nth-child(1) existing 1 time isn't testing anything
    # and previous to adding :nth-child(1) the element existed 13 times
    And the "$inbound:nth-child(1)" element exists 1 times
    And the "$outbound:nth-child(1)" element exists 1 times
    # end TODO
    And the "$inbound:nth-child(1)" element contains "12345"
    And the "$outbound:nth-child(1)" element contains "Port 54321 (ipv6)"
    And the "$outbound:nth-child(1)" element contains "Mesh default"
    And the "$outbound:nth-child(1)" element contains "Zone scenario"
    And the "$outbound:nth-child(1)" element contains "Namespace kuma-system"
    And the "$outbound:nth-child(1)" element contains "Type MeshService"
    And the "$outbound:nth-child(1)" element contains "service-less"

  Scenario: Standard sidecar proxy shows the traffic component and an error warning when _stats fails
    Given the environment
      """
      KUMA_DATAPLANEINBOUND_COUNT: 1
      KUMA_SUBSCRIPTION_COUNT: 1
      """
    And the URL "/meshes/default/dataplanes/dpp-1-name-of-dataplane/_overview" responds with
      """
      body:
        dataplane:
          networking:
            address: 58.25.181.133
            gateway: !!js/undefined
        dataplaneInsight:
          mTLS: !!js/undefined
          subscriptions:
            - version:
                kumaDp:
                  kumaCpCompatible: true
                envoy:
                  kumaDpCompatible: true
      """
    And the URL "/meshes/default/dataplanes/dpp-1-name-of-dataplane/stats" responds with
      """
      headers:
        Status-Code: '504'
      body: upstream request timeout
      """
    When I visit the "/meshes/default/data-planes/dpp-1-name-of-dataplane/overview" URL
    And the "$traffic" element exists
    And the "$loading-warning" element exists
    And the "$about-section" element contains "58.25.181.133"

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
