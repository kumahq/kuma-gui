Feature: zones / egresses / index

  Background:
    Given the CSS selectors
      | Alias | Selector                                        |
      | item  | [data-testid='zone-egress-collection'] tbody tr |

  Scenario: List view has expected content in global Mode
    Given the environment
      """
      KUMA_MODE: global
      KUMA_ZONEEGRESS_COUNT: 2
      """
    When I visit the "/zones/zone-cp-1/egresses" URL
    Then the page title contains "Egresses"
    Then the URL "/zoneegresses/_overview" was requested with
      """
      searchParams:
        filter[labels.kuma.io/zone]: "zone-cp-1"
      """

  Scenario: List view has expected content in zone Mode
    Given the environment
      """
      KUMA_MODE: zone
      KUMA_ZONEEGRESS_COUNT: 2
      """
    When I visit the "/zones/egresses" URL
    Then the page title contains "Egresses"
    Then the URL "/zoneegresses/_overview" was not requested with
      """
      searchParams:
        filter[labels.kuma.io/zone]: "zone-cp-1"
      """
