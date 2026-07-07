Feature: mesh / dataplanes / item / overview

  Background:
    Given the CSS selectors
      | Alias         | Selector                                |
      | about-section | [data-testid='dataplane-about-section'] |
    And the environment
      """
      KUMA_DATAPLANE_COUNT: 1
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      KUMA_MESHSERVICE_MODE: Exclusive
      """
    And the URL "/_kri/kri_dp_default_zone-1_kuma-demo_dataplane-1_" responds with
      """
      body:
        name: dataplane-1.kuma-demo
        kri: kri_dp_default_zone-1_kuma-demo_dataplane-1_
        labels:
          kuma.io/display-name: dataplane-1
      """
    And the URL "/meshes/default/dataplanes/dataplane-1.kuma-demo/_overview" responds with
      """
      body:
        name: dataplane-1.kuma-demo
        kri: kri_dp_default_zone-1_kuma-demo_dataplane-1_
        mesh: default
        labels:
          k8s.kuma.io/namespace: kuma-demo
          kuma.io/display-name: dataplane-1
          kuma.io/zone: zone-1
          kuma.io/origin: zone
          kuma.io/listener-zoneingress: enabled
          kuma.io/listener-zoneegress: enabled
        dataplane:
          networking:
            inbound:
              - tags:
                  kuma.io/zone: zone-1
      """

  Scenario: The about section has the expected content
    When I visit the "/meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_dataplane-1_/overview" URL
    Then the "$about-section" element exists
    And the "$about-section" element contains "zone-1"
    And the "$about-section" element contains "kuma.io/origin:zone"
    And the "$about-section" element contains "ZoneIngress"
    And the "$about-section" element contains "ZoneEgress"
