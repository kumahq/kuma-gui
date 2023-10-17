Feature: zones / ingresses / item / services
  Background:
    Given the CSS selectors
      | Alias | Selector                                      |
      | items | [data-testid='available-services-collection'] |
      | item  | $items tbody tr                               |

    And the environment
      """
      KUMA_MODE: global
      KUMA_SERVICE_COUNT: 2
      """

  Scenario: An ingress with 2 available services
    Given the URL "/zoneingresses+insights/item-1" responds with
      """
      body:
        zoneIngress:
          zone: zone-cp-1
          availableServices:
            - tags:
                kuma.io/service: service-1
            - tags:
                kuma.io/service: service-2
      """
    When I visit the "/zones/zone-cp-1/ingresses/item-1/services" URL
    Then the "$item" element exists 2 times

