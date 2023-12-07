Feature: Dataplane details for standard Data Plane Proxy
  Background:
    Given the CSS selectors
      | Alias         | Selector                                    |
      | detail-view   | [data-testid='data-plane-detail-tabs-view'] |
      | clusters-view | [data-testid='data-plane-clusters-view']    |
      | overview-tab  | #data-plane-detail-view-tab a               |
      | clusters-tab  | #data-plane-clusters-view-tab a             |
      | warnings      | [data-testid='dataplane-warnings']          |
      | details       | [data-testid='dataplane-details']           |
      | inbounds      | [data-testid='dataplane-inbounds']          |
      | subscriptions | [data-testid='dataplane-subscriptions']     |
      | status-cds    | [data-testid='subscription-status-cds']     |
      | status-eds    | [data-testid='subscription-status-eds']     |
      | status-lds    | [data-testid='subscription-status-lds']     |
      | status-rds    | [data-testid='subscription-status-rds']     |
    And the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 2
      KUMA_DATAPLANEINBOUND_COUNT: 1
      KUMA_MODE: global
      """
    And the URL "/meshes/default/dataplanes/dpp-1-name-of-dataplane/_overview" responds with
      """
      body:
        mesh: default
        dataplane:
          networking:
            address: 193.107.134.106
            advertisedAddress: !!js/undefined
            gateway: !!js/undefined
            inbound:
              - health:
                  ready: true
                address: !!js/undefined
                port: 1328
                serviceAddress: 44.167.201.218
                servicePort: 62098
                tags:
                  kuma.io/protocol: http
                  kuma.io/zone: zone-1
        dataplaneInsight:
          mTLS: !!js/undefined
          subscriptions:
            - controlPlaneInstanceId: 'dpp-1-cp-instance-id'
              connectTime: 2021-02-17T07:33:36.412683Z
              disconnectTime: 2021-02-17T07:33:36.412683Z
              version:
                kumaDp:
                  version: 1.0.7
                  kumaCpCompatible: false
                envoy:
                  kumaDpCompatible: false
            - controlPlaneInstanceId: 'dpp-1-cp-instance-id'
              connectTime: 2021-02-17T07:33:36.412683Z
              disconnectTime: !!js/undefined
              status:
                total:
                  responsesSent: '12'
                  responsesAcknowledged: '10'
                cds:
                  responsesSent: '2'
                  responsesAcknowledged: '1'
                eds:
                  responsesSent: '4'
                  responsesAcknowledged: '3'
                lds:
                  responsesSent: '6'
                  responsesAcknowledged: '6'
                rds: {}
              version:
                kumaDp:
                  version: 1.0.8
                  kumaCpCompatible: true
                envoy:
                  kumaDpCompatible: true
      """

    When I visit the "/meshes/default/data-planes/dpp-1-name-of-dataplane/overview" URL

  Scenario: Overview tab has expected content
    Then the page title contains "dpp-1-name-of-dataplane"
    And the "$detail-view" element contains "dpp-1-name-of-dataplane"
    And the "$details" element contains "online"
    And the "$inbounds" element contains
      | Value                 |
      | healthy               |
      | 193.107.134.106:1328  |
      | 44.167.201.218:62098  |
      | kuma.io/protocol:http |
      | kuma.io/zone:zone-1   |
    And the "$warnings" element doesn't exist
    And the "$subscriptions" element contains "Connected: Feb 17, 2021, 7:33 AM"
    And the "$subscriptions" element contains "CP instance ID: dpp-1-cp-instance-id"

    When I click the ".accordion-item:nth-child(1) [data-testid='accordion-item-button']" element

    Then the "$status-cds" element contains
      | Value |
      | CDS   |
      | 1     |
      | 2     |
    And the "$status-eds" element contains
      | Value |
      | EDS   |
      | 3     |
      | 4     |
    And the "$status-lds" element contains
      | Value |
      | LDS   |
      | 6     |
    And the "$status-rds" element contains
      | Value |
      | RDS   |
      | 0     |

  Scenario: Clusters tab has expected content
    Given the URL "/meshes/default/dataplanes/dpp-1-name-of-dataplane/clusters" responds with
      """
      body:
        access_log_sink::observability_name::access_log_sink
        access_log_sink::default_priority::max_connections::1024
        access_log_sink::default_priority::max_pending_requests::1024
        access_log_sink::default_priority::max_requests::1024
      """

    When I click the "$clusters-tab" element

    Then the "$clusters-view" element contains "access_log_sink::observability_name::access_log_sink"
