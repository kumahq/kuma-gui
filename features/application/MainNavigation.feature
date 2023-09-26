Feature: application / MainNavigation
  Background:
    Given the CSS selectors
      | Alias    | Selector     |
      | main-nav | .app-sidebar |

  Scenario Outline: The navigation shows the correct nav for <Mode>
    Given the environment
      """
      KUMA_MODE: <Mode>
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

  Scenario: Pagination deeplinking
    Given the environment
      """
      KUMA_MESH_COUNT: 60
      """
    And the URL "/meshes" responds with
      """
      """
    When I visit the "/meshes" URL
    And the URL contains "page=1&size=50"
    And the "[data-testid='page-1-btn'].active" element exists

    When I visit the "/meshes?page=2&size=" URL
    And the URL contains "page=2&size=50"
    And the "[data-testid='page-2-btn'].active" element exists

    When I visit the "/mesh/default/data-planes" URL
    And the URL contains "page=1&size=50"
    And the URL doesn't contain "mesh=default"


  Scenario: History navigation
    Given the environment
      """
      KUMA_MESH_COUNT: 60
      """
    When I visit the "/" URL
    Then the page title contains "Overview"
    And the "[data-testid='zone-control-planes-status']" element exists

    When I click the "$main-nav .nav-item-mesh-list-view a" element
    Then the page title contains "Meshes"
    And the "[data-testid='page-1-btn'].active" element exists

    When I click the "[data-testid='next-btn'] > a" element
    Then the page title contains "Meshes"
    And the "[data-testid='page-2-btn'].active" element exists

    When I navigate "back"
    Then the page title contains "Meshes"
    And the "[data-testid='page-1-btn'].active" element exists

    When I navigate "back"
    Then the page title contains "Overview"
    And the "[data-testid='zone-control-planes-status']" element exists
