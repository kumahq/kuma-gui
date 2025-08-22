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

  Scenario: The dataplane about section contains expected content
    Given the URL "/meshes/default/dataplanes/backend/_policies" responds with
      """
      body:
        policies:
          - kind: MeshTrafficPermission
            origins:
              - kri: kri_policy_mesh_zone_namespace_name_section
      """
    When I visit the "/meshes/default/data-planes/backend/overview" URL
    Then the "$about-section" element contains "MeshTrafficPermission"
