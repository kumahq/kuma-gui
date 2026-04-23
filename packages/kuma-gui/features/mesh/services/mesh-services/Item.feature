Feature: mesh / mesh-services / item

  Background:
    Given the CSS selectors
      | Alias              | Selector                                       |
      | dataplanes         | [data-testid='data-plane-collection'] tbody tr |
      | hostnames          | [data-testid='hostnames-collection'] tbody tr  |
      | config-universal   | [data-testid='codeblock-yaml-universal']       |
      | config-k8s         | [data-testid='codeblock-yaml-k8s']             |
      | select-environment | [data-testid='select-input']                   |
      | identities         | [data-testid='mesh-service-identities']        |
      | about-section      | [data-testid='mesh-service-about-section']     |
    And the URL "/meshes/default/meshservices/item-1" responds with
      """
      body:
          labels:
            k8s.kuma.io/namespace: kuma-demo
            kuma.io/origin: zone
            kuma.io/zone: zone-1
      """
    And the URL "/_kri/kri_msvc_default_zone-1_kuma-demo_item-1_" responds with
      """
      body:
          labels:
            k8s.kuma.io/namespace: kuma-demo
            kuma.io/origin: zone
            kuma.io/zone: zone-1
      """

  Scenario Outline: The about section has the expected content
    When I visit the "/meshes/default/services/mesh-services/<Name>/overview" URL
    Then the "$about-section" element exists
    And the "$about-section" element contains "kuma-demo"
    And the "$about-section" element contains "kuma.io/origin:zone"

    Examples:
      | Name                                      |
      | item-1                                    |
      | kri_msvc_default_zone-1_kuma-demo_item-1_ |

  Scenario Outline: The dataplane table exists
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
    And the URL "/_kri/kri_msvc_default_zone-1_kuma-demo_firewall-1_" responds with
      """
      body:
        spec:
          selector:
            dataplaneTags:
              app: firewall-1
              k8s.kuma.io/namespace: firewall-app
      """
    When I visit the "/meshes/default/services/mesh-services/<Name>/overview" URL
    Then the "$dataplanes" element exists 1 times

    Examples:
      | Name                                          |
      | item-1                                        |
      | kri_msvc_default_zone-1_kuma-demo_firewall-1_ |

  Scenario Outline: Status of DPPs shows the correct values
    Given the URL "/meshes/default/meshservices/my-meshservice" responds with
      """
      body:
        status:
          dataplaneProxies:
            connected: 3
            healthy: 2
            total: 4
      """
    And the URL "/_kri/kri_msvc_default_zone-1_kuma-demo_my-meshservice__" responds with
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

    Examples:
      | Name                                              |
      | item-1                                            |
      | kri_msvc_default_zone-1_kuma-demo_my-meshservice_ |

  Scenario Outline: Shows config with format based on environment
    When I visit the "/meshes/default/services/mesh-services/<Name>/config" URL
    Then the "$config-universal" element exists
    And the URL contains "?environment=universal"
    When I click the "$select-environment" element
    When I click the "[data-testid='select-item-k8s'] button" element
    Then the "$config-k8s" element exists
    And the URL contains "?environment=k8s"

    Examples:
      | Name                                      |
      | item-1                                    |
      | kri_msvc_default_zone-1_kuma-demo_item-1_ |

  Scenario Outline: Shows identities in the table
    Given the URL "/meshes/default/meshservices/firewall-1" responds with
      """
      body:
        spec:
          identities:
            - type: ServiceTag
              value: firewall-1-tag
            - type: SpiffeID
              value: spiffe://kuma.io/ns/firewall-app/sa/firewall-1
      """
    Given the URL "/_kri/kri_msvc_default_zone-1_kuma-demo_firewall-1_" responds with
      """
      body:
        spec:
          identities:
            - type: ServiceTag
              value: firewall-1-tag
            - type: SpiffeID
              value: spiffe://kuma.io/ns/firewall-app/sa/firewall-1
      """
    When I visit the "/meshes/default/services/mesh-services/<Name>/overview" URL
    Then the "$identities" element exists
    And the "$identities" element contains "firewall-1-tag"
    And the "$identities" element contains "ServiceTag"
    And the "$identities" element contains "spiffe://kuma.io/ns/firewall-app/sa/firewall-1"
    And the "$identities" element contains "SpiffeID"

    Examples:
      | Name                                          |
      | firewall-1                                    |
      | kri_msvc_default_zone-1_kuma-demo_firewall-1_ |
