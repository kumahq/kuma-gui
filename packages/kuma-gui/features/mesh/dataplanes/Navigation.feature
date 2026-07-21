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

  Rule: In a namespaced environment

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
            kri: kri_dp_default_zone-1_kuma-system_monitor-proxy-0-5064a9c9a-icpsl_
            labels:
              kuma.io/display-name: monitor-proxy-0-5064a9c9a-icpsl
              k8s.kuma.io/namespace: kuma-system
              kuma.io/zone: zone-1
        """
      And the URL "/meshes/default/dataplanes/monitor-proxy-0-5064a9c9a-icpsl.kuma-system/_overview" responds with
        """
        body:
          name: monitor-proxy-0-5064a9c9a-icpsl.kuma-system
          kri: kri_dp_default_zone-1_kuma-system_monitor-proxy-0-5064a9c9a-icpsl_
          labels:
            kuma.io/display-name: monitor-proxy-0-5064a9c9a-icpsl
            k8s.kuma.io/namespace: kuma-system
            kuma.io/zone: zone-1
        """

    Scenario Outline: clicking the detail link
      When I visit the "<URL>" URL
      And I click the "$action-group" element
      And I click the "$view" element
      Then the URL contains "kri_dp_default_zone-1_kuma-system_monitor-proxy-0-5064a9c9a-icpsl_/overview"
      And the "[data-testid='data-plane-detail-view']" element exists

      Examples:
        | URL                                                                             |
        | /meshes/default/gateways/builtin/alarm-0-6064a9c9a-icpsl.kuma-system/dataplanes |
        | /meshes/default/services/internal/microchip-0-internal/overview                 |
        | /meshes/default/data-planes                                                     |

    Scenario Outline: clicking the row, opening and summary, and clicking the title
      When I visit the "<URL>" URL
      And I click the "$action" element
      Then the URL contains "kri_dp_default_zone-1_kuma-system_monitor-proxy-0-5064a9c9a-icpsl_"
      And the URL doesn't contain "kri_dp_default_zone-1_kuma-system_monitor-proxy-0-5064a9c9a-icpsl_/overview"
      Then I click the "$summary-title" element
      Then the URL contains "kri_dp_default_zone-1_kuma-system_monitor-proxy-0-5064a9c9a-icpsl_/overview"
      And the "[data-testid='data-plane-detail-view']" element exists

      Examples:
        | URL                                                                                      |
        | /meshes/default/gateways/builtin/alarm-0-6064a9c9a-icpsl.kuma-system/dataplanes          |
        | /meshes/default/gateways/delegated/port-0-gateway_delegated/overview                     |
        | /meshes/default/services/internal/microchip-0-internal/overview                          |
        | /meshes/default/services/mesh-services/kri_msvc_default___alarm-0-mesh-service_/overview |
        | /meshes/default/data-planes                                                              |

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
            kri: kri_dp_default_zone-1__monitor-proxy-0_
            labels:
              kuma.io/display-name: monitor-proxy-0
              kuma.io/zone: zone-1
        """
      And the URL "/meshes/default/dataplanes/monitor-proxy-0/_overview" responds with
        """
        body:
          name: monitor-proxy-0
          kri: kri_dp_default_zone-1__monitor-proxy-0_
          labels:
            kuma.io/display-name: monitor-proxy-0
            kuma.io/zone: zone-1
        """

    Scenario Outline: clicking the detail link
      When I visit the "<URL>" URL
      And I click the "$action-group" element
      And I click the "$view" element
      Then the URL contains "kri_dp_default_zone-1__monitor-proxy-0_/overview"
      And the "[data-testid='data-plane-detail-view']" element exists

      Examples:
        | URL                                                                             |
        | /meshes/default/gateways/builtin/alarm-0-6064a9c9a-icpsl.kuma-system/dataplanes |
        | /meshes/default/services/internal/microchip-0-internal/overview                 |
        | /meshes/default/data-planes                                                     |

    Scenario Outline: clicking the row, opening and summary, and clicking the title
      When I visit the "<URL>" URL
      And I click the "$action" element
      Then the URL contains "kri_dp_default_zone-1__monitor-proxy-0_"
      And the URL doesn't contain "kri_dp_default_zone-1__monitor-proxy-0_/overview"
      Then I click the "$summary-title" element
      Then the URL contains "kri_dp_default_zone-1__monitor-proxy-0_/overview"
      And the "[data-testid='data-plane-detail-view']" element exists

      Examples:
        | URL                                                                             |
        | /meshes/default/gateways/builtin/alarm-0-6064a9c9a-icpsl.kuma-system/dataplanes |
        | /meshes/default/services/internal/microchip-0-internal/overview                 |
        | /meshes/default/data-planes                                                     |
