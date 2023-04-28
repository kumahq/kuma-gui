Feature: index
  Background:
    Given the CSS selectors
      | Alias         | Selector                         |
      | main-nav      | .app-sidebar                     |

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
      | zone-list-view         | 0      | 0   |
      | zone-egress-list-view  | 0      | 0   |
      | zone-ingress-list-view | 0      | 0   |
      | service-list-view      | 0      | 0   |
      | data-plane-list-view   | 0      | 0   |
      | gateway-list-view      | 0      | 0   |
      | policies               | 0      | 0   |
      | zone-list-view         | 50     | 50  |
      | zone-egress-list-view  | 122    | 99+ |
      | zone-ingress-list-view | 1      | 1   |
      | service-list-view      | 11     | 11  |
      | data-plane-list-view   | 100000 | 99+ |
      | gateway-list-view      | 1001   | 99+ |
      | policies               | 1      | 14  |
      | zone-list-view         | 100    | 99+ |
      | zone-egress-list-view  | 100    | 99+ |
      | zone-ingress-list-view | 100    | 99+ |
      | service-list-view      | 100    | 99+ |
      | data-plane-list-view   | 100    | 99+ |
      | gateway-list-view      | 100    | 99+ |
      | policies               | 100    | 99+ |

  Scenario Outline: Visiting the "<Title>" page
    When I visit the "/" URL
    When I "click" on the "$main-nav .nav-item-<RouteName> a" element
    Then the page title contains "<Title>"

    Examples:
      | RouteName              | Title              |
      | home                   | Overview           |
      | zone-list-view         | Zones              |
      | zone-egress-list-view  | Zone Egresses      |
      | zone-ingress-list-view | Zone Ingresses     |
      | service-list-view      | Services           |
      | gateway-list-view      | Gateways           |
      | data-plane-list-view   | Data plane proxies |
      # TODO: This should say Circuit Breakers
      | policies               | Manager            |
      # | policies               | Circuit Breakers |
