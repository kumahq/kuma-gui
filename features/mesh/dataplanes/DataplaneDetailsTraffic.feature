Feature: Dataplane traffic
  Background:
    Given the CSS selectors
      | Alias           | Selector                                            |
      | detail-view     | [data-testid='data-plane-detail-tabs-view']         |
      | loading-warning | [data-testid='warning-stats-loading']               |
      | traffic         | [data-testid='dataplane-traffic']                   |
      | outbounds       | [data-testid='dataplane-outbounds']                 |
      | inactiveToggle  | [data-testid='dataplane-outbounds-inactive-toggle'] |

  Scenario: Standard sidecar proxy shows the traffic component
    Given the environment
      """
      KUMA_DATAPLANEINBOUND_COUNT: 1
      """
    And the URL "/meshes/default/dataplanes/dpp-1-name-of-dataplane/_overview" responds with
      """
      body:
        dataplane:
          networking:
            gateway: !!js/undefined
      """

    When I visit the "/meshes/default/data-planes/dpp-1-name-of-dataplane/overview" URL

    And the "$detail-view" element contains "dpp-1-name-of-dataplane"
    And the "$traffic" element exists

  Scenario: With no outbound traffic, I have to click the toggle to see outbounds
    Given the environment
      """
      KUMA_DATAPLANEINBOUND_COUNT: 1
      KUMA_SERVICE_COUNT: 1
      """
    And the URL "/meshes/default/dataplanes/dpp-1-name-of-dataplane/_overview" responds with
      """
      body:
        dataplane:
          networking:
            gateway: !!js/undefined
      """
    And the URL "/meshes/default/dataplanes/dpp-1-name-of-dataplane/stats" responds with
      """
      body: |
        tcp.outbound_8888._cx_tx_bytes_total: 0
        tcp.outbound_8888._cx_rx_bytes_total: 0
      """

    When I visit the "/meshes/default/data-planes/dpp-1-name-of-dataplane/overview" URL
    Then the "$detail-view" element contains "dpp-1-name-of-dataplane"
    And the "$traffic" element exists
    And the "$outbounds" element doesn't exist
    When I click the "$inactiveToggle" element
    Then the "$outbounds" element exists

  Scenario: Standard sidecar proxy shows the traffic component and an error warning when _stats fails
    Given the environment
      """
      KUMA_DATAPLANEINBOUND_COUNT: 1
      """
    And the URL "/meshes/default/dataplanes/dpp-1-name-of-dataplane/_overview" responds with
      """
      body:
        dataplane:
          networking:
            gateway: !!js/undefined
      """
    And the URL "/meshes/default/dataplanes/dpp-1-name-of-dataplane/stats" responds with
      """
      headers:
        Status-Code: '504'
      body: upstream request timeout
      """
    When I visit the "/meshes/default/data-planes/dpp-1-name-of-dataplane/overview" URL
    And the "$traffic" element exists
    And the "$loading-warning" element exists

  Scenario: Builtin gateway proxy doesn't show the traffic component
    Given the URL "/meshes/default/dataplanes/dpp-1-name-of-gateway_builtin/_overview" responds with
      """
      body:
        dataplane:
          networking:
            gateway:
              type: BUILTIN
      """

    When I visit the "/meshes/default/data-planes/dpp-1-name-of-gateway_builtin/overview" URL

    And the "$detail-view" element contains "dpp-1-name-of-gateway_builtin"
    And the "$traffic" element doesn't exist

  Scenario: Delegated gateway proxy doesn't show the traffic component
    Given the URL "/meshes/default/dataplanes/dpp-1-name-of-gateway_delegated/_overview" responds with
      """
      body:
        dataplane:
          networking:
            gateway:
              type: DELEGATED
      """

    When I visit the "/meshes/default/data-planes/dpp-1-name-of-gateway_delegated/overview" URL

    And the "$detail-view" element contains "dpp-1-name-of-gateway_delegated"
    And the "$traffic" element doesn't exist
