Feature: application / titles

  Scenario Outline: Visiting "<URL>" page in "global" Mode
    Given the environment
      """
      KUMA_LEGACY_SERVICES_ENABLED: true
      KUMA_MODE: global
      """
    When I visit the "<URL>" URL
    Then the page title contains "<Title>"

    Examples:
      | URL                                                     | Title            |
      | /meshes/default/services/internal                       | Services         |
      | /meshes/default/services/internal/service-name/overview | service-name     |
      | /meshes/default/services/external                       | ExternalServices |
      | /meshes/default/services/external/service-name/overview | service-name     |
