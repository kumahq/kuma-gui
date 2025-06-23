Feature: mesh / external-services / item

  Background:
    Given the CSS selectors
      | Alias       | Selector                                          |
      | detail-view | [data-testid='external-service-detail-view']      |
      | details     | [data-testid='external-service-details']          |
      | config      | [data-testid='codeblock-yaml-universal']          |
    Given the URL "/meshes/default/external-services/service-1" responds with
      """
      body:
        networking:
          address: '1.2.3.4'
      """

  Scenario: Overview tab has expected content
    When I visit the "/meshes/default/services/external/service-1/overview?format=universal" URL
    Then the "$detail-view" element contains "service-1"
    Then the "$details" element contains "1.2.3.4"
    Then the "$config" element contains "1.2.3.4"
