Feature: application / ListViewNavigation
  Background:
    Given the CSS selectors
      | Alias       | Selector                                                                  |
      | main-nav    | .app-sidebar                                                              |
      | breadcrumbs | .k-breadcrumbs                                                            |
      | detail-link | [data-testid$='-collection'] tr:nth-child(1) [data-testid='details-link'] |
    And the environment
      """
      KUMA_MODE: global
      KUMA_ZONE_NAME: bandwidth-0
      """

  Scenario Outline: The <BreadcrumbTitle> list view has correct detail view link
    When I visit the "<URL>" URL
    And I click the "$detail-link" element

    Then the "$breadcrumbs" element contains "<BreadcrumbTitle>"

    Examples:
      | URL                          | BreadcrumbTitle     |
      | /zones                       | Zone Control Planes |
      | /zones/bandwidth-0/egresses  | Egresses            |
      | /zones/bandwidth-0/ingresses | Ingresses           |
      | /meshes                      | Meshes              |
      | /meshes/default/gateways     | Gateways            |
      | /meshes/default/data-planes  | Data Plane Proxies  |
      | /meshes/default/services     | Services            |
      | /meshes/default/policies     | Policies            |
