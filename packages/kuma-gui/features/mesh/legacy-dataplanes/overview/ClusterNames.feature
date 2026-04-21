Feature: mesh / dataplanes / connections / clusterNames

  Background:
    Given the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: false
      """
    And the URL "/_kri/kri_dp_mesh-name_zone-1_kuma-demo_edge-gateway-546b7bbbc9-mkhx6_" responds with
      """
      body:
        name: edge-gateway-546b7bbbc9-mkhx6.kuma-demo
        kri: kri_dp_mesh-name_zone-1_kuma-demo_edge-gateway-546b7bbbc9-mkhx6_
        labels:
          kuma.io/display-name: edge-gateway-546b7bbbc9-mkhx6
      """

  Scenario: MeshServices type clusterNames with hashes are matched correctly
    Given the CSS selectors
      | Alias    | Selector                           |
      | outbound | [data-testid='dataplane-outbound'] |
    And the URL "/meshes/mesh-name/dataplanes/edge-gateway-546b7bbbc9-mkhx6.kuma-demo/stats" responds with
      """
      body: |
        cluster.default_demo-app_kuma-demo_default_msvc_5000-5d788f7a87b92639.upstream_rq_tx_reset: 0
      """
    When I visit the "/meshes/mesh-name/data-planes/kri_dp_mesh-name_zone-1_kuma-demo_edge-gateway-546b7bbbc9-mkhx6_/overview?inactive" URL
    And the "$outbound" element contains "default_demo-app_kuma-demo_default_msvc_5000-5d788f7a87b92639"

  Scenario: MeshServices type clusterNames without hashes are matched correctly
    Given the CSS selectors
      | Alias    | Selector                           |
      | outbound | [data-testid='dataplane-outbound'] |
    And the URL "/meshes/mesh-name/dataplanes/edge-gateway-546b7bbbc9-mkhx6.kuma-demo/stats" responds with
      """
      body: |
        cluster.default_demo-app_kuma-demo_default_msvc_5000.upstream_rq_tx_reset: 0
      """
    When I visit the "/meshes/mesh-name/data-planes/kri_dp_mesh-name_zone-1_kuma-demo_edge-gateway-546b7bbbc9-mkhx6_/overview?inactive" URL
    And the "$outbound" element contains "default_demo-app_kuma-demo_default_msvc_5000"
