Feature: zone-egresses / application / titles

  Background:
    Given the environment
      """
      KUMA_ZONE_EGRESSES_ENABLED: true
      """

  Scenario Outline: Visiting "<URL>" page in "global" Mode
    Given the environment
      """
      KUMA_MODE: global
      """
    When I visit the "<URL>" URL
    Then the page title contains "<Title>"

    Examples:
      | URL                                                                                     | Title            |
      | /zones/kri_z____zone-cp-name_/egresses                                                  | Egresses         |
      | /zones/kri_z____zone-cp-name_/egresses/kri_ze__zone-cp-name__zone-egress-name_/overview | zone-egress-name |

  Scenario Outline: Visiting the "<Title>" page in "zone" Mode
    Given the environment
      """
      KUMA_MODE: zone
      """
    When I visit the "<URL>" URL
    Then the page title contains "<Title>"

    Examples:
      | URL                                                      | Title            |
      | /zones/egresses                                          | Egresses         |
      | /zones/egresses/kri_ze__zone__zone-egress-name_/overview | zone-egress-name |
