Feature: Dataplane details for standard Data Plane Proxy

  Background:
    Given the CSS selectors
      | Alias         | Selector                                    |
      | detail-view   | [data-testid='data-plane-detail-tabs-view'] |
      | clusters-view | [data-testid='data-plane-clusters-view']    |
      | warnings      | [data-testid='dataplane-warnings']          |
      | details       | [data-testid='dataplane-details']           |

  Scenario: Overview tab has expected content
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
              - health:
                  ready: true
                address: !!js/undefined
        dataplaneInsight:
          mTLS: !!js/undefined
          subscriptions:
            - connectTime: 2021-02-17T07:33:36.412683Z
              disconnectTime: 2021-02-17T07:33:36.412683Z
            - controlPlaneInstanceId: 'dpp-1-cp-instance-id'
              connectTime: 2021-02-17T07:33:37.412683Z
              disconnectTime: !!js/undefined
      """
    When I visit the "/meshes/default/data-planes/dpp-1-name-of-dataplane/overview" URL
    Then the page title contains "dpp-1-name-of-dataplane"
    And the "$detail-view" element contains "dpp-1-name-of-dataplane"
    And the "$details" element contains "online"

  Scenario: Clusters tab has expected content
    Given the URL "/meshes/default/dataplanes/dpp-1-name-of-dataplane/clusters" responds with
      """
      body:
        access_log_sink::observability_name::access_log_sink
        access_log_sink::default_priority::max_connections::1024
        access_log_sink::default_priority::max_pending_requests::1024
        access_log_sink::default_priority::max_requests::1024
      """
    When I visit the "/meshes/default/data-planes/dpp-1-name-of-dataplane/clusters" URL
    Then the "$clusters-view" element contains "access_log_sink::observability_name::access_log_sink"
