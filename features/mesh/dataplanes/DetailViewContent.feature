Feature: Data Plane Proxies: Detail view content
  Background:
    Given the CSS selectors
      | Alias                   | Selector                                                                        |
      | detail-view             | [data-testid='data-plane-detail-view']                                          |
      | warnings                | [data-testid='data-plane-warnings']                                             |
      | overview-tab            | #data-plane-detail-view-tab a                                                   |
      | overview-content        | [data-testid='data-plane-detail-view']                                          |
      | status-cds              | $overview-content [data-testid='subscription-status-cds']                       |
      | status-eds              | $overview-content [data-testid='subscription-status-eds']                       |
      | status-lds              | $overview-content [data-testid='subscription-status-lds']                       |
      | status-rds              | $overview-content [data-testid='subscription-status-rds']                       |
      | policies-tab            | #data-plane-policies-view-tab a                                                 |
      | policies-content        | [data-testid='data-plane-policies-view']                                        |
      | policy-list             | [data-testid='policy-list']                                                     |
      | policy-list-item        | $policy-list .accordion-item:nth-child(1) [data-testid='accordion-item-button'] |
      | policy-list-item-button | $policy-list-item [data-testid='accordion-item-button']                         |
      | rule-list               | [data-testid='rule-list']                                                       |
      | rule-list-item          | $rule-list .accordion-item:nth-child(1) [data-testid='accordion-item-button']   |
      | rule-list-item-button   | $rule-list-item [data-testid='accordion-item-button']                           |
      | clusters-tab            | #data-plane-clusters-view-tab a                                                 |
      | clusters-content        | [data-testid='data-plane-clusters-view']                                        |
    And the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 2
      KUMA_MODE: global
      """
    # TODO: Use exact mocking here. It’s almost impossible to control the test data without exact mocking. For example, I need to set `disconnectTime: ''` just so that I don’t risk a faker-random disconnect time appearing in the last subscription.
    And the URL "/meshes/default/dataplanes+insights/dpp-1" responds with
      """
      body:
        name: dpp-1
        mesh: default
        dataplane:
          networking:
            inbound:
              - health:
                  ready: true
                tags:
                  kuma.io/protocol: http
                  kuma.io/zone: zone-1
        dataplaneInsight:
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
              disconnectTime: ''
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
    When I visit the "/mesh/default/data-plane/dpp-1" URL

  Scenario: Data Plane Proxy detail view has expected content
    Then the page title contains "dpp-1"
    And the "$detail-view" element contains "dpp-1"

    And the "$overview-content" element contains "online"
    And the "$overview-content" element contains "dpp-1"
    And the "$overview-content" element contains "kuma.io/protocol:http"
    And the "$overview-content" element contains "kumaDp:1.0.8"
    And the "$warnings" element doesn't exist

    Then the "$overview-content" element contains "Connected: Feb 17, 2021, 7:33 AM"
    Then the "$overview-content" element contains "CP instance ID: dpp-1-cp-instance-id"

    When I click the ".accordion-item:nth-child(1) [data-testid='accordion-item-button']" element

    And the "$status-cds" element contains "CDS"
    And the "$status-cds" element contains "1"
    And the "$status-cds" element contains "2"

    And the "$status-eds" element contains "EDS"
    And the "$status-eds" element contains "3"
    And the "$status-eds" element contains "4"

    And the "$status-lds" element contains "LDS"
    And the "$status-lds" element contains "6"

    And the "$status-rds" element contains "RDS"
    And the "$status-rds" element contains "0"

  Scenario: Policies tab
    When I click the "$policies-tab" element
    And I click the "$policy-list-item" element
    Then the "$policies-content" element contains "kuma.io/service:service-a"

    When I click the "$rule-list-item" element
    Then the "$policies-content" element contains "kuma.io/service:demo-app_kuma-demo_svc_5000"

  Scenario: Envoy data
    Given the URL "/meshes/default/dataplanes/dpp-1/clusters" responds with
      """
      body:
        access_log_sink::observability_name::access_log_sink
        access_log_sink::default_priority::max_connections::1024
        access_log_sink::default_priority::max_pending_requests::1024
        access_log_sink::default_priority::max_requests::1024
      """
    When I click the "$clusters-tab" element
    Then the "$clusters-content" element contains "access_log_sink::observability_name::access_log_sink"
