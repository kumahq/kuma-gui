Feature: mesh / gateways / index
  Background:
    Given the CSS selectors
      | Alias            | Selector                                |
      | select-type      | [data-testid='k-select-input']          |
      | select-option    | .k-select-item                          |
      | select-builtin   | [data-testid='k-select-item-builtin']   |
      | select-delegated | [data-testid='k-select-item-delegated'] |
      | items            | [data-testid='gateway-collection']      |
      | item-header      | $items th                               |
      | item             | $items tbody tr                         |

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
    Then the "$item-header" elements contain
      | Value        |
      | Name         |
      | Type         |
      | Service      |
      | Zone         |
      | Last Updated |
      | Status       |
      | Warnings     |

  Scenario: The Gateway listing has the expected content and UI elements
    When I click the "$select-type" element
    Then the "$select-option" element exists 3 times
    Then the "$item" element exists 2 times
    Then the "$item:nth-child(1)" element contains
      | Value                |
      | fake-alarm-gateway-0 |
      | DELEGATED            |
    Then the "$item:nth-child(2)" element contains
      | Value                      |
      | fake-transmitter-gateway-0 |
      | BUILTIN                    |


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
      When I click the "$select-type" element
      Then the "$select-option" element exists 3 times
      And I click the "$select-builtin" element
      Then the URL "/meshes/default/dataplanes+insights" was requested with
        """
        searchParams:
          gateway: builtin
        """
      Then the "$item" element exists 1 time
      Then the "$item:nth-child(1)" element contains
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
      When I click the "$select-type" element
      Then the "$select-option" element exists 3 times
      And I click the "$select-delegated" element
      Then the URL "/meshes/default/dataplanes+insights" was requested with
        """
        searchParams:
          gateway: delegated
        """
      Then the "$item" element exists 1 time
      Then the "$item:nth-child(1)" element contains
        | Value                |
        | fake-alarm-gateway-0 |
        | DELEGATED            |
