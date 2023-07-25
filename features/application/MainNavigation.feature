Feature: MainNavigation
  Background:
    Given the CSS selectors
      | Alias    | Selector     |
      | main-nav | .app-sidebar |

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
      | zone-cp-list-view      | global     | exists          |
      | zone-ingress-list-view | global     | doesn't exists  |
      | zone-egress-list-view  | global     | doesn't exists  |
      | zone-cp-list-view      | standalone | doesn't exist   |
      | zone-ingress-list-view | standalone | doesn't exist   |
      | zone-egress-list-view  | standalone | exists          |

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
      | Selector                                | Title               |
      | $main-nav .nav-item-home a              | Overview            |
      | $main-nav .nav-item-zone-cp-list-view a | Zone Control Planes |
      | [data-testid='nav-item-diagnostics']    | Diagnostics         |
