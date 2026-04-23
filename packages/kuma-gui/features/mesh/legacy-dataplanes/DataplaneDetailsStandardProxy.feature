Feature: Dataplane details for standard Data Plane Proxy

  Background:
    Given the CSS selectors
      | Alias              | Selector                                    |
      | detail-view        | [data-testid='data-plane-detail-tabs-view'] |
      | clusters-view      | [data-testid='data-plane-clusters-view']    |
      | details            | [data-testid='dataplane-details']           |
      | config-universal   | [data-testid='codeblock-yaml-universal']    |
      | config-k8s         | [data-testid='codeblock-yaml-k8s']          |
      | select-environment | [data-testid='select-input']                |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: false
      """
    And the URL "/_kri/kri_dp_default_zone-1_kuma-demo_dpp-1-name-of-dataplane_" responds with
      """
      body:
        name: dpp-1-name-of-dataplane
        kri: kri_dp_default_zone-1_kuma-demo_dpp-1-name-of-dataplane_
        labels:
          kuma.io/display-name: dpp-1-name-of-dataplane
      """

  Scenario Outline: Overview tab has expected content
    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 2
      KUMA_DATAPLANEINBOUND_COUNT: 1
      KUMA_MODE: global
      """
    And the URL "/meshes/default/dataplanes/dpp-1-name-of-dataplane/_overview" responds with
      """
      body:
        dataplane:
          networking:
            advertisedAddress: !!js/undefined
            gateway: !!js/undefined
            inbound:
              - address: !!js/undefined
                state: Ready
        dataplaneInsight:
          mTLS: !!js/undefined
          subscriptions:
            - connectTime: 2021-02-17T07:33:36.412683Z
              disconnectTime: 2021-02-17T07:33:36.412683Z
            - connectTime: 2021-02-17T07:33:37.412683Z
              disconnectTime: !!js/undefined
      """
    When I visit the "/meshes/default/data-planes/<Name>/overview" URL
    Then the page title contains "dpp-1-name-of-dataplane"
    And the "$detail-view" element contains "dpp-1-name-of-dataplane"
    And the "$details" element contains "Online"

    Examples:
      | Name                                                     |
      | dpp-1-name-of-dataplane                                  |
      | kri_dp_default_zone-1_kuma-demo_dpp-1-name-of-dataplane_ |

  Scenario Outline: Clusters tab has expected content
    Given the URL "/meshes/default/dataplanes/dpp-1-name-of-dataplane/clusters" responds with
      """
      body:
        access_log_sink::observability_name::access_log_sink
        access_log_sink::default_priority::max_connections::1024
        access_log_sink::default_priority::max_pending_requests::1024
        access_log_sink::default_priority::max_requests::1024
      """
    When I visit the "/meshes/default/data-planes/<Name>/clusters" URL
    Then the "$clusters-view" element contains "access_log_sink::observability_name::access_log_sink"

    Examples:
      | Name                                                     |
      | dpp-1-name-of-dataplane                                  |
      | kri_dp_default_zone-1_kuma-demo_dpp-1-name-of-dataplane_ |

  Scenario Outline: Shows config with format based on environment
    When I visit the "/meshes/default/data-planes/<Name>/config" URL
    Then the "$config-universal" element exists
    And the URL contains "?environment=universal"
    When I click the "$select-environment" element
    When I click the "[data-testid='select-item-k8s'] button" element
    Then the "$config-k8s" element exists
    And the URL contains "?environment=k8s"

    Examples:
      | Name                                                     |
      | dpp-1-name-of-dataplane                                  |
      | kri_dp_default_zone-1_kuma-demo_dpp-1-name-of-dataplane_ |
