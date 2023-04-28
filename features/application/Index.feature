Feature: index
  Background:
    Given the CSS selectors
      | Alias         | Selector                         |
      | loading       | [data-testid="app-progress-bar"] |
      | logo          | [data-testid="logo"]             |
      | error         | [data-testid="app-error"]        |
      | main-nav      | .app-sidebar                     |

  Scenario: Application loading
    Given the environment
      """
      KUMA_LATENCY: 1000
      """
    And the URL "/meshes" responds with
      """
      """
    When I visit the "/" URL
    Then the "$loading" element exists
    And I wait for 2000 milliseconds
    Then the "$loading" element doesn't exist
    And the "$logo" element exists

  # TODO: This test needs fixing it currently console.errors
  @skip
  Scenario: Application errors
    Given the environment
      """
      KUMA_LATENCY: 1000
      """
    And the URL "/" responds with
      """
      headers:
        Status-Code: 500
      """
    When I visit the "/" URL
    Then the "$loading" element exists
    And I wait for 2000 milliseconds
    Then the "$loading" element doesn't exist
    Then the "$error" element exists

  Scenario Outline: The navigation shows numbers correctly
    Given the URL "/global-insights" responds with
      """
      body:
        resources:
          Zone:
            total: <Count>
          ZoneEgress:
            total: <Count>
          ZoneIngress:
            total: <Count>
      """
    And the URL "/mesh-insights/default" responds with
      """
      body:
        dataplanesByType:
          gateway:
            total: <Count>
          standard:
            total: <Count>
        policies:
          CircuitBreaker:
            total: <Count>
          FaultInjection:
            total: <Count>
          HealthCheck:
            total: <Count>
          MeshGatewayRoute:
            total: <Count>
          MeshGateway:
            total: <Count>
          ProxyTemplate:
            total: <Count>
          RateLimit:
            total: <Count>
          Retry:
            total: <Count>
          Timeout:
            total: <Count>
          TrafficLog:
            total: <Count>
          TrafficPermission:
            total: <Count>
          TrafficRoute:
            total: <Count>
          TrafficTrace:
            total: <Count>
          VirtualOutbound:
            total: <Count>
        services:
          total: <Count>
      """
    When I visit the "/" URL
    Then the "$main-nav .nav-item-<RouteName>" element contains "<Text>"
    Examples:
      | RouteName            | Count  | Text |
      | zones                | 0      | 0    |
      | zoneegresses         | 0      | 0    |
      | zoneingresses        | 0      | 0    |
      | service-list-view    | 0      | 0    |
      | data-plane-list-view | 0      | 0    |
      | gateway-list-view    | 0      | 0    |
      | policies             | 0      | 0    |
      | zones                | 50     | 50   |
      | zoneegresses         | 122    | 99+  |
      | zoneingresses        | 1      | 1    |
      | service-list-view    | 11     | 11   |
      | data-plane-list-view | 100000 | 99+  |
      | gateway-list-view    | 1001   | 99+  |
      | policies             | 1      | 14   |
      | zones                | 100    | 99+  |
      | zoneegresses         | 100    | 99+  |
      | zoneingresses        | 100    | 99+  |
      | service-list-view    | 100    | 99+  |
      | data-plane-list-view | 100    | 99+  |
      | gateway-list-view    | 100    | 99+  |
      | policies             | 100    | 99+  |

