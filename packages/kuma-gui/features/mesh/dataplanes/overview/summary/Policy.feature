Feature: mesh / dataplanes / connections / Traffic

  Background:
    Given the CSS selectors
      | Alias             | Selector                                 |
      | summary-container | [data-testid='slideout-container']       |
      | about-dp-policies | [data-testid='about-dataplane-policies'] |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
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
    When I visit the "/meshes/default/data-planes/backend/overview/policy/meshtrafficpermission" URL
    Then the "$summary-container [data-testid='slideout-title']" element contains "MeshTrafficPermission"
    And the "$summary-container" element contains "kri_policy_mesh_zone_namespace_name_section"

  Scenario: Clicking on a policy opens the summary view
    Given the URL "/meshes/default/dataplanes/backend/_policies" responds with
      """
      body:
        policies:
          - kind: MeshTrafficPermission
            origins:
              - kri: kri_policy_mesh_zone_namespace_name_section
      """
    When I visit the "/meshes/default/data-planes/backend/overview" URL
    Then I click on the "$about-dp-policies a:first" element
    Then the URL contains "/meshes/default/data-planes/backend/overview/policy/meshtrafficpermission"
    And the "$summary-container" element exists
