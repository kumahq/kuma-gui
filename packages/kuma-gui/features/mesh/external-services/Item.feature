Feature: mesh / external-services / item

  Background:
    Given the CSS selectors
      | Alias              | Selector                                     |
      | detail-view        | [data-testid='external-service-detail-view'] |
      | details            | [data-testid='external-service-details']     |
      | config-universal   | [data-testid='codeblock-yaml-universal']     |
      | config-k8s         | [data-testid='codeblock-yaml-k8s']           |
      | select-environment | [data-testid='select-input']                 |
    Given the URL "/meshes/default/external-services/service-1" responds with
      """
      body:
        networking:
          address: '1.2.3.4'
      """

  Scenario: Overview tab has expected content
    When I visit the "/meshes/default/services/external/service-1/overview" URL
    Then the "$detail-view" element contains "service-1"
    Then the "$details" element contains "1.2.3.4"

  Scenario: Shows config with format based on environment
    When I visit the "/meshes/default/services/external/service-1/overview" URL
    Then the "$config-universal" element exists
    Then the "$config-universal" element contains "1.2.3.4"
    And the URL contains "?environment=universal"
    When I click the "$select-environment" element
    When I click the "[data-testid='select-item-k8s'] button" element
    Then the "$config-k8s" element exists
    And the URL contains "?environment=k8s"
