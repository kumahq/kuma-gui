Feature: mesh / resources / item

  Background:
    Given the CSS selectors
      | Alias              | Selector                                 |
      | config-universal   | [data-testid='codeblock-yaml-universal'] |
      | config-k8s         | [data-testid='codeblock-yaml-k8s']       |
      | select-environment | [data-testid='select-input']             |
      | about-section      | [data-testid='about-resource']           |
    And the URL "/_kri/kri_mal_default_z1_ns1_resource-1_" responds with
      """
      body:
        name: resource-1
        kri: kri_mal_default_z1_ns1_resource-1_
        mesh: default
        namespace: kuma-demo
        zone: zone-1
        type: MeshAccessLog
        labels:
          k8s.kuma.io/namespace: kuma-demo
          kuma.io/origin: zone
          kuma.io/zone: zone-1
        creationTime: "2023-01-01T00:00:00Z"
        modificationTime: "2023-06-01T00:00:00Z"
      """

  Scenario: The about section has the expected content
    When I visit the "/meshes/default/resources/meshaccesslogs/kri_mal_default_z1_ns1_resource-1_/overview" URL
    Then the "$about-section" element exists
    And the "$about-section" element contains "kuma-demo"
    And the "$about-section" element contains "zone-1"
    And the "$about-section" element contains "kuma.io/origin:zone"

  Rule: Offering different view formats

    Scenario: Universal config is shown by default
      When I visit the "/meshes/default/resources/meshaccesslogs/kri_mal_default_z1_ns1_resource-1_/overview" URL
      Then the "$config-universal" element exists

    Scenario: Visiting with format=universal shows the universal codeblock
      When I visit the "/meshes/default/resources/meshaccesslogs/kri_mal_default_z1_ns1_resource-1_/overview?format=universal" URL
      Then the "$config-universal" element exists

    Scenario: Visiting with format=k8s shows the k8s codeblock
      When I visit the "/meshes/default/resources/meshaccesslogs/kri_mal_default_z1_ns1_resource-1_/overview?format=k8s" URL
      Then the "$config-k8s" element exists

    Scenario: Switching to k8s format shows the k8s codeblock
      When I visit the "/meshes/default/resources/meshaccesslogs/kri_mal_default_z1_ns1_resource-1_/overview" URL
      And I click the "$select-environment" element
      And I click the "[data-testid='select-item-k8s'] button" element
      Then the "$config-k8s" element exists
      And the URL contains "format=k8s"
