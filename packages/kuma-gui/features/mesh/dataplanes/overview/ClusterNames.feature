Feature: mesh / dataplanes / connections / clusterNames
  Scenario: MeshServices type clusterNames with hashes are matched correctly
    Given the CSS selectors
      | Alias    | Selector                           |
      | outbound | [data-testid='dataplane-outbound'] |
    And the URL "/meshes/mesh-name/dataplanes/edge-gateway-546b7bbbc9-mkhx6.kuma-demo/stats" responds with
      """
      body: |
        cluster.default_demo-app_kuma-demo_default_msvc_5000-5d788f7a87b92639.upstream_rq_tx_reset: 0
      """
    When I visit the "/meshes/mesh-name/data-planes/edge-gateway-546b7bbbc9-mkhx6.kuma-demo/overview?inactive" URL
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
    When I visit the "/meshes/mesh-name/data-planes/edge-gateway-546b7bbbc9-mkhx6.kuma-demo/overview?inactive" URL
    And the "$outbound" element contains "default_demo-app_kuma-demo_default_msvc_5000"

