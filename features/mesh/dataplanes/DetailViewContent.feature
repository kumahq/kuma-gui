Feature: Data Plane Proxies: Detail view content
  Background:
    Given the CSS selectors
      | Alias            | Selector                                                  |
      | detail-view      | [data-testid='data-plane-detail-view']                    |
      | warnings         | [data-testid='data-plane-warnings']                       |
      | overview-tab     | #overview-tab                                             |
      | overview-content | #panel-0                                                  |
      | insights-tab     | #insights-tab                                             |
      | insights-content | #panel-1                                                  |
      | status-cds       | $insights-content [data-testid='subscription-status-cds'] |
      | status-eds       | $insights-content [data-testid='subscription-status-eds'] |
      | status-lds       | $insights-content [data-testid='subscription-status-lds'] |
      | status-rds       | $insights-content [data-testid='subscription-status-rds'] |
    And the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 2
      """
    And the URL "/config" responds with
      """
      body:
        mode: global
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
    Then the page title contains "dpp-1 Data Plane Proxy"
    And the "$detail-view" element contains "dpp-1 Data Plane Proxy"

    And the "$overview-content" element contains "online"
    And the "$overview-content" element contains "dpp-1"
    And the "$overview-content" element contains "kuma.io/protocol:http"
    And the "$overview-content" element contains "kumaDp:1.0.8"
    And the "$warnings" element doesn't exist

    When I click the "$insights-tab" element
    Then the "$insights-content" element contains "Connect time: Feb 17, 2021, 7:33 AM"
    Then the "$insights-content" element contains "CP instance ID: dpp-1-cp-instance-id"

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
