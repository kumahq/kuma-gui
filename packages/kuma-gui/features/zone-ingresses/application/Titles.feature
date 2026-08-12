Feature: zone-ingresses / application / titles

  Background:
    Given the environment
      """
      KUMA_ZONE_INGRESSES_ENABLED: true
      """

  Scenario Outline: Visiting "<URL>" page in "global" Mode
    Given the environment
      """
      KUMA_MODE: global
      """
    When I visit the "<URL>" URL
    Then the page title contains "<Title>"

    Examples:
      | URL                                                                                       | Title             |
      | /zones/kri_z____zone-cp-name_/ingresses                                                   | Ingresses         |
      | /zones/kri_z____zone-cp-name_/ingresses/kri_zi__zone-cp-name__zone-ingress-name_/overview | zone-ingress-name |
