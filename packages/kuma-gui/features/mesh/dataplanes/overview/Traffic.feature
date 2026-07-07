Feature: mesh / dataplanes / connections / Traffic

  Background:
    Given the CSS selectors
      | Alias           | Selector                                                                   |
      | traffic         | [data-testid='dataplane-traffic']                                          |
      | inbound         | [data-testid='dataplane-inbound']                                          |
      | outbound        | [data-testid='dataplane-outbound']                                         |
      | warning         | [data-testid*='abnormal-traffic-stats']                                    |
      | loading-warning | [data-testid^='notification-data-planes.notifications.stats-not-enhanced'] |
      | about-section   | [data-testid='dataplane-about-section']                                    |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      KUMA_MESHSERVICE_MODE: Exclusive
      KUMA_DATAPLANEINBOUND_COUNT: 1
      KUMA_DATAPLANELISTENER_COUNT: 1
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
    And the URL "/_kri/kri_dp_default_zone-1_kuma-demo_service-less_" responds with
      """
      body:
        name: service-less.kuma-demo
        kri: kri_dp_default_zone-1_kuma-demo_service-less_
        labels:
          kuma.io/display-name: service-less
      """
    And the URL "/_kri/kri_dp_default_zone-1_kuma-demo_dpp-1-name-of-dataplane_" responds with
      """
      body:
        name: dpp-1-name-of-dataplane.kuma-demo
        kri: kri_dp_default_zone-1_kuma-demo_dpp-1-name-of-dataplane_
        labels:
          kuma.io/display-name: dpp-1-name-of-dataplane
      """

  Scenario: Traffic listing shows expected content
    And the URL "/meshes/default/dataplanes/service-less.kuma-demo/_layout" responds with
      """
      body:
        listeners:
          - kri: kri_dp_default_numeric_kuma-demo_service-less_12345
            port: 12323
            proxyResourceName: self_zoneingress_dp_12345
            type: ZoneIngress
        inbounds:
          - kri: kri_dp_default_numeric_kuma-demo_service-less_httpport
            port: 12345
            protocol: http
            proxyResourceName: self_inbound_httpport
        outbounds:
          - kri: kri_msvc_default_scenario_kuma-demo_service-less_ipv6
            port: 54321
            protocol: tcp
            proxyResourceName: kri_msvc_default_scenario_kuma-demo_service-less_ipv6
      """
    When I visit the "/meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_service-less_/overview" URL
    Then the "$traffic" element exists
    # inbounds and listeners
    And the "$inbound" element exists 2 times
    And the "$inbound:nth-child(1)" element contains "12345"
    And the "$inbound:nth-child(1)" element contains "HTTP"
    And the "$inbound:nth-child(2)" element contains "12323"
    And the "$inbound:nth-child(2)" element contains "TCP"
    And the "$inbound:nth-child(2)" element contains "ZoneIngress"
    # outbounds
    And the "$outbound" element exists 1 times
    And the "$outbound:nth-child(1)" element contains "Port 54321 (ipv6)"
    And the "$outbound:nth-child(1)" element contains "Mesh default"
    And the "$outbound:nth-child(1)" element contains "Zone scenario"
    And the "$outbound:nth-child(1)" element contains "Namespace kuma-demo"
    And the "$outbound:nth-child(1)" element contains "Type MeshService"
    And the "$outbound:nth-child(1)" element contains "service-less"

  Scenario: Standard sidecar proxy shows the traffic component and an error warning when _stats fails
    Given the environment
      """
      KUMA_DATAPLANEINBOUND_COUNT: 1
      KUMA_SUBSCRIPTION_COUNT: 1
      """
    And the URL "/meshes/default/dataplanes/dpp-1-name-of-dataplane.kuma-demo/_overview" responds with
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
    And the URL "/meshes/default/dataplanes/dpp-1-name-of-dataplane.kuma-demo/stats" responds with
      """
      headers:
        Status-Code: '504'
      body: upstream request timeout
      """
    When I visit the "/meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_dpp-1-name-of-dataplane_/overview" URL
    And the "$traffic" element exists
    And the "$loading-warning" element exists
    And the "$about-section" element contains "58.25.181.133"

  Scenario: Abnormal traffic stats are detected
    Given the URL "/meshes/default/dataplanes/service-less.kuma-demo/_layout" responds with
      """
      body:
        inbounds:
          - kri: kri_dp_default_abnormal-traffic_kuma-demo_service-less_httpport
            port: 12345
            protocol: http
            proxyResourceName: self_inbound_httpport
        outbounds:
          - kri: kri_msvc_default_abnormal-traffic_kuma-demo_service-less_ipv6
            port: 54321
            protocol: tcp
            proxyResourceName: kri_msvc_default_abnormal-traffic_kuma-demo_service-less_ipv6
      """
    And the URL "/meshes/default/dataplanes/service-less.kuma-demo/stats" responds with
      """
      body: |
        cluster.kri_msvc_default_abnormal-traffic_kuma-demo_service-less_ipv6.circuit_breakers.default.cx_open: 5
      """
    When I visit the "/meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_service-less_/overview" URL
    Then the "$traffic" element exists
    And the "$warning" element exists

  Scenario: Listener traffic shows expected content
    Given the environment
      """
      KUMA_DATAPLANEINBOUND_COUNT: 0
      KUMA_DATAPLANELISTENER_COUNT: 2
      """
    And the URL "/meshes/default/dataplanes/service-less.kuma-demo/_layout" responds with
      """
      body:
        listeners:
          - kri: kri_dp_default_numeric_kuma-demo_service-less_12345
            port: 12345
            proxyResourceName: self_zoneingress_dp_12345
            type: ZoneIngress
          - kri: kri_dp_default_numeric_kuma-demo_service-less_54321
            port: 54321
            proxyResourceName: self_zoneegress_dp_54321
            type: ZoneEgress
      """
    And the URL "/meshes/default/dataplanes/service-less.kuma-demo/_overview" responds with
      """
      body:
        dataplane:
          networking:
            listeners:
              - port: 12345
                type: ZoneIngress
                address: 10.244.0.21
                name: "12345"
              - port: 54321
                type: ZoneEgress
                address: 10.244.0.21
                name: "54321"
      """
    And the URL "/meshes/default/dataplanes/service-less.kuma-demo/stats" responds with
      """
      body: |
        listener.self_zoneingress_dp_12345.downstream_cx_active: 10
        listener.self_zoneingress_dp_12345.downstream_cx_destroy: 0
        listener.self_zoneingress_dp_12345.downstream_cx_overflow: 0
        listener.self_zoneingress_dp_12345.downstream_cx_overload_reject: 0
        listener.self_zoneingress_dp_12345.downstream_cx_total: 20
        listener.self_zoneegress_dp_54321.downstream_cx_active: 5
        listener.self_zoneegress_dp_54321.downstream_cx_destroy: 0
        listener.self_zoneegress_dp_54321.downstream_cx_overflow: 0
        listener.self_zoneegress_dp_54321.downstream_cx_overload_reject: 0
        listener.self_zoneegress_dp_54321.downstream_cx_total: 10
      """
    When I visit the "/meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_service-less_/overview" URL
    Then the "$traffic" element exists
    And the "$inbound" element exists 2 times
    And the "$inbound:nth-child(1)" element contains
      | Value                 |
      | TCP                   |
      | ZoneIngress           |
      | :12345                |
      | Total connections 20  |
      | Active connections 10 |
    And the "$inbound:nth-child(2)" element contains
      | Value                |
      | ZoneEgress           |
      | :54321               |
      | Total connections 10 |
      | Active connections 5 |
