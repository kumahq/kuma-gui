Feature: legacy-services / mesh / dataplanes / index

  Background:
    Given the CSS selectors
      | Alias                 | Selector                              |
      | table                 | [data-testid='data-plane-collection'] |
      | item                  | $table tbody tr                       |
      | service-link-internal | $table a[href*='services/internal']   |
    And the environment
      """
      KUMA_LEGACY_SERVICES_ENABLED: true
      KUMA_MODE: global
      KUMA_DATAPLANE_COUNT: 1
      KUMA_DATAPLANEINBOUND_COUNT: 1
      """
    And the URL "/meshes/default/dataplanes/_overview" responds with
      """
      body:
        items:
          - name: fake-backend
            mesh: default
            labels:
              kuma.io/display-name: fake-backend
            dataplane:
              networking:
                gateway: !!js/undefined
                inbound:
                  - tags:
                      kuma.io/service: service-1
                    state: Ready
      """

  Scenario: With legacy services enabled a standard proxy links its service to the legacy internal service detail
    When I visit the "/meshes/default/data-planes" URL
    Then the "$item:nth-child(1)" element contains "service-1"
    And the "$service-link-internal" element exists
