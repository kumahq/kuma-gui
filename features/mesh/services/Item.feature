Feature: mesh / services / item
  Background:
    Given the CSS selectors
      | Alias               | Selector                                     |
      | items               | [data-testid='data-overview-table']          |
    And the environment
    """
      KUMA_SERVICEINSIGHT_COUNT: 2
    """
  Scenario: External services don't display the dataplane list
    And the URL "/meshes/default/service-insights/firewall-1" responds with
      """
      body:
        serviceType: "external"
      """
    When I visit the "/mesh/default/service/firewall-1" URL
    And the "$items" element doesn't exist
  @only
  Scenario: External services don't display the dataplane list
    And the URL "/meshes/default/service-insights/firewall-1" responds with
      """
      body:
        serviceType: "internal"
      """
    And the URL "/meshes/default/dataplanes+insights" responds with
      """
      """
    When I visit the "/mesh/default/service/firewall-1" URL
    Then the "$items" element exists
    And the URL "/meshes/default/dataplanes+insights" was requested with
      """
      searchParams:
        tags: "kuma.io/service:firewall-1"
        offset: 0
        size: 50
      """

