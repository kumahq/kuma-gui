Feature: onboarding / dataplanes-overview / index
  Background:
    Given the CSS selectors
      | Alias           | Selector                               |
      | next-button     | [data-testid='onboarding-next-button'] |
      | loading         | [data-testid='loading']                |
      | is-connected    | [data-testid='dpps-connected']         |
      | is-disconnected | [data-testid='dpps-disconnected']      |

  Scenario: Loading a dataplane and showing the state
    Given the environment
      """
      KUMA_DATAPLANE_COUNT: 0
      """
    When I visit the "/onboarding/add-services-code" URL
    Then the "$loading" element exists
    And the "$is-disconnected" element exists
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
    Then the "$loading" element doesn't exist
    And the "$is-connected" element exists
    And the "$next-button:not([disabled])" element exists
