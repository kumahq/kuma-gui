Feature: application / ListViewNavigation

  Background:
    Given the CSS selectors
      | Alias       | Selector                                                   |
      | detail-link | [data-testid$='-collection'] tr:nth-child(1) [data-action] |
    And the environment
      """
      KUMA_LEGACY_SERVICES_ENABLED: true
      KUMA_MODE: global
      KUMA_ZONE_NAME: bandwidth-0
      """

  Scenario Outline: The <URL> list view has correct detail view link
    When I visit the "<URL>" URL
    And I click the "$detail-link" element
    Then the "<DetailViewSelector>" element exists

    Examples:
      | URL                               | DetailViewSelector                  |
      | /meshes/default/services/internal | [data-testid='service-detail-view'] |
