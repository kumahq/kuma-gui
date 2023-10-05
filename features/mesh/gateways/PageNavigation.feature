Feature: Gateways: Page navigation
  Scenario Outline: Tabs have expected URLs

    When I visit the "/meshes/default/gateways/firewal-gateway-1/overview" URL

    When I click the "[data-testid='<RouteName>-tab']" element
    And the URL contains "<Path>"
    Then the page title contains "<Title>"

    Examples:
      | RouteName               | Path                                   | Title             |
      | gateway-detail-view     | /gateways/firewal-gateway-1/overview   | firewal-gateway-1 |
      | gateway-policies-view   | /gateways/firewal-gateway-1/policies   | Policies          |
      | gateway-xds-config-view | /gateways/firewal-gateway-1/xds-config | XDS Configuration |
      | gateway-stats-view      | /gateways/firewal-gateway-1/stats      | Stats             |
      | gateway-clusters-view   | /gateways/firewal-gateway-1/clusters   | Clusters          |
