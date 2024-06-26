Feature: mesh / mesh-services / item

  Background:
    Given the CSS selectors
      | Alias      | Selector                                       |
      | dataplanes | [data-testid='data-plane-collection'] tbody tr |

  Scenario: The dataplane table exists
    Given the environment
      """
        KUMA_DATAPLANE_COUNT: 1
      """
    And the URL "/meshes/default/meshservices/firewall-1" responds with
      """
      body:
        spec:
          selector:
            dataplaneTags:
              app: firewall-1
              k8s.kuma.io/namespace: firewall-app
      """
    When I visit the "/meshes/default/services/mesh-services/firewall-1/overview" URL
    Then the "$dataplanes" element exists 1 times
