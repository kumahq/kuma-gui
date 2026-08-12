Feature: legacy-services / zones / ingresses / item / service

  Background:
    Given the CSS selectors
      | Alias                 | Selector                                      |
      | items                 | [data-testid='available-services-collection'] |
      | item                  | $items tbody tr                               |
      | service-link-internal | $items a[href*='services/internal']           |
    And the environment
      """
      KUMA_LEGACY_SERVICES_ENABLED: true
      KUMA_ZONE_INGRESSES_ENABLED: true
      KUMA_MODE: global
      KUMA_SERVICE_COUNT: 1
      """
    And the URL "/_kri/kri_zi__zone-1_kuma-system_item-1_" responds with
      """
      body:
        name: item-1.kuma-system
        kri: kri_zi__zone-1_kuma-system_item-1_
        labels:
          kuma.io/display-name: item-1
      """

  Scenario: With legacy services an available service links to the internal service detail
    Given the URL "/zone-ingresses/item-1.kuma-system/_overview" responds with
      """
      body:
        zoneIngress:
          zone: zone-cp-1
          availableServices:
            - mesh: default
              tags:
                kuma.io/service: service-1
      """
    When I visit the "/zones/kri_z____zone-1_/ingresses/kri_zi__zone-1_kuma-system_item-1_/services" URL
    Then the "$item" element exists 1 time
    And the "$service-link-internal" element exists
