Feature: mesh / item

  Background:
    Given the CSS selectors
      | Alias              | Selector                                                        |
      | error              | [data-testid="error-state"]                                     |
      | service-count      | [data-testid="services-status"]                                 |
      | config-universal   | [data-testid='codeblock-yaml-universal']                        |
      | config-k8s         | [data-testid='codeblock-yaml-k8s']                              |
      | select-environment | [data-testid='select-input']                                    |
      | mtls-warning       | [data-testid^='notification-meshes.notifications.mtls-warning'] |
      | mtrust-section     | [data-testid='mesh-trusts-listing']                             |
      | mesh-detail        | [data-testid='mesh-detail-view']                                |

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
    Then the "$mesh-detail" element exists but the "$error" element doesn't exist
    And the "$service-count" element contains "0"

  Scenario: Shows config with format based on environment
    When I visit the "/meshes/default/overview" URL
    Then the "$config-universal" element exists
    And the URL contains "?environment=universal"
    When I click the "$select-environment" element
    When I click the "[data-testid='select-item-k8s'] button" element
    Then the "$config-k8s" element exists
    And the URL contains "?environment=k8s"

  Scenario: With no MeshIdentity and no mtls the mTLS warning exists
    Given the environment
      """
      KUMA_MESHIDENTITY_COUNT: 0
      """
    And the URL "/meshes/default" responds with
      """
      body:
        mtls: !!js/undefined
      """
    When I visit the "/meshes/default/overview" URL
    Then the "$mtls-warning" element exists

  Scenario Outline: With <Scenario> the mTLS warning doesn't exist
    Given the environment
      """
      KUMA_MESHIDENTITY_COUNT: <midCount>
      """
    And the URL "/meshes/default" responds with
      """
      body:
        mtls: <mtls>
      """
    When I visit the "/meshes/default/overview" URL
    Then the "$mesh-detail" element exists but the "$mtls-warning" element doesn't exist

    Examples:
      | Scenario                   | midCount | mtls           |
      | a MeshIdentity and no mtls |        1 | !!js/undefined |
      | no MeshIdentity but mtls   |        0 |                |

  Scenario: With at least one MeshTrust the MeshTrust section exists
    Given the environment
      """
      KUMA_MESHTRUST_COUNT: 1
      """
    When I visit the "/meshes/default/overview" URL
    Then the "$mtrust-section" element exists

  Scenario: With no MeshTrust the MeshTrust section doesn't exist
    Given the environment
      """
      KUMA_MESHTRUST_COUNT: 0
      """
    When I visit the "/meshes/default/overview" URL
    Then the "$mesh-detail" element exists but the "$mtrust-section" element doesn't exist
