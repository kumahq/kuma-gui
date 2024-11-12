Feature: mesh / policies / index

  Background:
    Given the CSS selectors
      | Alias            | Selector                                                                                 |
      | policy-type-list | [data-testid='policy-type-list']                                                         |
      | items            | [data-testid='app-collection']                                                           |
      | detail-view      | [data-testid='policy-detail-view']                                                       |
      | items-header     | $items th                                                                                |
      | item             | $items tbody tr                                                                          |
      | action-group     | $item:first-child [data-testid='x-action-group-control']                                 |
      | view             | $item:first-child [data-testid='x-action-group'] li:first-child [data-testid='x-action'] |
      | action           | $item:first-child [data-action]                                                          |
      | button-docs      | [data-testid='policy-documentation-link']                                                |
      | breadcrumbs      | .k-breadcrumbs                                                                           |
    And the environment
      """
      KUMA_MODE: global
      KUMA_CIRCUITBREAKER_COUNT: 2
      """
    And the URL "/meshes/default/circuit-breakers" responds with
      """
      body:
        items:
        - name: fake-cb-1
        - name: fake-cb-2
      """

  Scenario: Visiting `/policies` redirects
    When I visit the "/meshes/default/policies" URL
    Then the URL contains "/meshes/default/policies/circuit-breakers"

  Scenario: Listing has expected content
    When I visit the "/meshes/default/policies/circuit-breakers" URL
    Then the "$button-docs" element exists
    And the "$items-header" element exists 4 times
    And the "[data-testid='policy-list-index-view-tab'].active" element exists
    And the "$item" element exists 2 times
    And the "$item:nth-child(1)" element contains
      | Value     |
      | fake-cb-1 |

  Scenario: Clicking the link goes to the detail page and back again
    When I visit the "/meshes/default/policies/circuit-breakers" URL
    Then the "$item:nth-child(1) td:nth-child(2)" element contains "fake-cb-1"
    When I click the "$action-group" element
    And I click the "$view" element
    Then the URL contains "circuit-breakers/fake-cb-1/overview"
    And the "$detail-view" element contains "fake-cb-1"
    When I click the "$breadcrumbs > .breadcrumbs-item-container:nth-child(3) > a" element
    Then the "$item" element exists 2 times

  Scenario: Clicking policy types in the sidebar switches listing
    Given the URL "/meshes/default/meshfaultinjections" responds with
      """
      body:
        items:
          - name: mfi-1
          - name: mfi-2
      """
    When I visit the "/meshes/default/policies/circuit-breakers" URL
    Then the "$item:nth-child(1) td:nth-child(2)" element contains "fake-cb-1"
    When I click the "[data-testid='policy-type-link-MeshFaultInjection']" element
    Then the "$item:nth-child(1) td:nth-child(2)" element contains "mfi-1"

  Scenario: TargetRef-based policies show Zone and targetRef columns
    Given the URL "/meshes/default/meshfaultinjections" responds with
      """
      body:
        items:
          - name: mfi-1
            labels:
              kuma.io/origin: zone
              kuma.io/zone: zone-1
            spec:
              targetRef:
                kind: MeshService
                name: service-1
      """
    When I visit the "/meshes/default/policies/meshfaultinjections" URL
    Then the "$item:nth-child(1) td:nth-child(2)" element contains "mfi-1"
    And the "$item:nth-child(1) td:nth-child(4)" element contains "zone-1"
    And the "$item:nth-child(1) td:nth-child(5)" element contains "MeshService:service-1"

  Scenario: Hides legacy policy types if there are no legacy policies applied
    Given the URL "/mesh-insights/default" responds with
      """
      body:
        policies:
          CircuitBreaker:
            total: 0
          FaultInjection:
            total: 0
          HealthCheck:
            total: 0
          MeshGatewayRoute:
            total: 0
          ProxyTemplate:
            total: 0
          RateLimit:
            total: 0
          Retry:
            total: 0
          Timeout:
            total: 0
          TrafficLog:
            total: 0
          TrafficPermission:
            total: 0
          TrafficRoute:
            total: 0
          TrafficTrace:
            total: 0
          VirtualOutbound:
            total: 0
          MeshFaultInjection:
            total: 2
      """
    When I visit the "/meshes/default/policies/meshfaultinjections" URL
    Then the "[data-testid='policy-type-link-MeshFaultInjection']" element exists
    And the "[data-testid='policy-type-link-FaultInjection']" element doesn't exist

  Scenario: Shows legacy policy types if there are any legacy policies applied
    Given the URL "/mesh-insights/default" responds with
      """
      body:
        policies:
          CircuitBreaker:
            total: 1
      """
    When I visit the "/meshes/default/policies/meshfaultinjections" URL
    Then the "[data-testid='policy-type-link-FaultInjection']" element exists
    And the "[data-testid='policy-type-link-MeshFaultInjection']" element exists

  Scenario: Regression test: Zone column is visible when navigating from legacy policy type
    When I visit the "/meshes/default/policies/circuit-breakers" URL
    Then the "$items-header" element exists 4 times
    When I click the "[data-testid='policy-type-link-MeshFaultInjection']" element
    Then the "$items-header" element exists 6 times
