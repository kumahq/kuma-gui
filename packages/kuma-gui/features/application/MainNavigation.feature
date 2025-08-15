Feature: application / MainNavigation

  Background:
    Given the CSS selectors
      | Alias              | Selector                                   |
      | main-nav           | .app-sidebar                               |
      | control-planes-nav | [data-testid='control-planes-navigator'] a |
      | meshes-nav         | [data-testid='meshes-navigator'] a         |
      | zones-nav          | [data-testid='zones-navigator'] a          |
      | zone-egresses-nav  | [data-testid='zone-egresses-navigator'] a  |
      | configuration-nav  | [data-testid='configuration-navigator'] a  |

  Scenario Outline: The navigation shows the correct nav for <Mode>
    Given the environment
      """
      KUMA_MODE: <Mode>
      """
    When I visit the "/" URL
    Then the "<Element>" element <ExistsAssertion>

    Examples:
      | Element            | Mode   | ExistsAssertion |
      | $zones-nav         | global | exists          |
      | $zone-egresses-nav | global | doesn't exist   |
      | $zones-nav         | zone   | doesn't exist   |
      | $zone-egresses-nav | zone   | exists          |

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
      | Selector            | Title               |
      | $control-planes-nav | Overview            |
      | $zones-nav          | Zone control planes |
      | $configuration-nav  | Configuration       |

  Scenario: Pagination deeplinking
    Given the environment
      """
      KUMA_MESH_COUNT: 60
      """
    When I visit the "/meshes" URL
    And the URL contains "page=1&size=50"
    And the "[data-testid='page-1-button'].active" element exists
    When I visit the "/meshes?page=2&size=" URL
    And the URL contains "page=2&size=50"
    And the "[data-testid='page-2-button'].active" element exists
    When I visit the "/meshes/default/data-planes" URL
    And the URL contains "page=1&size=50"
    And the URL doesn't contain "mesh=default"

  Scenario: Pagination from localStorage
    Given the localStorage
      """
      kumahq.kuma-gui:/:
        params:
          size: 75
      """
    When I visit the "/meshes" URL
    Then the URL contains "size=75"

  Scenario: Format from localStorage
    Given the localStorage
      """
      kumahq.kuma-gui:/:
        params:
          format: yaml
      """
    And the URL "/meshes/default/meshservices" responds with
      """
      body:
        items:
        - name: monitor-proxy-0.kuma-demo
          labels:
            kuma.io/display-name: monitor-proxy-0
            k8s.kuma.io/namespace: kuma-demo
      """
    When I visit the "/meshes/default/services/mesh-services/monitor-proxy-0.kuma-demo" URL
    Then the URL contains "format=yaml"
    And the "[data-testid='k-code-block']" element exists

  Scenario: History navigation
    Given the environment
      """
      KUMA_MESH_COUNT: 60
      """
    When I visit the "/" URL
    Then the page title contains "Overview"
    And the "[data-testid='zone-control-planes-status']" element exists
    When I click the "$meshes-nav" element
    Then the page title contains "Meshes"
    And the "[data-testid='page-1-button'].active" element exists
    When I click the "[data-testid='next-button']" element
    Then the page title contains "Meshes"
    And the "[data-testid='page-2-button'].active" element exists
    When I navigate "back"
    Then the page title contains "Meshes"
    And the "[data-testid='page-1-button'].active" element exists
    When I navigate "back"
    Then the page title contains "Overview"
    And the "[data-testid='zone-control-planes-status']" element exists

  Scenario: Secondary navigation
    When I visit the "/meshes/default/data-planes/dp-name/stats" URL
    And the "[data-testid='data-plane-stats-view-tab'].active" element exists

  Scenario: Tertiary navigation
    Given the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: false
      """
    When I visit the "/meshes/default/data-planes/dp-name/overview/inbound/localhost_51112/stats" URL
    And the URL "/meshes/default/dataplanes/dp-name/_overview" responds with
      """
      body:
        dataplane:
          networking:
            inbound:
              - port: 51112
      """
    And the "[data-testid='data-plane-connection-inbound-summary-stats-view-tab'].active" element exists
