Feature: mesh / mesh-identity

  Background:
    Given the CSS selectors
      | Alias                     | Selector                                  |
      | meshidentities-collection | [data-testid="meshidentities-collection"] |
      | summary                   | [data-testid="slideout-container"]        |

  Scenario: MeshIdentities are listed in mesh about section
    Given the URL "/meshes/default/meshidentities" responds with
      """
      body:
        items:
          - name: identity-1
      """
    When I visit the "/meshes/default" URL
    Then the "$meshidentities-collection" element exists
    And the "$meshidentities-collection" element contains "identity-1"

  Scenario: Clicking on mesh identity opens summary view
    Given the URL "/meshes/default/meshidentities" responds with
      """
      body:
        items:
          - name: identity-1
      """
    When I visit the "/meshes/default" URL
    Then I click the "$meshidentities-collection a:first" element
    Then the URL contains "/meshes/default/overview/meshidentity/identity-1"
    And the "$summary" element exists
    And the "$summary" element contains "identity-1"
    And the "$summary [data-testid='k-code-block']" element exists
    And the "$summary [data-testid='k-code-block']" element contains "type: MeshIdentity"
    And the "$summary [data-testid='k-code-block']" element contains "mesh: default"
    And the "$summary [data-testid='k-code-block']" element contains "name: identity-1"
