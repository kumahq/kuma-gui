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

  Scenario Outline: With <Scenario> the mTLS warning <Exists>
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
    Then the "$mtls-warning" element <Exists>

    Examples:
      | Scenario                    | Exists        | midCount | mtls           |
      | no MeshIdentity and no mtls | exists        |        0 | !!js/undefined |
      | a MeshIdentity and no mtls  | doesn't exist |        1 | !!js/undefined |
      | no MeshIdentity but mtls    | doesn't exist |        0 |                |

  Scenario Outline: With <Scenario> the MeshTrust section <Exists>
    Given the environment
      """
      KUMA_MESHTRUST_COUNT: <mtrustCount>
      """
    When I visit the "/meshes/default/overview" URL
    Then the "$mtrust-section" element <Exists>

    Examples:
      | Scenario               | Exists        | mtrustCount |
      | no MeshTrust           | doesn't exist |           0 |
      | at least one MeshTrust | exists        |           1 |
