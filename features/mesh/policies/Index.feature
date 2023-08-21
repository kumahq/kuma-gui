Feature: mesh / policies / index
  Background:
    Given the CSS selectors
      | Alias               | Selector                                  |
      | items               | [data-testid='policy-collection']         |
      | items-header        | $items th                                 |
      | item                | $items tbody tr                           |
      | button-docs         | [data-testid='policy-documentation-link'] |
      | navigation          | .route-mesh-view-tabs ul >                |
      | button-tab-selected | $navigation li:nth-child(5).active        |
      | breadcrumbs         | .k-breadcrumbs                            |
    And the environment
      """
      KUMA_CIRCUITBREAKER_COUNT: 2
      """
    # Makes ure that we only have CircuitBreakers so clicking back on the tabs
    # Always takes us to the CircuitBreaker listing
    And the URL "/mesh-insights/default" responds with
      """
      body:
        policies:
          CircuitBreaker:
            - total: 2
          FaultInjection: ~
          HealthChecks: ~
          MeshGatewayRoute',
          MeshGateway: ~
          ProxyTemplate: ~
          RateLimit: ~
          Retry: ~
          Timeout: ~
          TrafficLog: ~
          TrafficPermission: ~
          TrafficRoute: ~
          TrafficTrace: ~
          VirtualOutbound: ~
      """
    And the URL "/meshes/default/circuit-breakers" responds with
      """
      body:
        items:
        - name: fake-cb-1
        - name: fake-cb-2
      """
    When I visit the "/mesh/default/policies/circuit-breakers" URL

  Scenario: We have a documentation link
    Then the "$button-docs" element exists

  Scenario: The items have the correct columns
    Then the "$items-header" element exists 3 times
    Then the "$items-header" elements contain
      | Value |
      | Name  |
      | Type  |
  Scenario: The items have the expected content and UI elements
    Then the "$button-tab-selected" element exists
    Then the "$item" element exists 2 times
    Then the "$item:nth-child(1)" element contains
      | Value          |
      | fake-cb-1      |
      | CircuitBreaker |

  Scenario: Clicking the link goes to the detail page and back again
    Then the "$item:nth-child(1) td:nth-child(1)" element contains "fake-cb-1"
    When I click the "$item:nth-child(1) td:first-of-type a" element
    Then the URL contains "circuit-breakers/fake-cb-1"

    When I click the "$breadcrumbs > .k-breadcrumbs-item:nth-child(3) > a" element
    Then the "$item" element exists 2 times
