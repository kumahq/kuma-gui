Feature: index
  Background:
    Given the CSS selectors
      | Alias         | Selector                         |
      | loading       | [data-testid='app-progress-bar'] |
      | logo          | [data-testid='logo']             |
      | error         | [data-testid='app-error']        |

  Scenario: Application loading
    Given the environment
      """
      KUMA_LATENCY: 1000
      """
    And the URL "/meshes" responds with
      """
      """
    When I load the "/" URL
    Then the "$loading" element exists
    And I wait for 2000 milliseconds
    Then the "$loading" element doesn't exist
    And the "$logo" element exists
  Scenario: Application errors
    Given the environment
      """
      KUMA_LATENCY: 1000
      """
    And the URL "/config" responds with
      """
      headers:
        Status-Code: 500
      """
    When I visit the "/" URL
    Then the "$loading" element doesn't exist
    Then the "$error" element exists
