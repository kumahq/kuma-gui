Feature: mesh / services / mesh-external-services / item

  Background:
    Given the CSS selectors
      | Alias              | Selector                                            |
      | config-universal   | [data-testid='codeblock-yaml-universal']            |
      | config-k8s         | [data-testid='codeblock-yaml-k8s']                  |
      | select-environment | [data-testid='select-input']                        |
      | about-section      | [data-testid='mesh-external-service-about-section'] |
    And the URL "/meshes/default/meshexternalservices/item-1" responds with
      """
      body:
          labels:
            k8s.kuma.io/namespace: kuma-demo
            kuma.io/origin: zone
            kuma.io/zone: zone-1
      """
    And the URL "/_kri/kri_extsvc_default_zone-1_kuma-demo_item-1_" responds with
      """
      body:
          labels:
            k8s.kuma.io/namespace: kuma-demo
            kuma.io/origin: zone
            kuma.io/zone: zone-1
      """

  Scenario Outline: The about section has the expected content
    When I visit the "/meshes/default/services/mesh-external-services/<Name>/overview" URL
    Then the "$about-section" element exists
    And the "$about-section" element contains "kuma-demo"
    And the "$about-section" element contains "kuma.io/origin:zone"

    Examples:
      | Name                                        |
      | item-1                                      |
      | kri_extsvc_default_zone-1_kuma-demo_item-1_ |

  Scenario Outline: Shows config with format based on environment
    When I visit the "/meshes/default/services/mesh-external-services/<Name>/overview" URL
    Then the "$config-universal" element exists
    And the URL contains "?environment=universal"
    When I click the "$select-environment" element
    When I click the "[data-testid='select-item-k8s'] button" element
    Then the "$config-k8s" element exists
    And the URL contains "?environment=k8s"

    Examples:
      | Name                                        |
      | item-1                                      |
      | kri_extsvc_default_zone-1_kuma-demo_item-1_ |
