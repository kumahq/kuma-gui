Feature: Zones: Zone create flow
  Background:
    Given the CSS selectors
      | Alias                               | Selector                                            |
      | name-input                          | [data-testid='name-input']                          |
      | create-zone-button                  | [data-testid='create-zone-button']                  |
      | create-zone-error                   | [data-testid='create-zone-error']                   |
      | connect-zone-instructions           | [data-testid='connect-zone-instructions']           |
      | environment-universal-radio-button  | [data-testid='environment-universal-radio-button']  |
      | environment-kubernetes-radio-button | [data-testid='environment-kubernetes-radio-button'] |
      | ingress-input-switch                | [for='zone-ingress-enabled']                        |
      | egress-input-switch                 | [for='zone-egress-enabled']                         |
      | zone-connected-scanner              | [data-testid='zone-connected-scanner']              |
    When I visit the "/zones/create" URL

  Scenario: The form shows only the initial elements
    Then the "$name-input" element exists
    Then the "$create-zone-button" element is disabled

    Then the "$environment-universal-radio-button" element doesn't exist
    Then the "$environment-kubernetes-radio-button" element doesn't exist
    Then the "$ingress-input-switch" element doesn't exist
    Then the "$egress-input-switch" element doesn't exist

  Scenario: The form interactions behave correctly
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
    Then the "$zone-connected-scanner" element contains "Waiting for Zone to be connected"

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
    Then the "$zone-connected-scanner" element contains "The Zone “test” is now connected"

  Scenario: The form shows expected error for <StatusCode> response
    When the URL "/provision-zone" responds with
      """
      headers:
        Status-Code: '<StatusCode>'
      """
    And I "type" "test" into the "$name-input" element
    And I click the "$create-zone-button" element

    Then the "$create-zone-button" element is <CreateButtonAssertion>
    And the "$create-zone-error" element contains "<ErrorTitle>"
    And the "$connect-zone-instructions" element doesn't exist

    Examples:
      | StatusCode | CreateButtonAssertion | ErrorTitle                                     |
      | 400        | enabled               | The Zone name test is invalid                  |
      | 409        | disabled              | A Zone with the name test already exists       |
      | 500        | enabled               | An error occurred while creating the Zone test |
