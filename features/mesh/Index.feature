Feature: mesh / index
  Background:
    Given the CSS selectors
      | Alias           | Selector                      |
      | main-nav        | .app-sidebar                  |
      | mesh-selector   | [data-testid='mesh-selector'] |
      | mesh-breadcrumb | .k-breadcrumbs:nth-child(2)   |

  Scenario: Mesh Selection
    Given the environment
      """
      KUMA_MESH_COUNT: 2
      """
    And the URL "/meshes" responds with
      """
      body:
        items:
          - name: default
          - name: aalphabetically-second-because-of-default
      """
    And the URL "/mesh-insights/default" responds with
      """
      body:
        dataplanesByType:
          gateway:
            total: 1
      """
    And the URL "/mesh-insights/aalphabetically-second-because-of-default" responds with
      """
      body:
        dataplanesByType:
          gateway:
            total: 10
      """
    When I visit the "/" URL
    When I click the "$mesh-selector" element and select "aalphabetically-second-because-of-default"
    Then the "$mesh-breadcrumb" element contains "aalphabetically-second-because-of-default"
    When I click the "$mesh-selector" element and select "default"
    Then the "$mesh-breadcrumb" element contains "default"
