Feature: mesh / dataplanes / DataplaneDetailsTraffic

  Background:
    Given the CSS selectors
      | Alias     | Selector                            |
      | traffic   | [data-testid='dataplane-traffic']   |
      | inbounds  | [data-testid='dataplane-inbounds']  |
      | outbounds | [data-testid='dataplane-outbounds'] |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      """

  Scenario: Dataplane Details Traffic shows expected content
    Given the environment
      """
      KUMA_DATAPLANEINBOUND_COUNT: 1
      KUMA_DATAPLANEOUTBOUND_COUNT: 1
      """
    And the URL "/meshes/default/dataplanes/dpp-1-name-of-dataplane/_layout" responds with
      """
      body:
        inbounds:
          - kri: kri_dp_default_representation_kuma-system_chow-standard-4-345c47d02-ccrqz.kuma-system_httpport
            port: 8080
            protocol: tcp
            proxyResourceName: self_inbound_httpport
        outbounds:
          - kri: kri_dp_default_parsnip_kuma-system_chow-standard-4-345c47d02-ccrqz.kuma-system_8081
            port: 8081
            protocol: grpc
            proxyResourceName: kri_dp_default_parsnip_kuma-system_chow-standard-4-345c47d02-ccrqz.kuma-system_8081
      """
    When I visit the "/meshes/default/data-planes/dpp-1-name-of-dataplane/overview" URL
    Then the "$traffic" element exists
    And the "$inbounds" element contains "TCP"
    And the "$inbounds" element contains "self_inbound_httpport"
    And the "$outbounds" element contains "gRPC"
    And the "$outbounds" element contains "kri_dp_default_parsnip_kuma-system_chow-standard-4-345c47d02-ccrqz.kuma-system_8081"
