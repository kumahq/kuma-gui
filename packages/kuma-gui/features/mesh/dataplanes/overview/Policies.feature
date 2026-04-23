Feature: mesh / dataplanes / connections / Traffic

  Background:
    Given the CSS selectors
      | Alias         | Selector                              |
      | about-section | [data-testid='about-section-content'] |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      KUMA_MESHSERVICE_MODE: Exclusive
      """
    And the URL "/_kri/kri_dp_default_zone-1_kuma-demo_backend_" responds with
      """
      body:
        name: backend
        kri: kri_dp_default_zone-1_kuma-demo_backend_
        labels:
          kuma.io/display-name: backend
      """

  Scenario Outline: The dataplane about section contains expected content
    Given the URL "/meshes/default/dataplanes/backend/_policies" responds with
      """
      body:
        policies:
          - kind: MeshTrafficPermission
            origins:
              - kri: kri_policy_mesh_zone_namespace_name_section
      """
    When I visit the "/meshes/default/data-planes/<Name>/overview" URL
    Then the "$about-section" element contains "MeshTrafficPermission"

    Examples:
      | Name                                     |
      | backend                                  |
      | kri_dp_default_zone-1_kuma-demo_backend_ |
