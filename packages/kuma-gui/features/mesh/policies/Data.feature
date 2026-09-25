Feature: mesh / policies / data

  Background:
    Given the CSS selectors
      | Alias         | Selector                       |
      | items         | [data-testid='app-collection'] |
      | item          | $items tbody tr                |
      | state-empty   | [data-testid='empty-block']    |
      | state-error   | [data-testid='x-error-state']  |
      | state-loading | [data-testid='loading-block']  |

  Scenario: 2 items in the response shows 2 items
    Given the environment
      """
      KUMA_MESHACCESSLOG_COUNT: 2
      KUMA_LATENCY: 1000
      """
    And the URL "/meshes/default/meshaccesslogs" responds with
      """
      body:
        items:
        - name: fake-mal-1
        - name: fake-mal-2
      """
    When I visit the "/meshes/default/policies/mal" URL
    Then the "$state-loading" element exists
    Then the "$item" element exists 2 times

  Scenario: Zero items shows the empty state
    Given the environment
      """
      KUMA_MESHACCESSLOG_COUNT: 0
      """
    When I visit the "/meshes/default/policies/mal" URL
    Then the "$state-empty" element exists

  Scenario: Erroring shows an error state
    Given the URL "/meshes/default/meshaccesslogs" responds with
      """
      headers:
        Status-Code: '503'
      """
    When I visit the "/meshes/default/policies/mal" URL
    Then the "$state-error" element exists
