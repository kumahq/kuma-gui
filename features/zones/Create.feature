Feature: The create Zone flow works
  Background:
    Given the CSS selectors
      | Alias                               | Selector                                            |
      | name-input                          | [data-testid='name-input']                          |
      | create-zone-button                  | [data-testid='create-zone-button']                  |
      | environment-universal-radio-button  | [data-testid='environment-universal-radio-button']  |
      | environment-kubernetes-radio-button | [data-testid='environment-kubernetes-radio-button'] |
      | ingress-input-switch                | [for='zone-ingress-enabled']                |
      | egress-input-switch                 | [for='zone-egress-enabled']                 |
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

    When the URL "/zones+insights/test" responds with
      """
      body:
        zoneInsight:
          subscriptions:
            - connectTime: '2020-07-28T16:18:09.743141Z'
      """
    Then the "$zone-connected-scanner" element contains "The Zone “test” is now connected"
