Feature: Zones: Create Zone flow
  Background:
    Given the CSS selectors
      | Alias                               | Selector                                             |
      | zone-nav-item                       | .app-sidebar > .nav-item:nth-child(2) > a            |
      | exit-button                         | [data-testid='exit-button']                          |
      | confirm-exit-modal                  | [data-testid='confirm-exit-modal']                   |
      | confirm-exit-button                 | [data-testid='confirm-exit-button']                  |
      | name-input                          | [data-testid='name-input']                           |
      | name-input-invalid-dns-name         | $name-input[data-test-error-type='invalid-dns-name'] |
      | create-zone-button                  | [data-testid='create-zone-button']                   |
      | create-zone-link                    | [data-testid='create-zone-link']                     |
      | environment-universal-radio-button  | [data-testid='environment-universal-radio-button']   |
      | environment-kubernetes-radio-button | [data-testid='environment-kubernetes-radio-button']  |
      | ingress-input-switch                | [for='zone-ingress-enabled']                         |
      | egress-input-switch                 | [for='zone-egress-enabled']                          |
      | zone-connected-scanner              | [data-testid='zone-connected-scanner']               |
      | error                               | [data-testid='create-zone-error']                    |
      | instructions                        | [data-testid='connect-zone-instructions']            |
    And the environment
      """
      KUMA_MODE: global
      """

  Scenario: Create Zone link doesn't exist in standalone mode
    Given the environment
      """
      KUMA_MODE: standalone
      """

    When I visit the "/" URL
    Then the "[data-testid='loading-block']" element doesn't exist
    And I click the "$zone-nav-item" element

    Then the page title contains "Egresses"
    And the "$create-zone-link" element doesn't exist

  Scenario: Create Zone link exists in global mode
    Given the environment
      """
      KUMA_MODE: global
      """

    When I visit the "/" URL
    Then the "[data-testid='loading-block']" element doesn't exist
    And I click the "$zone-nav-item" element

    Then the page title contains "Zone Control Planes"
    And the "$create-zone-link" element exists

    When I click the "$create-zone-link" element
    Then the page title contains "Create & connect Zone"

  Scenario: The form shows only the initial elements
    When I visit the "/zones/create" URL
    Then the "$name-input" element exists
    Then the "$create-zone-button" element is disabled

    Then the "$environment-universal-radio-button" element doesn't exist
    Then the "$environment-kubernetes-radio-button" element doesn't exist
    Then the "$ingress-input-switch" element doesn't exist
    Then the "$egress-input-switch" element doesn't exist

  Scenario: The form interactions behave correctly
    When I visit the "/zones/create" URL
    Then the "$create-zone-button" element is disabled

    When I "type" "test" into the "$name-input" element
    Then the "$create-zone-button" element isn't disabled

    When the URL "/provision-zone" responds with
      """
      body:
        token: spat_595QOxTSreRmrtdh8ValuoeUAzXMfBmRwYU3V35NQvwgLAWIU
      """
    And the URL "/zones+insights/test" responds with
      """
      body:
        zoneInsight:
          subscriptions: []
      """
    And I click the "$create-zone-button" element
    Then the URL "/provision-zone" was requested with
      """
      method: POST
      body:
        name: test
      """
    Then the "$environment-universal-radio-button" element isn't checked
    Then the "$environment-kubernetes-radio-button" element is checked
    Then the "$ingress-input-switch input" element is checked
    Then the "$egress-input-switch input" element is checked
    Then the "$zone-connected-scanner[data-test-state='waiting']" element exists

    When I click the "$ingress-input-switch" element
    Then the "$ingress-input-switch input" element isn't checked
    Then the "$egress-input-switch input" element is checked

    When I click the "$egress-input-switch" element
    Then the "$ingress-input-switch input" element isn't checked
    Then the "$egress-input-switch input" element isn't checked

    When I click the "$environment-universal-radio-button + label" element
    Then the "$ingress-input-switch input" element doesn't exist
    Then the "$egress-input-switch input" element doesn't exist

    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 1
      """
    When the URL "/zones+insights/test" responds with
      """
      body:
        zoneInsight:
          subscriptions:
            - connectTime: '2020-07-28T16:18:09.743141Z'
              disconnectTime: ~
              status: {}
      """
    Then the "$zone-connected-scanner[data-test-state='success']" element exists

  Scenario: The form shows expected error for 409 response
    Given the URL "/provision-zone" responds with
      """
      headers:
        Status-Code: '409'
      """

    When I visit the "/zones/create" URL
    And I "type" "test" into the "$name-input" element
    And I click the "$create-zone-button" element

    Then the "$error" element exists
    Then the "$instructions" element doesn't exist

  Scenario: The form shows expected error for 400 response
    Given the URL "/provision-zone" responds with
      """
      headers:
        Status-Code: '400'
      body:
        type: '/std-errors'
        status: 400
        title: 'Invalid zone name'
        detail: 'Resource is not valid'
        invalid_parameters:
          - field: 'name'
            reason: "invalid characters. Valid characters are numbers, lowercase latin letters and '-', '_' symbols."
      """

    When I visit the "/zones/create" URL
    # Note: We're deliberately using a valid name here in order to not trigger client-side validation.
    And I "type" "test" into the "$name-input" element
    And I click the "$create-zone-button" element

    Then the "$name-input-invalid-dns-name" element exists
    And the "$instructions" element doesn't exist

  Scenario: The form shows expected error for client-side name validation
    When I visit the "/zones/create" URL
    And I "type" "zone.eu" into the "$name-input" element
    And I click the "$create-zone-button" element

    Then the "$error" element doesn't exist
    And the "$name-input-invalid-dns-name" element exists
    And the "$instructions" element doesn't exist

    When I clear the "$name-input" element
    And I "type" "test" into the "$name-input" element
    And I click the "$create-zone-button" element

    Then the "$error" element doesn't exist
    And the "$instructions" element exists

  Scenario: Exiting the form in a safe state without confirm dialog
    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 1
      """
    And the URL "/provision-zone" responds with
      """
      body:
        token: spat_595QOxTSreRmrtdh8ValuoeUAzXMfBmRwYU3V35NQvwgLAWIU
      """
    And the URL "/zones+insights/test" responds with
      """
      body:
        zoneInsight:
          subscriptions:
            - connectTime: '2020-07-28T16:18:09.743141Z'
              disconnectTime: ~
              status: {}
      """

    When I visit the "/zones/create" URL
    And I "type" "test" into the "$name-input" element
    And I click the "$create-zone-button" element

    Then the "$instructions" element exists
    And the "$zone-connected-scanner[data-test-state='success']" element exists

    When I click the "$exit-button" element

    Then the "$confirm-exit-modal" element doesn't exist
    And the page title contains "Zone Control Planes"

  Scenario: Exiting the form in an unsafe state with confirm dialog
    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 0
      """
    And the URL "/provision-zone" responds with
      """
      body:
        token: spat_595QOxTSreRmrtdh8ValuoeUAzXMfBmRwYU3V35NQvwgLAWIU
      """
    And the URL "/zones+insights/test" responds with
      """
      body:
        zoneInsight:
          subscriptions: []
      """

    When I visit the "/zones/create" URL
    And I "type" "test" into the "$name-input" element
    And I click the "$create-zone-button" element

    Then the "$instructions" element exists
    And the "$zone-connected-scanner[data-test-state='waiting']" element exists

    When I click the "$exit-button" element

    Then the "$confirm-exit-modal" element exists

    When I click the "$confirm-exit-button" element

    Then the "$confirm-exit-modal" element doesn't exist
    And the page title contains "Zone Control Planes"
