Feature: Overview: Detail view content
  Background:
    Given the CSS selectors
      | Alias                       | Selector                                    |
      | details                     | [data-testid='detail-view-details']         |
      | zone-control-planes-details | [data-testid='zone-control-planes-details'] |
      | meshes-details              | [data-testid='meshes-details']              |

  Scenario: Shows expected content in standalone mode
    Given the environment
      """
      KUMA_MESH_COUNT: 3
      """
    And the URL "/config" responds with
      """
      body:
        mode: 'standalone'
      """
    And the URL "/mesh-insights" responds with
      """
      body:
        items:
          - name: mesh-1
            services:
              total: 5
            dataplanesByType:
              standard:
                total: 3
          - name: mesh-2
            services:
              total: 5
            dataplanesByType:
              standard:
                total: 3
          - name: mesh-3
            services:
              total: 5
            dataplanesByType:
              standard:
                total: 3
      """

    When I visit the "/" URL
    Then the page title contains "Overview"
    And the "$details" element exists

    And the "[data-testid='zone-control-planes-status']" element contains "1"
    And the "[data-testid='meshes-status']" element contains "3"
    And the "[data-testid='services-status']" element contains "15"
    And the "[data-testid='data-plane-proxies-status']" element contains "9"

    And the "$zone-control-planes-details" element doesn't exists
    And the "$meshes-details" element exists

  Scenario: Shows expected content in global mode
    Given the environment
      """
      KUMA_ZONE_COUNT: 2
      KUMA_MESH_COUNT: 3
      """
    And the URL "/config" responds with
      """
      body:
        mode: 'global'
      """
    And the URL "/zones+insights" responds with
      """
      body:
        items:
          - name: zone-cp-1
            zoneInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  config: '{"environment":"universal"}'
                - connectTime: 2020-07-28T16:18:09.743141Z
                  config: '{"environment":"universal"}'
          - name: zone-cp-2
            zoneInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  config: '{"environment":"kubernetes"}'
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                  config: '{"environment":"kubernetes"}'
      """
    And the URL "/mesh-insights" responds with
      """
      body:
        items:
          - name: mesh-1
            services:
              total: 5
            dataplanesByType:
              standard:
                total: 3
          - name: mesh-2
            services:
              total: 5
            dataplanesByType:
              standard:
                total: 3
          - name: mesh-3
            services:
              total: 5
            dataplanesByType:
              standard:
                total: 3
      """

    When I visit the "/" URL

    Then the page title contains "Overview"
    And the "$details" element exists

    And the "[data-testid='zone-control-planes-status']" element contains "2"
    And the "[data-testid='meshes-status']" element contains "3"
    And the "[data-testid='services-status']" element contains "15"
    And the "[data-testid='data-plane-proxies-status']" element contains "9"

    And the "$zone-control-planes-details" element exists
    And the "$meshes-details" element exists
