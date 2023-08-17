Feature: mesh / policies / data
  Background:
    Given the CSS selectors
      | Alias         | Selector                            |
      | items         | [data-testid='policy-collection']   |
      | item          | $items tbody tr                     |
      | state-empty   | [data-testid='k-table-empty-state'] |
      | state-error   | [data-testid='error-state']         |
      | state-loading | [data-testid='loading-block']       |
    And the URL "/mesh-insights/default" responds with
      """
      body:
        policies:
          CircuitBreaker:
            - total: 2
      """
  Scenario: 2 items in the response shows 2 items
    Given the environment
      """
      KUMA_CIRCUITBREAKER_COUNT: 2
      KUMA_LATENCY: 1000
      """
    And the URL "/meshes/default/circuit-breakers" responds with
      """
      body:
        items:
        - name: fake-cb-1
        - name: fake-cb-2
      """
    When I visit the "/mesh/default/policies/circuit-breakers" URL
    Then the "$state-loading" element exists
    Then the "$item" element exists 2 times
  Scenario: Zero items shows the empty state
    Given the environment
      """
      KUMA_CIRCUITBREAKER_COUNT: 0
      """
    And the URL "/meshes/default/circuit-breakers" responds with
      """
      """
    When I visit the "/mesh/default/policies/circuit-breakers" URL
    Then the "$state-empty" element exists

  Scenario: Erroring shows an error state
    Given the URL "/meshes/default/circuit-breakers" responds with
      """
      headers:
        Status-Code: '503'
      """
    When I visit the "/mesh/default/policies/circuit-breakers" URL
    Then the "$state-error" element exists
