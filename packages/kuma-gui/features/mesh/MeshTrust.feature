Feature: mesh / mesh-identity

  Background:
    Given the CSS selectors
      | Alias              | Selector                            |
      | meshtrusts-listing | [data-testid="mesh-trusts-listing"] |
      | summary            | [data-testid="slideout-container"]  |

  Scenario: MeshIdentities are listed in mesh about section
    Given the URL "/meshes/default/meshtrusts" responds with
      """
      body:
        items:
          - name: trust-1
            spec:
              origin:
                kri: kri_mid_default_default_foo_bar_baz
      """
    When I visit the "/meshes/default" URL
    Then the "$meshtrusts-listing" element exists
    And the "$meshtrusts-listing" element contains "trust-1"
    And the "$meshtrusts-listing" element contains "kri_mid_default_default_foo_bar_baz"

  Scenario: Clicking on mesh trust item opens summary view
    Given the URL "/meshes/default/meshtrusts" responds with
      """
      body:
        items:
          - name: trust-1
            spec:
              origin:
                kri: kri_mid_default_default_foo_bar_baz
      """
    When I visit the "/meshes/default" URL
    Then I click the "$meshtrusts-listing a:first" element
    Then the URL contains "/meshes/default/overview/meshtrust/trust-1"
    And the "$summary" element exists
    And the "$summary" element contains "trust-1"
    And the "$summary [data-testid='k-code-block']" element exists
    And the "$summary [data-testid='k-code-block']" element contains "type: MeshTrust"
    And the "$summary [data-testid='k-code-block']" element contains "mesh: default"
    And the "$summary [data-testid='k-code-block']" element contains "name: trust-1"

  Scenario: Clicking on an origin opens the summary tray of mesh identity
    Given the URL "/meshes/default/meshtrusts" responds with
      """
      body:
        items:
          - name: trust-1
            spec:
              origin:
                kri: kri_mid_default_default_foo_bar_baz
      """
    And the URL "/meshes/default/meshidentities" responds with
      """
      body:
        items:
          - name: bar
      """
    When I visit the "/meshes/default" URL
    Then I click the "$meshtrusts-listing tbody tr:first-child td:nth-child(3) a" element
    Then the URL contains "/meshes/default/overview/meshidentity/bar"
    And the "$summary" element exists
    And the "$summary" element contains "bar"
    And the "$summary [data-testid='k-code-block']" element exists
    And the "$summary [data-testid='k-code-block']" element contains "type: MeshIdentity"
    And the "$summary [data-testid='k-code-block']" element contains "mesh: default"
    And the "$summary [data-testid='k-code-block']" element contains "name: bar"
