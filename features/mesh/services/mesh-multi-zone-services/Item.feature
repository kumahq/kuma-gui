Feature: mesh / mesh-multi-zone-services / item

  Background:
    Given the CSS selectors
      | Alias      | Selector                              |
      | services | [data-testid$='-collection'] tbody tr |
      | detail-link | $services:nth-child(1) [data-action] |

  Scenario: The MeshServices table exists
    Given the environment
      """
        KUMA_SERVICE_COUNT: 1
      """
    And the URL "/meshes/default/meshmultizoneservices/firewall-1" responds with
      """
      body:
        status:
          meshServices:
            - name: the-service
              mesh: not-default-mesh
              zone: not-default
      """
    When I visit the "/meshes/default/services/mesh-multi-zone-services/firewall-1/overview" URL
    Then the "$services" element exists 1 times
    And I click the "$detail-link" element
    Then the URL contains "/meshes/not-default-mesh/services/mesh-services/the-service/overview"
