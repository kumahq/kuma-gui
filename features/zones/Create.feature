Feature: zones / create
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
      | environment-universal-config        | [data-testid='zone-universal-config']                |
      | environment-kubernetes-config       | [data-testid='zone-kubernetes-config']               |
      | ingress-input-switch                | [for='zone-ingress-enabled']                         |
      | egress-input-switch                 | [for='zone-egress-enabled']                          |
      | waiting                             | [data-testid='waiting']                              |
      | connected                           | [data-testid='connected']                            |
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
    When I visit the "/zones/-create" URL
    Then the "$name-input" element exists
    Then the "$create-zone-button" element is disabled

    Then the "$environment-universal-radio-button" element doesn't exist
    Then the "$environment-kubernetes-radio-button" element doesn't exist
    Then the "$ingress-input-switch" element doesn't exist
    Then the "$egress-input-switch" element doesn't exist

  Scenario: The form interactions behave correctly
    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 0
      """
    And the URL "/provision-zone" responds with
      """
      body:
        token: spat_595QOxTSreRmrtdh8ValuoeUAzXMfBmRwYU3V35NQvwgLAWIU
      """
    When I visit the "/zones/-create" URL
    Then the "$create-zone-button" element is disabled

    When I "type" "test" into the "$name-input" element
    Then the "$create-zone-button" element isn't disabled

    When I click the "$create-zone-button" element
    Then the URL "/provision-zone" was requested with
      """
      method: POST
      body:
        name: test
      """
    And the "$environment-universal-radio-button" element isn't checked
    And the "$environment-kubernetes-radio-button" element is checked
    And the "$ingress-input-switch input" element is checked
    And the "$egress-input-switch input" element is checked
    And the "$environment-kubernetes-config" element contains "kdsGlobalAddress: grpcs://<global-kds-address>:5685"
    And the "$waiting" element exists

    When I click the "$ingress-input-switch" element
    Then the "$ingress-input-switch input" element isn't checked
    And the "$egress-input-switch input" element is checked

    When I click the "$egress-input-switch" element
    Then the "$ingress-input-switch input" element isn't checked
    And the "$egress-input-switch input" element isn't checked

    When I click the "$environment-universal-radio-button + label" element
    Then the "$ingress-input-switch input" element doesn't exist
    And the "$egress-input-switch input" element doesn't exist
    And the "$environment-universal-config" element contains "globalAddress: grpcs://<global-kds-address>:5685"

    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 1
      """
    And the URL "/zones/test/_overview" responds with
      """
      body:
        zoneInsight:
          subscriptions:
            - connectTime: '2020-07-28T16:18:09.743141Z'
              disconnectTime: !!js/undefined
      """
    Then the "$connected" element exists

  Scenario: The form shows expected error for 409 response
    Given the URL "/provision-zone" responds with
      """
      headers:
        Status-Code: '409'
      """

    When I visit the "/zones/-create" URL
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

    When I visit the "/zones/-create" URL
    # Note: We're deliberately using a valid name here in order to not trigger client-side validation.
    And I "type" "test" into the "$name-input" element
    And I click the "$create-zone-button" element

    Then the "$name-input-invalid-dns-name" element exists
    And the "$instructions" element doesn't exist

  Scenario: The form shows expected error for client-side name validation
    When I visit the "/zones/-create" URL
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
    And the URL "/zones/test/_overview" responds with
      """
      body:
        zoneInsight:
          subscriptions:
            - connectTime: '2020-07-28T16:18:09.743141Z'
              disconnectTime: !!js/undefined
      """

    When I visit the "/zones/-create" URL
    And I "type" "test" into the "$name-input" element
    And I click the "$create-zone-button" element

    Then the "$instructions" element exists
    And the "$connected" element exists

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

    When I visit the "/zones/-create" URL
    And I "type" "test" into the "$name-input" element
    And I click the "$create-zone-button" element

    Then the "$instructions" element exists
    And the "$waiting" element exists

    When I click the "$exit-button" element

    Then the "$confirm-exit-modal" element exists

    When I click the "$confirm-exit-button" element

    Then the "$confirm-exit-modal" element doesn't exist
    And the page title contains "Zone Control Planes"
