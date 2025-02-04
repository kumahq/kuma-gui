Feature: mesh / mesh-services / item

  Background:
    Given the CSS selectors
      | Alias      | Selector                                              |
      | dataplanes | [data-testid='data-plane-collection'] tbody tr        |
      | hostnames  | [data-testid='inspect-hostnames-collection'] tbody tr |

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

  Scenario: Status of DPPs shows the correct values
    Given the URL "/meshes/default/meshservices/my-meshservice" responds with
      """
      body:
        status:
          dataplaneProxies:
            connected: 3
            healthy: 2
            total: 4
      """
    When I visit the "/meshes/default/services/mesh-services/my-meshservice/overview" URL
    Then the "[data-testid='connected-dpps']" element contains "3/4"
    And the "[data-testid='healthy-dpps']" element contains "2"
