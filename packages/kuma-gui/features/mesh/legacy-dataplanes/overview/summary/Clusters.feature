Feature: mesh / dataplanes / connections / clusters

  Background:
    Given the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: false
      """
    And the URL "/_kri/kri_dp_mesh-name_zone-1_namespace_service-64cbb7b8b5-6g94n_" responds with
      """
      body:
        name: service-64cbb7b8b5-6g94n.namespace
        kri: kri_dp_mesh-name_zone-1_namespace_service-64cbb7b8b5-6g94n_
        labels:
          kuma.io/display-name: service-64cbb7b8b5-6g94n
      """

  Scenario: The inbound clusters tab correctly filters by 'localhost_<port>'
    Given the CSS selectors
      | Alias | Selector                                                                                         |
      | code  | [data-testid='data-plane-connection-inbound-summary-clusters-view'] [data-testid='k-code-block'] |
    And the URL "/meshes/mesh-name/dataplanes/service-64cbb7b8b5-6g94n.namespace/_overview" responds with
      """
      body:
        kri: kri_dp_mesh-name_zone-1_namespace_service-64cbb7b8b5-6g94n_
        dataplane:
          networking:
            inbound:
            - port: 9090
              servicePort: !!js/undefined
      """
    And the URL "/meshes/mesh-name/dataplanes/service-64cbb7b8b5-6g94n.namespace/clusters" responds with
      """
      body: |
        localhost:9090::observability_name::localhost_9090
        localhost:9090::default_priority::max_connections::1024
        not_localhost:9090::priority::connections::1024
        localhost:1111::default_priority::max_connections::1025
        inbound:passthrough:ipv4::added_via_api::true
      """
    When I visit the "/meshes/mesh-name/data-planes/kri_dp_mesh-name_zone-1_namespace_service-64cbb7b8b5-6g94n_/overview/inbound/localhost_9090/clusters" URL
    And the "$code" element contains "observability_name::localhost_9090"
    And the "$code" element contains "default_priority::max_connections::1024"
    And the "$code" element doesn't contain "priority::connections::1024"
    And the "$code" element doesn't contain "default_priority::max_connections::1025"
    And the "$code" element doesn't contain "added_via_api::true"

  Scenario: The inbound clusters tab correctly filters by 'localhost_<servicePort>'
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
              servicePort: 9091
      """
    And the URL "/meshes/mesh-name/dataplanes/service-64cbb7b8b5-6g94n.namespace/clusters" responds with
      """
      body: |
        localhost:9091::observability_name::localhost_9091
        localhost:9091::default_priority::max_connections::1024
        not_localhost:9091::priority::connections::1024
        localhost:1111::default_priority::max_connections::1025
        inbound:passthrough:ipv4::added_via_api::true
      """
    When I visit the "/meshes/mesh-name/data-planes/kri_dp_mesh-name_zone-1_namespace_service-64cbb7b8b5-6g94n_/overview/inbound/localhost_9090/clusters" URL
    And the "$code" element contains "observability_name::localhost_9091"
    And the "$code" element contains "default_priority::max_connections::1024"
    And the "$code" element doesn't contain "priority::connections::1024"
    And the "$code" element doesn't contain "default_priority::max_connections::1025"
    And the "$code" element doesn't contain "added_via_api::true"

  Scenario: The outbound clusters tab correctly filters by '<clusterName>'
    Given the CSS selectors
      | Alias | Selector                                                                                          |
      | code  | [data-testid='data-plane-connection-outbound-summary-clusters-view'] [data-testid='k-code-block'] |
    And the URL "/meshes/mesh-name/dataplanes/service-64cbb7b8b5-6g94n.namespace/stats" responds with
      """
      body: |
        cluster.mesh-name_service_namespace_default_msvc_9090.assignment_stale: 0
      """
    And the URL "/meshes/mesh-name/dataplanes/service-64cbb7b8b5-6g94n.namespace/clusters" responds with
      """
      body: |
        mesh-name_service_namespace_default_msvc_9090::observability_name::mesh-name_service_namespace_default_msvc_9090
        mesh-name_service_namespace_default_msvc_9090::default_priority::max_connections::1024
        not_mesh-name_service_namespace_default_msvc_9090::priority::connections::1024
        localhost:1111::default_priority::max_connections::1025
        inbound:passthrough:ipv4::added_via_api::true
      """
    When I visit the "/meshes/mesh-name/data-planes/kri_dp_mesh-name_zone-1_namespace_service-64cbb7b8b5-6g94n_/overview/outbound/mesh-name_service_namespace_default_msvc_9090/clusters" URL
    And the "$code" element contains "observability_name::mesh-name_service_namespace_default_msvc_9090"
    And the "$code" element contains "default_priority::max_connections::1024"
    And the "$code" element doesn't contain "priority::connections::1024"
    And the "$code" element doesn't contain "default_priority::max_connections::1025"
    And the "$code" element doesn't contain "added_via_api::true"
