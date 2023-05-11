Feature: The create Zone flow works
  Background:
    Given the CSS selectors
      | Alias                               | Selector                                            |
      | name-input                          | [data-testid='name-input']                          |
      | create-zone-button                  | [data-testid='create-zone-button']                  |
      | environment-universal-radio-button  | [data-testid='environment-universal-radio-button']  |
      | environment-kubernetes-radio-button | [data-testid='environment-kubernetes-radio-button'] |
      | ingress-input-switch                | [data-testid='ingress-input-switch']                |
      | egress-input-switch                 | [data-testid='egress-input-switch']                 |
    When I visit the "/zones/create-zone" URL

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

    When I click the "$create-zone-button" element
    Then the "$environment-universal-radio-button" element isn't checked
    Then the "$environment-kubernetes-radio-button" element is checked
    Then the "$ingress-input-switch" element is checked
    Then the "$egress-input-switch" element is checked

    When I click the "$ingress-input-switch" element
    Then the "$ingress-input-switch" element isn't checked
    Then the "$egress-input-switch" element is checked

    When I click the "$egress-input-switch" element
    Then the "$ingress-input-switch" element isn't checked
    Then the "$egress-input-switch" element isn't checked

    When I click the "$environment-universal-radio-button" element
    Then the "$ingress-input-switch" element doesn't exist
    Then the "$egress-input-switch" element doesn't exist
