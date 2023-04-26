Feature: mesh / gateways / index
  Background:
    Given the CSS selectors
      | Alias        | Selector                                |
      | select-type  | [data-testid="data-planes-type-filter"] |
      | table        | [data-testid='data-overview-table']     |
      | table-header | $table th                               |
      | table-row    | $table tbody tr                         |
      | item-title   | [data-testid='data-overview-table']     |

    Given the environment
      """
        KUMA_DATAPLANE_COUNT: 2
      """
    And the URL "/meshes/default/dataplanes+insights" responds with
      """
      body:
        items:
        - name: fake-alarm-gateway-0
          dataplane:
            networking:
              gateway:
                type: 'DELEGATED'
        - name: fake-transmitter-gateway-0
          dataplane:
            networking:
              gateway:
                type: 'BUILTIN'
      """
    When I visit the "/mesh/default/gateways" URL

  Scenario: The Gateway listing table has the correct columns
    Then the "$table-header" elements contain
      | Value           |
      | Status          |
      | DPP             |
      | Type            |
      | Service         |
      | Zone            |
      | Last Updated    |
      | Kuma DP version |
      | Details         |

  Scenario: The Gateway listing has the expected content and UI elements
    Then the "$select-type option" element exists 3 times
    Then the "$table-row" element exists 2 times
    Then the "$table-row:nth-child(1)" element contains
      | Value                |
      | fake-alarm-gateway-0 |
      | DELEGATED            |
    Then the "$table-row:nth-child(2)" element contains
      | Value                      |
      | fake-transmitter-gateway-0 |
      | BUILTIN                    |

  Scenario: The Gateway listing shows information of selected gateway when clicked
    Then the "$item-title" element contains "fake-alarm-gateway-0"
    Then the URL contains "gateway=fake-alarm-gateway-0"
    Then the "$table-row:nth-child(2)" element contains "fake-transmitter-gateway-0-break-the-thing-again"
    Then the "$table-row:nth-child(2):not(.is-selected)" element exists
    When I "click" on the "$table-row:nth-child(2) td:first-child" element
    Then the "$table-row:nth-child(2).is-selected" element exists
    Then the "$item-title" element contains "fake-transmitter-gateway-0"
    Then the URL contains "gateway=fake-transmitter-gateway-0"

  Rule: The Gateway listing can filter gateways by type

    Scenario: No filtering
      Then the URL "/meshes/default/dataplanes+insights" was requested with
        """
        searchParams:
          gateway: "true"
        """

    Scenario: Filtering by "builtin"
      Given the environment
      """
        KUMA_DATAPLANE_COUNT: 1
      """
      And the URL "/meshes/default/dataplanes+insights" responds with
        """
        body:
          items:
          - name: fake-transmitter-gateway-0
            dataplane:
              networking:
                gateway:
                  type: 'BUILTIN'
        """
      Then the "$select-type option" element exists 3 times
      Then I "select" 1 on the "$select-type" element
      Then the URL "/meshes/default/dataplanes+insights" was requested with
        """
        searchParams:
          gateway: builtin
        """
      Then the "$table-row" element exists 1 time
      Then the "$table-row:nth-child(1)" element contains
        | Value                      |
        | fake-transmitter-gateway-0 |
        | BUILTIN                    |

    Scenario: Filtering by "delegated"
      Given the environment
      """
        KUMA_DATAPLANE_COUNT: 1
      """
      And the URL "/meshes/default/dataplanes+insights" responds with
        """
        body:
          items:
          - name: fake-alarm-gateway-0
            dataplane:
              networking:
                gateway:
                  type: 'DELEGATED'
        """
      Then I "select" 2 on the "$select-type" element
      Then the URL "/meshes/default/dataplanes+insights" was requested with
        """
        searchParams:
          gateway: delegated
        """
      Then the "$table-row" element exists 1 time
      Then the "$table-row:nth-child(1)" element contains
        | Value                |
        | fake-alarm-gateway-0 |
        | DELEGATED            |

