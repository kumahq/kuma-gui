Feature: gateways / mesh / dataplanes / connections / Inbounds

  Background:
    Given the CSS selectors
      | Alias       | Selector                                    |
      | detail-view | [data-testid='data-plane-detail-tabs-view'] |
      | traffic     | [data-testid='dataplane-traffic']           |
      | inbound     | [data-testid='dataplane-inbound']           |
    And the environment
      """
      KUMA_GATEWAYS_ENABLED: true
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: false
      """
    And the URL "/_kri/kri_dp_default_zone-1_kuma-demo_delegated_" responds with
      """
      body:
        name: delegated.kuma-demo
        kri: kri_dp_default_zone-1_kuma-demo_delegated_
        labels:
          kuma.io/display-name: delegated
      """

  Scenario: Delegated gateways show no inbounds
    Given the environment
      """
      KUMA_DATAPLANE_TYPE: delegated
      """
    When I visit the "/meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_delegated_/overview" URL
    And the "$detail-view" element contains "delegated"
    And the "$traffic" element exists
    And the "$inbound" element exists 0 times
