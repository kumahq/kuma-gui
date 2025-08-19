Feature: mesh / dataplanes / connections / clusters

  Background:
    Given the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      """

  Scenario: The inbound clusters tab correctly filters by contextual KRI
    Given the CSS selectors
      | Alias | Selector                                                                                         |
      | code  | [data-testid='data-plane-connection-inbound-summary-clusters-view'] [data-testid='k-code-block'] |
    And the URL "/meshes/mesh-name/dataplanes/service-64cbb7b8b5-6g94n.namespace/_overview" responds with
      """
      body:
        dataplane:
          networking:
            inbound:
            - port: 9090
              servicePort: !!js/undefined
      """
    And the URL "/meshes/mesh-name/dataplanes/service-64cbb7b8b5-6g94n.namespace/_layout" responds with
      """
      body:
        inbounds:
          - port: 9090
            kri: kri_dp_default_default_namespace_service-64cbb7b8b5-6g94n.namespace_http
            protocol: http
            proxyResourceName: self_inbound_dp_http
      """
    And the URL "/meshes/mesh-name/dataplanes/service-64cbb7b8b5-6g94n.namespace/clusters" responds with
      """
      body: |
        self_inbound_dp_9090::observability_name::self_inbound_dp_9090
        self_inbound_dp_9090::default_priority::max_connections::1024
        inbound:passthrough:ipv6::priority::connections::1024
        system_envoy_admin::default_priority::max_connections::1025
        kri_msvc_default_default_kuma-demo_demo-app-v2_5050:ipv4::added_via_api::true
      """
    When I visit the "/meshes/mesh-name/data-planes/service-64cbb7b8b5-6g94n.namespace/overview/inbound/self_inbound_dp_http/clusters" URL
    And the "$code" element contains "observability_name::self_inbound_dp_9090"
    And the "$code" element contains "default_priority::max_connections::1024"
    And the "$code" element doesn't contain "priority::connections::1024"
    And the "$code" element doesn't contain "default_priority::max_connections::1025"
    And the "$code" element doesn't contain "added_via_api::true"

  Scenario: The outbound clusters tab correctly filters by full KRI
    Given the CSS selectors
      | Alias | Selector                                                                                          |
      | code  | [data-testid='data-plane-connection-outbound-summary-clusters-view'] [data-testid='k-code-block'] |
    And the URL "/meshes/mesh-name/dataplanes/service-64cbb7b8b5-6g94n.kuma-demo/stats" responds with
      """
      body: |
        cluster.kri_msvc_default_default_kuma-demo_demo-app_5050.assignment_stale: 0
      """
    And the URL "/meshes/mesh-name/dataplanes/service-64cbb7b8b5-6g94n.kuma-demo/_layout" responds with
      """
      body:
        outbounds:
          - port: 5050
            kri: kri_msvc_default_default_kuma-demo_demo-app_5050
            protocol: http
            proxyResourceName: kri_msvc_default_default_kuma-demo_demo-app_5050
      """
    And the URL "/meshes/mesh-name/dataplanes/service-64cbb7b8b5-6g94n.kuma-demo/clusters" responds with
      """
      body: |
        kri_msvc_default_default_kuma-demo_demo-app_5050::observability_name::kri_msvc_default_default_kuma-demo_demo-app_5050
        kri_msvc_default_default_kuma-demo_demo-app_5050::default_priority::max_connections::1024
        kri_msvc_default_default_kuma-demo_demo-app-v1_5050::priority::connections::1024
        localhost:1111::default_priority::max_connections::1025
        inbound:passthrough:ipv4::added_via_api::true
      """
    When I visit the "/meshes/mesh-name/data-planes/service-64cbb7b8b5-6g94n.kuma-demo/overview/outbound/kri_msvc_default_default_kuma-demo_demo-app_5050/clusters" URL
    And the "$code" element contains "observability_name::kri_msvc_default_default_kuma-demo_demo-app_5050"
    And the "$code" element contains "default_priority::max_connections::1024"
    And the "$code" element doesn't contain "priority::connections::1024"
    And the "$code" element doesn't contain "default_priority::max_connections::1025"
    And the "$code" element doesn't contain "added_via_api::true"
