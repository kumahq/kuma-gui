Feature: mesh / dataplanes / overview / summary / Listener

  Background:
    Given the CSS selectors
      | Alias   | Selector                           |
      | summary | [data-testid='slideout-container'] |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      KUMA_MESHSERVICE_MODE: Exclusive
      KUMA_DATAPLANELISTENER_COUNT: 1
      KUMA_DATAPLANE_TYPE: standard
      """

  # Note: A listener is currently treated exactly like an inbound
  Scenario: Listener summary overview shows expected content
    Given the URL "/meshes/default/dataplanes/service-less/_layout" responds with
      """
      body:
        listeners:
          - kri: kri_dp_default_numeric_kuma-system_service-less_12345
            port: 12345
            proxyResourceName: self_zoneingress_dp_12345
            type: ZoneIngress
      """
    And the URL "/meshes/default/dataplanes/service-less/_overview" responds with
      """
      body:
        dataplane:
          networking:
            listeners:
              - name: "12345"
                port: 12345
                type: ZoneIngress
                address: 10.244.0.21
      """
    When I visit the "/meshes/default/data-planes/service-less/overview/inbound/self_zoneingress_dp_12345/overview" URL
    And the "$summary" element exists
    And the "$summary" element contains "Inbound :12345"
    And the "$summary" element contains "TCP"
    And the "$summary" element contains "10.244.0.21"
    And the "$summary" element contains "12345"
