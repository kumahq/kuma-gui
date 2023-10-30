Feature: Overview: Detail view content
  Background:
    Given the CSS selectors
      | Alias                       | Selector                                    |
      | details                     | [data-testid='detail-view-details']         |
      | zone-control-planes-details | [data-testid='zone-control-planes-details'] |
      | meshes-details              | [data-testid='meshes-details']              |
    And the URL "/mesh-insights" responds with
      """
      body:
        items:
          - name: mesh-1
            services:
              external:
                total: 0
              internal:
                total: 5
                online: 3
                partiallyDegraded: 1
                offline: 1
            dataplanesByType:
              standard:
                total: 3
                online: 1
                partiallyDegraded: 1
                offline: 1
          - name: mesh-2
            services:
              external:
                total: 0
              internal:
                total: 5
                online: 5
                partiallyDegraded: 0
                offline: 0
            dataplanesByType:
              standard:
                total: 3
                online: 3
                partiallyDegraded: 0
                offline: 0
          - name: mesh-3
            services:
              external:
                total: 4
              internal:
                total: 5
                online: 5
                partiallyDegraded: 0
                offline: 0
            dataplanesByType:
              standard:
                total: 3
                online: 3
                partiallyDegraded: 0
                offline: 0
      """

  Scenario: Shows expected content in standalone mode
    Given the environment
      """
      KUMA_MESH_COUNT: 3
      KUMA_MODE: standalone
      """
    And the URL "/global-insight" responds with
      """
      body:
        dataplanes:
          standard:
            total: 9
            online: 7
            partiallyDegraded: 1
            offline: 1
        meshes:
          total: 3
        services:
          external:
            total: 4
          internal:
            total: 15
            online: 9
            partiallyDegraded: 3
            offline: 3
        zones:
          controlPlanes:
            total: 1
            online: 1
      """

    When I visit the "/" URL
    Then the page title contains "Overview"
    And the "$details" element exists

    And the "[data-testid='zone-control-planes-status']" element doesn't exist
    And the "[data-testid='meshes-status']" element contains "3"
    And the "[data-testid='services-status']" element contains "9/15"
    And the "[data-testid='data-plane-proxies-status']" element contains "7/9"

    And the "$zone-control-planes-details" element doesn't exists
    And the "$meshes-details" element exists

  Scenario: Shows expected content in global mode
    Given the environment
      """
      KUMA_ZONE_COUNT: 2
      KUMA_MESH_COUNT: 3
      KUMA_MODE: global
      """
    And the URL "/global-insight" responds with
      """
      body:
        dataplanes:
          standard:
            total: 9
            online: 7
            partiallyDegraded: 1
            offline: 1
        meshes:
          total: 3
        services:
          external:
            total: 4
          internal:
            total: 15
            online: 9
            partiallyDegraded: 3
            offline: 3
        zones:
          controlPlanes:
            total: 2
            online: 1
      """
    And the URL "/zones/_overview" responds with
      """
      body:
        items:
          - name: zone-cp-1
            zone:
              enabled: true
            zoneInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  config: '{"environment":"universal"}'
                - connectTime: 2020-07-28T16:18:09.743141Z
                  config: '{"environment":"universal"}'
          - name: zone-cp-2
            zone:
              enabled: true
            zoneInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  config: '{"environment":"kubernetes"}'
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  config: '{"environment":"kubernetes"}'
      """

    When I visit the "/" URL

    Then the page title contains "Overview"
    And the "$details" element exists

    And the "[data-testid='zone-control-planes-status']" element contains "1/2"
    And the "[data-testid='meshes-status']" element contains "3"
    And the "[data-testid='services-status']" element contains "9/15"
    And the "[data-testid='data-plane-proxies-status']" element contains "7/9"

    And the "$zone-control-planes-details" element exists
    And the "$meshes-details" element exists
