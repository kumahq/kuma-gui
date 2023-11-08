Feature: application / ListViewNavigation
  Background:
    Given the CSS selectors
      | Alias       | Selector                                                                  |
      | detail-link | [data-testid$='-collection'] tr:nth-child(1) [data-testid='details-link'] |
    And the environment
      """
      KUMA_MODE: global
      KUMA_ZONE_NAME: bandwidth-0
      """

  Scenario Outline: The <URL> list view has correct detail view link
    When I visit the "<URL>" URL
    And I click the "$detail-link" element

    Then the "<DetailViewSelector>" element exists

    Examples:
      | URL                          | DetailViewSelector                       |
      | /zones                       | [data-testid='zone-cp-detail-view']      |
      | /zones/bandwidth-0/egresses  | [data-testid='zone-egress-detail-view']  |
      | /zones/bandwidth-0/ingresses | [data-testid='zone-ingress-detail-view'] |
      | /meshes                      | [data-testid='mesh-detail-view']         |
      | /meshes/default/data-planes  | [data-testid='data-plane-detail-view']   |
      | /meshes/default/services     | [data-testid='service-detail-view']      |
      | /meshes/default/policies     | [data-testid='policy-detail-view']       |
