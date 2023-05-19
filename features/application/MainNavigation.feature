Feature: index
  Background:
    Given the CSS selectors
      | Alias         | Selector                         |
      | main-nav      | .app-sidebar                     |

  Scenario Outline: The navigation shows Zone items depending on mode
    Given the URL "/config" responds with
      """
      body:
        mode: <Mode>
      """
    When I visit the "/" URL
    Then the "$main-nav .nav-item-<RouteName>" element <ExistsAssertion>
    Examples:
      | RouteName              | Mode       | ExistsAssertion |
      | zone-list-view         | global     | exists          |
      | zone-ingress-list-view | global     | exists          |
      | zone-egress-list-view  | global     | exists          |
      | zone-list-view         | standalone | doesn't exist   |
      | zone-ingress-list-view | standalone | doesn't exist   |
      | zone-egress-list-view  | standalone | exists          |

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
    When I visit the "/" URL
    Then the "$main-nav .nav-item-<RouteName>" element contains "<Text>"
    Examples:
      | RouteName              | Count  | Text |
      | zone-list-view         | 0      | 0    |
      | zone-egress-list-view  | 0      | 0    |
      | zone-ingress-list-view | 0      | 0    |
      | zone-list-view         | 50     | 50   |
      | zone-egress-list-view  | 122    | 99+  |
      | zone-ingress-list-view | 1      | 1    |
      | zone-list-view         | 100    | 99+  |
      | zone-egress-list-view  | 100    | 99+  |
      | zone-ingress-list-view | 100    | 99+  |

  Scenario Outline: Visiting the "<Title>" page
    Given the URL "/mesh-insights/default" responds with
      """
      body:
        policies:
          CircuitBreaker:
            total: 0
          FaultInjection:
            total: 1
      """
    When I visit the "/" URL
    When I click the "<Selector>" element
    Then the page title contains "<Title>"

    Examples:
      | Selector                                     | Title              |
      | $main-nav .nav-item-home a                   | Overview           |
      | $main-nav .nav-item-zone-list-view a         | Zone CPs           |
      | $main-nav .nav-item-zone-egress-list-view a  | Zone Egresses      |
      | $main-nav .nav-item-zone-ingress-list-view a | Zone Ingresses     |
      | [data-testid='nav-item-diagnostics']         | Diagnostics        |
