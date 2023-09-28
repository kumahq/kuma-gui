Feature: application / loading
  Background:
    Given the CSS selectors
      | Alias   | Selector                         |
      | loading | [data-testid='app-progress-bar'] |
      | logo    | [data-testid='logo']             |
      | error   | [data-testid='app-error']        |

  Scenario: Application loading
    Given the environment
      """
      KUMA_LATENCY: 1000
      """
    When I load the "/" URL
    Then the "$loading" element exists
    Then the "$loading" element doesn't exist
    And the "$logo" element exists

  # TODO: This test needs fixing it currently console.errors
  @skip
  Scenario: Application errors
    Given the environment
      """
      KUMA_LATENCY: 1000
      """
    And the URL "/" responds with
      """
      headers:
        Status-Code: 500
      """
    When I visit the "/" URL
    Then the "$loading" element exists
    Then the "$loading" element doesn't exist
    Then the "$error" element exists
