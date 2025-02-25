Feature: Zone Egress summary

  Background:
    Given the CSS selectors
      | Alias                | Selector                                        |
      | item                 | [data-testid='zone-egress-collection'] tbody tr |
      | summary              | [data-testid='summary']                         |
      | close-summary-button | $summary [data-testid='slideout-close-icon']    |
      | select-preference    | $summary [data-testid='select-input']           |
      | structured-view      | $summary [data-testid='structured-view']        |
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

  Scenario: Switching to universal format and back
    Given the environment
      """
      KUMA_ZONEEGRESS_COUNT: 1
      """
    When I visit the "/zones/zone-1/egresses/zone-egress-1" URL
    Then the "$select-preference" element exists
    And the "$structured-view" element exists
    When I click the "$select-preference" element
    When I click the "[data-testid='select-item-universal'] button" element
    Then the URL contains "format=universal"
    And the "[data-testid='k-code-block']" element exists
    And the "$structured-view" element doesn't exists
    When I click the "$select-preference" element
    When I click the "[data-testid='select-item-structured'] button" element
    Then the URL contains "format=structured"
    And the "$structured-view" element exists
