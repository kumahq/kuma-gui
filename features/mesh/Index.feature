Feature: mesh / index
  Background:
    Given the CSS selectors
      | Alias          | Selector                                     |
      | items          | [data-testid='mesh-collection']              |
      | item           | $items tbody tr                              |
      | breadcrumbs    | .k-breadcrumbs                               |
      | button-refresh | [data-testid='data-overview-refresh-button'] |
      | navigation     | .route-mesh-view-tabs ul >                   |

    Given the environment
      """
      KUMA_MESH_COUNT: 2
      """
    And the URL "/mesh-insights" responds with
      """
      body:
        items:
          - name: default
          - name: another-mesh
      """
    When I visit the "/meshes" URL

  Scenario: Clicking a mesh and back again for <Mesh>
    Then the "$item" element exists 2 times
    Then I click the "<Selector>" element
    Then the URL contains "/meshes/<Mesh>"
    And the "$breadcrumbs" element contains "Meshes"

    Then I click the "$navigation li:nth-child(2) a" element
    Then I click the "$navigation li:nth-child(3) a" element
    Then I click the "$navigation li:nth-child(4) a" element
    Then I click the "$navigation li:nth-child(5) a" element
    Then I click the "$navigation li:nth-child(1) a" element

    And I click the "$breadcrumbs > .k-breadcrumbs-item:nth-child(1) > a" element
    Then the "$item" element exists 2 times

    Examples:
      | Mesh         | Selector                              |
      | another-mesh | $item:nth-child(2) td:first-of-type a |
      | default      | $item:nth-child(1) td:first-of-type a |
