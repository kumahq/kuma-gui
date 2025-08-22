Feature: mesh / dataplanes / navigation

  Background:
    Given the CSS selectors
      | Alias         | Selector                                                                    |
      | row           | [data-testid$='-collection'] tr:first-child                                 |
      | summary-title | [data-testid='slideout-title'] a                                            |
      | action-group  | $row [data-testid='x-action-group-control']                                 |
      | view          | $row [data-testid='x-action-group'] li:first-child [data-testid='x-action'] |
      | action        | $row [data-action]                                                          |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      KUMA_MESHSERVICE_MODE: Exclusive
      KUMA_DATAPLANE_COUNT: 1
      """

  Rule: In a namepaced environment

    Background:
      Given the environment
        """
        KUMA_ENVIRONMENT: kubernetes
        """
      And the URL "/meshes/default/dataplanes/_overview" responds with
        """
        body:
          items:
          - name: monitor-proxy-0-5064a9c9a-icpsl.kuma-system
            labels:
              kuma.io/display-name: monitor-proxy-0-5064a9c9a-icpsl
              k8s.kuma.io/namespace: kuma-system
        """

    Scenario Outline: clicking the detail link
      When I visit the "<URL>" URL
      And I click the "$action-group" element
      And I click the "$view" element
      Then the URL contains "monitor-proxy-0-5064a9c9a-icpsl.kuma-system/overview"
      And the "[data-testid='data-plane-detail-view']" element exists

      Examples:
        | URL                                                                             |
        | /meshes/default/gateways/builtin/alarm-0-6064a9c9a-icpsl.kuma-system/dataplanes |
        | /meshes/default/services/internal/microchip-0-internal/overview                 |
        | /meshes/default/data-planes                                                     |

    Scenario Outline: clicking the row, opening and summary, and clicking the title
      When I visit the "<URL>" URL
      And I click the "$action" element
      Then the URL contains "monitor-proxy-0-5064a9c9a-icpsl.kuma-system"
      And the URL doesn't contain "monitor-proxy-0-5064a9c9a-icpsl.kuma-system/overview"
      Then I click the "$summary-title" element
      Then the URL contains "monitor-proxy-0-5064a9c9a-icpsl.kuma-system/overview"
      And the "[data-testid='data-plane-detail-view']" element exists

      Examples:
        | URL                                                                             |
        | /meshes/default/gateways/builtin/alarm-0-6064a9c9a-icpsl.kuma-system/dataplanes |
        | /meshes/default/gateways/delegated/port-0-gateway_delegated/overview            |
        | /meshes/default/services/internal/microchip-0-internal/overview                 |
        | /meshes/default/services/mesh-services/alarm-0-mesh-service/overview            |
        | /meshes/default/data-planes                                                     |

  Rule: In a non-namespaced environment

    Background:
      Given the environment
        """
        KUMA_ENVIRONMENT: universal
        """
      And the URL "/meshes/default/dataplanes/_overview" responds with
        """
        body:
          items:
          - name: monitor-proxy-0
        """

    Scenario Outline: clicking the detail link
      When I visit the "<URL>" URL
      And I click the "$action-group" element
      And I click the "$view" element
      Then the URL contains "monitor-proxy-0/overview"
      And the "[data-testid='data-plane-detail-view']" element exists

      Examples:
        | URL                                                                             |
        | /meshes/default/gateways/builtin/alarm-0-6064a9c9a-icpsl.kuma-system/dataplanes |
        | /meshes/default/services/internal/microchip-0-internal/overview                 |
        | /meshes/default/data-planes                                                     |

    Scenario Outline: clicking the row, opening and summary, and clicking the title
      When I visit the "<URL>" URL
      And I click the "$action" element
      Then the URL contains "monitor-proxy-0"
      And the URL doesn't contain "monitor-proxy-0/overview"
      Then I click the "$summary-title" element
      Then the URL contains "monitor-proxy-0/overview"
      And the "[data-testid='data-plane-detail-view']" element exists

      Examples:
        | URL                                                                             |
        | /meshes/default/gateways/builtin/alarm-0-6064a9c9a-icpsl.kuma-system/dataplanes |
        | /meshes/default/services/internal/microchip-0-internal/overview                 |
        | /meshes/default/data-planes                                                     |
