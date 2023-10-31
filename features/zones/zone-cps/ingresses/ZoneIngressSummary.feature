Feature: Zone Ingress summary
  Background:
    Given the CSS selectors
      | Alias                | Selector                                         |
      | item                 | [data-testid='zone-ingress-collection'] tbody tr |
      | summary              | [data-testid='summary']                          |
      | close-summary-button | $summary [data-testid^='close-button-']          |
    And the URL "/zone-ingresses/_overview" responds with
      """
      body:
        items:
          - name: zone-ingress-1
            zoneIngress:
              zone: zone-1
      """

  Scenario: Clicking a row opens the summary
    Given the environment
      """
      KUMA_ZONEINGRESS_COUNT: 1
      """

    When I visit the "/zones/zone-1/ingresses" URL
    And I click the "$item:nth-child(1) td:nth-child(2)" element
    Then the "$summary" element exists
    And the "$summary" element contains "zone-ingress-1"

    When I click the "$close-summary-button" element
    Then the "$summary" element doesn't exist

    When I navigate "back"
    Then the "$summary" element exists
    And the "$summary" element contains "zone-ingress-1"

    When I navigate "forward"
    Then the "$summary" element doesn't exist

  Scenario: Summary URL goes to page with open summary
    Given the environment
      """
      KUMA_ZONEINGRESS_COUNT: 51
      """

    When I visit the "/zones/zone-1/ingresses/zone-ingress-1?page=2&size=50" URL
    Then the "$summary" element exists
