Feature: mesh / index

  Background:
    Given the CSS selectors
      | Alias          | Selector                                     |
      | items          | [data-testid='mesh-collection']              |
      | item           | $items tbody tr                              |
      | breadcrumbs    | .k-breadcrumbs                               |
      | button-refresh | [data-testid='data-overview-refresh-button'] |
      | navigation     | [data-testid='mesh-tabs'] ul >               |
      | input-search   | [data-testid='filter-bar-filter-input']      |
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
    When I click the "<Selector> [data-testid='x-action-group-control']" element
    And I click the "<Selector> [data-testid='x-action-group'] li:nth-child(1) [data-testid='x-action']" element
    Then the URL contains "/meshes/<Mesh>"
    And the "$breadcrumbs" element contains "Meshes"
    Then I click the "$navigation li:nth-child(2) a" element
    Then I click the "$navigation li:nth-child(3) a" element
    Then I click the "$navigation li:nth-child(4) a" element
    Then I click the "$navigation li:nth-child(1) a" element
    And I click the "$breadcrumbs > .breadcrumbs-item-container:nth-child(1) > a" element
    Then the "$item" element exists 2 times

    Examples:
      | Mesh         | Selector           |
      | another-mesh | $item:nth-child(2) |
      | default      | $item:nth-child(1) |

  Scenario: Sending filters
    Then the "$input-search" element exists
    And I "type" "foo kuma.io/service-name:bar" into the "$input-search" element
    And I "type" "{enter}" into the "$input-search" element
    Then the URL "/mesh-insights" was requested with
      """
      searchParams:
        name: foo
        offset: 0
        size: 50
      """
