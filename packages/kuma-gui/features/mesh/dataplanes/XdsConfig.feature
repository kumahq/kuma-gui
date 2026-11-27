Feature: mesh / dataplanes / xds-config

  Background:
    Given the environment
      """
      KUMA_MESHSERVICE_MODE: Exclusive
      """
    And the URL "/_kri/kri_dp_mesh-name_zone-1_namespace_service-64cbb7b8b5-6g94n_" responds with
      """
      body:
        name: service-64cbb7b8b5-6g94n.namespace
        kri: kri_dp_mesh-name_zone-1_namespace_service-64cbb7b8b5-6g94n_
        labels:
          kuma.io/display-name: service-64cbb7b8b5-6g94n
      """
    And the URL "/meshes/mesh-name/dataplanes/service-64cbb7b8b5-6g94n.namespace/xds" responds with
      """
      body:
        configs:
          - dynamic_listeners:
              - name: self_inbound_dp_http
      """

  Scenario: The XDS configuration tab shows the configuration as YAML
    Given the CSS selectors
      | Alias | Selector                                                                |
      | code  | [data-testid='data-plane-xds-config-view'] [data-testid='k-code-block'] |
    When I visit the "/meshes/mesh-name/data-planes/kri_dp_mesh-name_zone-1_namespace_service-64cbb7b8b5-6g94n_/xds-config" URL
    Then the "$code" element contains "name: self_inbound_dp_http"

  Scenario: The inbound XDS configuration tab shows the configuration as YAML
    Given the CSS selectors
      | Alias | Selector                                                                                           |
      | code  | [data-testid='data-plane-connection-inbound-summary-xds-config-view'] [data-testid='k-code-block'] |
    And the URL "/meshes/mesh-name/dataplanes/service-64cbb7b8b5-6g94n.namespace/_overview" responds with
      """
      body:
        kri: kri_dp_mesh-name_zone-1_namespace_service-64cbb7b8b5-6g94n_
        dataplane:
          networking:
            inbound:
            - port: 9090
              servicePort: !!js/undefined
      """
    And the URL "/meshes/mesh-name/dataplanes/service-64cbb7b8b5-6g94n.namespace/_layout" responds with
      """
      body:
        inbounds:
          - port: 9090
            kri: kri_dp_default_default_namespace_service-64cbb7b8b5-6g94n.namespace_http
            protocol: http
            proxyResourceName: self_inbound_dp_http
      """
    When I visit the "/meshes/mesh-name/data-planes/kri_dp_mesh-name_zone-1_namespace_service-64cbb7b8b5-6g94n_/overview/inbound/self_inbound_dp_http/xds-config" URL
    Then the "$code" element contains "name: self_inbound_dp_http"
