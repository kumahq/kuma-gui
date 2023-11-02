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
      # TODO: Fix this view having the wrong route data-testid. It’s caused by us re-using the DPP-specific view components in gateway routes.
      # | /meshes/default/gateways     | [data-testid='gateway-detail-view']      |
      | /meshes/default/data-planes  | [data-testid='data-plane-detail-view']   |
      | /meshes/default/services     | [data-testid='service-detail-view']      |
      | /meshes/default/policies     | [data-testid='policy-detail-view']       |

  # TODO: Remove this scenario once it can be handled by the previous one.
  Scenario: The /meshes/default/gateways list view has correct detail view link
    When I visit the "/meshes/default/gateways" URL
    And I click the "$detail-link" element

    Then the URL contains "/meshes/default/gateways"
    And the URL contains "/overview"
