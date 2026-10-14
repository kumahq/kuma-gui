Feature: mesh / mesh-identity

  Background:
    Given the CSS selectors
      | Alias         | Selector                                  |
      | mesh-mtls     | [data-testid="mesh-mtls"]                 |
      | summary       | [data-testid="slideout-container"]        |
      | summary-title | $summary [data-testid='slideout-title']   |
      | detail-view   | [data-testid='mesh-resource-detail-view'] |
    And the environment
      """
      KUMA_MTLS_ENABLED: false
      KUMA_MESHIDENTITY_COUNT: 1
      """
    And the URL "/meshes/default/meshidentities" responds with
      """
      body:
        items:
          - name: identity-1
            mesh: default
            kri: kri_mid_default___identity-1_
            labels:
              kuma.io/display-name: identity-1
      """

  Scenario: MeshIdentities are listed in mesh about section
    When I visit the "/meshes/default" URL
    Then the "$mesh-mtls" element exists
    And the "$mesh-mtls" element contains "MeshIdentity / identity-1"

  Scenario: Clicking on mesh identity opens summary view
    And the URL "/mesh-insight/default" responds with
      """
      body:
        mTLS:
          issuedBackends:
            identity-1:
              total: 1
              online: 1
      """
    When I visit the "/meshes/default" URL
    Then I click the "$mesh-mtls a:first-child" element
    Then the URL contains "/meshes/default/overview/meshidentity/kri_mid_default___identity-1_"
    And the "$summary" element exists
    And the "$summary-title" element contains "identity-1"
    And the "$summary [data-testid='k-code-block']" element exists
    And the "$summary [data-testid='k-code-block']" element contains "type: MeshIdentity"
    And the "$summary [data-testid='k-code-block']" element contains "mesh: default"
    And the "$summary [data-testid='k-code-block']" element contains "name: identity-1"

  Scenario: Navigating to resource detail page
    When I visit the "/meshes/default" URL
    Then I click the "$mesh-mtls a:first-child" element
    Then I click the "$summary-title a" element
    Then the "$detail-view" element contains "identity-1"
