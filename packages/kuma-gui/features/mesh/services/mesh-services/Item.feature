Feature: mesh / mesh-services / item

  Background:
    Given the CSS selectors
      | Alias              | Selector                                       |
      | dataplanes         | [data-testid='data-plane-collection'] tbody tr |
      | hostnames          | [data-testid='hostnames-collection'] tbody tr  |
      | config-universal   | [data-testid='codeblock-yaml-universal']       |
      | config-k8s         | [data-testid='codeblock-yaml-k8s']             |
      | select-environment | [data-testid='select-input']                   |

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

  Scenario: Shows config with format based on environment
    When I visit the "/meshes/default/services/mesh-services/firewall-1/config" URL
    Then the "$config-universal" element exists
    And the URL contains "?environment=universal"
    When I click the "$select-environment" element
    When I click the "[data-testid='select-item-k8s'] button" element
    Then the "$config-k8s" element exists
    And the URL contains "?environment=k8s"
