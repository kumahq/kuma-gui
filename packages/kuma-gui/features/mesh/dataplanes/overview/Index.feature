Feature: mesh / workloads / item / overview

  Background:
    Given the CSS selectors
      | Alias         | Selector                                |
      | about-section | [data-testid='dataplane-about-section'] |
    And the environment
      """
      KUMA_DATAPLANE_COUNT: 1
      """
    And the URL "/meshes/default/dataplanes/dataplane-1/_overview" responds with
      """
      body:
        name: dataplane-1
        kri: kri_dp_default_zone-1_kuma-demo_dataplane-1_
        mesh: default
        labels:
          k8s.kuma.io/namespace: kuma-demo
          kuma.io/display-name: dataplane-1
          kuma.io/zone: zone-1
          kuma.io/origin: zone
        dataplane:
          networking:
            inbound:
              - tags:
                  kuma.io/zone: zone-1
      """

  Scenario: The about section has the expected content
    When I visit the "meshes/default/data-planes/dataplane-1/overview" URL
    Then the "$about-section" element exists
    And the "$about-section" element contains "zone-1"
    And the "$about-section" element contains "kuma.io/origin:zone"
