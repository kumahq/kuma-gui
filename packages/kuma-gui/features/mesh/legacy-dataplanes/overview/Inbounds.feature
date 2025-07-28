Feature: mesh / dataplanes / connections / Inbounds

  Background:
    Given the CSS selectors
      | Alias       | Selector                                    |
      | detail-view | [data-testid='data-plane-detail-tabs-view'] |
      | traffic     | [data-testid='dataplane-traffic']           |
      | inbound     | [data-testid='dataplane-inbound']           |
      | outbound    | [data-testid='dataplane-outbound']          |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: false
      """

  Scenario: An inbound with port 49151 isn't shown
    Given the environment
      """
      KUMA_DATAPLANEINBOUND_COUNT: 1
      KUMA_DATAPLANE_TYPE: standard
      """
    And the URL "/meshes/default/dataplanes/service-less/_overview" responds with
      """
      body:
        dataplane:
          networking:
            inbound:
              - port: 49151
      """
    When I visit the "/meshes/default/data-planes/service-less/overview" URL
    And the "$detail-view" element contains "service-less"
    And the "$traffic" element exists
    And the "$inbound" element exists 0 times

  Scenario: Delegated gateways show no inbounds
    Given the environment
      """
      KUMA_DATAPLANE_TYPE: delegated
      """
    When I visit the "/meshes/default/data-planes/delegated/overview" URL
    And the "$detail-view" element contains "delegated"
    And the "$traffic" element exists
    And the "$inbound" element exists 0 times
