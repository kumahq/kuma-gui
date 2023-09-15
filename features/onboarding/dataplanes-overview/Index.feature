Feature: onboarding / dataplanes-overview / index
  Background:
    Given the CSS selectors
      | Alias         | Selector                               |
      | next-button   | [data-testid='onboarding-next-button'] |
      | loading       | [data-testid='loading']                |
      | state-success | [data-testid='state-success']          |
      | state-waiting | [data-testid='state-waiting']          |

  Scenario: Loading the dataplane list and showing the state
    Given the environment
      """
      KUMA_DATAPLANE_COUNT: 0
      """
    And the URL "/dataplanes" responds with
      """
      """
    When I visit the "/onboarding/dataplanes-overview" URL
    Then the "$loading" element exists
    And the "$state-waiting" element exists
    And the "$next-button[disabled]" element exists
    And the environment
      """
      KUMA_DATAPLANE_COUNT: 1
      """
    And the URL "/dataplanes" responds with
      """
      body:
        items:
          - name: dataplane-test
      """
    And the URL "/meshes/default/dataplanes+insights/dataplane-test" responds with
      """
      body:
        dataplaneInsight:
          subscriptions:
            - connectTime: 2021-02-17T07:33:36.412683Z
              disconnectTime: !!js/undefined
      """
    Then the "$loading" element doesn't exist
    And the "$state-success" element exists
    And the "$next-button:not([disabled])" element exists
