Feature: mesh / item

  Background:
    Given the CSS selectors
      | Alias              | Selector                                 |
      | error              | [data-testid="error-state"]              |
      | service-count      | [data-testid="services-status"]          |
      | config-universal   | [data-testid='codeblock-yaml-universal'] |
      | config-k8s         | [data-testid='codeblock-yaml-k8s']       |
      | select-environment | [data-testid='select-input']             |

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

  Scenario: Shows config with format based on environment
    When I visit the "/meshes/default/overview" URL
    Then the "$config-universal" element exists
    And the URL contains "?environment=universal"
    When I click the "$select-environment" element
    When I click the "[data-testid='select-item-k8s'] button" element
    Then the "$config-k8s" element exists
    And the URL contains "?environment=k8s"
