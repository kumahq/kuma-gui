Feature: Zone Egress summary
  Background:
    Given the CSS selectors
      | Alias                | Selector                                        |
      | item                 | [data-testid='zone-egress-collection'] tbody tr |
      | summary              | [data-testid='summary']                         |
      | close-summary-button | $summary [data-testid^='close-button-']         |
    And the URL "/zoneegresses/_overview" responds with
      """
      body:
        items:
          - name: zone-egress-1
            zoneEgress:
              zone: zone-1
      """

  Scenario: Clicking a row opens the summary
    Given the environment
      """
      KUMA_ZONEEGRESS_COUNT: 1
      """

    When I visit the "/zones/zone-1/egresses" URL
    And I click the "$item:nth-child(1) td:nth-child(2)" element
    Then the "$summary" element exists
    And the "$summary" element contains "zone-egress-1"

    When I click the "$close-summary-button" element
    Then the "$summary" element doesn't exist

    When I navigate "back"
    Then the "$summary" element exists
    And the "$summary" element contains "zone-egress-1"

    When I navigate "forward"
    Then the "$summary" element doesn't exist

  Scenario: Summary URL goes to page with open summary
    Given the environment
      """
      KUMA_ZONEEGRESS_COUNT: 51
      """

    When I visit the "/zones/zone-1/egresses/zone-egress-1?page=2&size=50" URL
    Then the "$summary" element exists
