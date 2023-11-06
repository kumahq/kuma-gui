Feature: application / loading
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
