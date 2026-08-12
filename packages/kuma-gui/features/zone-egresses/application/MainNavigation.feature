Feature: zone-egresses / application / MainNavigation

  Background:
    Given the environment
      """
      KUMA_ZONE_EGRESSES_ENABLED: true
      """
    Given the CSS selectors
      | Alias             | Selector                                  |
      | meshes-nav        | [data-testid='meshes-navigator'] a        |
      | zones-nav         | [data-testid='zones-navigator'] a         |
      | zone-egresses-nav | [data-testid='zone-egresses-navigator'] a |

  Scenario Outline: The navigation shows <Element> exists for <Mode>
    Given the environment
      """
      KUMA_MODE: <Mode>
      """
    When I visit the "/" URL
    Then the "<Element>" element exists

    Examples:
      | Element            | Mode   |
      | $zones-nav         | global |
      | $zone-egresses-nav | zone   |

  Scenario Outline: The navigation shows <Element> doesn't exist for <Mode>
    Given the environment
      """
      KUMA_MODE: <Mode>
      """
    When I visit the "/" URL
    Then the "$meshes-nav" element exists but the "<Element>" element doesn't exist

    Examples:
      | Element            | Mode   |
      | $zone-egresses-nav | global |
