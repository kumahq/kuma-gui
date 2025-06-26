Feature: mesh / services / mesh-multi-zone-services / item

  Background:
    Given the CSS selectors
      | Alias              | Selector                                 |
      | config-universal   | [data-testid='codeblock-yaml-universal'] |
      | config-k8s         | [data-testid='codeblock-yaml-k8s']       |
      | select-environment | [data-testid='select-input']             |

  Scenario: Shows config with format based on environment
    When I visit the "/meshes/default/services/mesh-multi-zone-services/item-1/overview" URL
    Then the "$config-universal" element exists
    And the URL contains "?environment=universal"
    When I click the "$select-environment" element
    When I click the "[data-testid='select-item-k8s'] button" element
    Then the "$config-k8s" element exists
    And the URL contains "?environment=k8s"
