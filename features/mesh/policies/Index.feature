Feature: mesh / policies / index
  Background:
    Given the CSS selectors
      | Alias            | Selector                                  |
      | policy-type-list | [data-testid='policy-type-list']          |
      | items            | [data-testid='policy-collection']         |
      | items-header     | $items th                                 |
      | item             | $items tbody tr                           |
      | button-docs      | [data-testid='policy-documentation-link'] |
      | breadcrumbs      | .k-breadcrumbs                            |
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
          MeshGatewayRoute: ~
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

  Scenario: Listing has expected content
    When I visit the "/meshes/default/policies/circuit-breakers" URL

    Then the "$button-docs" element exists

    And the "$items-header" element exists 2 times
    And the "$items-header" elements contain
      | Value |
      | Name  |

    And the "#policy-list-index-view-tab.active" element exists
    And the "$item" element exists 2 times
    And the "$item:nth-child(1)" element contains
      | Value     |
      | fake-cb-1 |

  Scenario: Clicking the link goes to the detail page and back again
    When I visit the "/meshes/default/policies/circuit-breakers" URL

    Then the "$item:nth-child(1) td:nth-child(1)" element contains "fake-cb-1"

    When I click the "$item:nth-child(1) [data-testid='details-link']" element

    Then the URL contains "circuit-breakers/fake-cb-1/overview"

    When I click the "$breadcrumbs > .k-breadcrumbs-item:nth-child(3) > a" element

    Then the "$item" element exists 2 times

  Scenario: Clicking policy types in the sidebar switches listing
    Given the URL "/meshes/default/meshfaultinjections" responds with
      """
      body:
        items:
          - name: mfi-1
            spec:
              targetRef:
                kind: MeshService
                name: service-1
          - name: mfi-2
      """

    When I visit the "/meshes/default/policies/circuit-breakers" URL

    Then the "$item:nth-child(1) td:nth-child(1)" element contains "fake-cb-1"

    When I click the "[data-testid='policy-type-link-MeshFaultInjection']" element

    Then the "$item:nth-child(1) td:nth-child(1)" element contains "mfi-1"
    And the "$item:nth-child(1)" element contains "MeshService:service-1"
