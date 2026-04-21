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
    And the URL "/_kri/kri_zi__zone-1_kuma-system_item-1_" responds with
      """
      body:
        name: item-1
        kri: kri_zi__zone-1_kuma-system_item-1_
        labels:
          kuma.io/display-name: item-1
      """

  Scenario Outline: An ingress with 2 available services
    Given the URL "/zone-ingresses/item-1/_overview" responds with
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
    When I visit the "/zones/zone-cp-1/ingresses/<Name>/services" URL
    Then the "$item" element exists 2 times

    Examples:
      | Name             |
      | item-1           |
      | kri_zi__zone-1_kuma-system_item-1_ |
