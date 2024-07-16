Feature: mesh / delegated-gateways / item

  Background:
    Given the CSS selectors
      | Alias       | Selector                                           |
      | tabs-view   | [data-testid='delegated-gateway-detail-tabs-view'] |
      | detail-view | [data-testid='delegated-gateway-detail-view']      |
    Given the URL "/meshes/default/service-insights/service-1" responds with
      """
      body:
        name: gateway-1
        serviceType: gateway_delegated
        status: partially_degraded
        addressPort: 1.2.3.4:8000
        dataplanes:
          total: 2
          online: 1
          offline: 1
      """

  Scenario: Overview tab has expected content
    When I visit the "/meshes/default/gateways/delegated/service-1/overview" URL
    Then the "$tabs-view" element contains "service-1"
    Then the "$detail-view" elements contain
      | Value              |
      |       1.2.3.4:8000 |
      |              1 / 2 |
      | partially degraded |
