Feature: mesh / item
  Background:
    Given the CSS selectors
      | Alias         | Selector                        |
      | error         | [data-testid="error-state"]     |
      | service-count | [data-testid="services-status"] |

  Scenario: /mesh-insights/* isn't a 404
    Given the URL "/mesh-insights/default" responds with
      """
      body:
        services:
          total: 11
      """
    When I visit the "/meshes/default/overview" URL
    And the "$service-count" element contains "11"

  Scenario: /mesh-insights/* is a 404
    Given the URL "/mesh-insights/default" responds with
      """
      headers:
        Status-Code: 404
      """
    When I visit the "/meshes/default/overview" URL
    Then the "$error" element doesn't exist
    And the "$service-count" element contains "0"
