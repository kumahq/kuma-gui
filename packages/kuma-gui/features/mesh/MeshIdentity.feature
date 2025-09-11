Feature: mesh / mesh-identity

  Background:
    Given the CSS selectors
      | Alias     | Selector                           |
      | mesh-mtls | [data-testid="mesh-mtls"]          |
      | summary   | [data-testid="slideout-container"] |
    And the environment
      """
      KUMA_MTLS_ENABLED: false
      KUMA_MESHIDENTITY_COUNT: 1
      """

  Scenario: MeshIdentities are listed in mesh about section
    Given the URL "/meshes/default/meshidentities" responds with
      """
      body:
        items:
          - name: identity-1
      """
    When I visit the "/meshes/default" URL
    Then the "$mesh-mtls" element exists
    And the "$mesh-mtls" element contains "MeshIdentity / identity-1"

  Scenario: Clicking on mesh identity opens summary view
    Given the URL "/meshes/default/meshidentities" responds with
      """
      body:
        items:
          - name: identity-1
            mesh: default
      """
    When I visit the "/meshes/default" URL
    Then I click the "$mesh-mtls a:first" element
    Then the URL contains "/meshes/default/overview/meshidentity/kri_mid_default___identity-1_"
    And the "$summary" element exists
    And the "$summary" element contains "identity-1"
    And the "$summary [data-testid='k-code-block']" element exists
    And the "$summary [data-testid='k-code-block']" element contains "type: MeshIdentity"
    And the "$summary [data-testid='k-code-block']" element contains "mesh: default"
    And the "$summary [data-testid='k-code-block']" element contains "name: identity-1"
