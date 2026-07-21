Feature: zones / ingresses / navigation

  Background:
    Given the CSS selectors
      | Alias         | Selector                                                                    |
      | row           | [data-testid$='-collection'] tbody tr:first-child                           |
      | action-group  | $row [data-testid='x-action-group-control']                                 |
      | view          | $row [data-testid='x-action-group'] li:first-child [data-testid='x-action'] |
      | action        | $row [data-action]                                                          |
      | summary-title | [data-testid='slideout-title'] a                                            |
      | detail-link   | [data-testid$='-collection'] tr:first-child [data-testid='details-link']    |
    And the environment
      """
      KUMA_MODE: global
      KUMA_ZONE_NAME: feed-0
      KUMA_ZONEINGRESS_COUNT: 1
      """

  Rule: In a namespaced environment

    Background:
      Given the environment
        """
        KUMA_ENVIRONMENT: kubernetes
        """
      And the URL "/zone-ingresses/_overview" responds with
        """
        body:
          items:
          - name: monitor-proxy-0-5064a9c9a-icpsl.kuma-system
            kri: kri_zi__feed-0_kuma-system_monitor-proxy-0-5064a9c9a-icpsl_
            labels:
              kuma.io/display-name: monitor-proxy-0-5064a9c9a-icpsl
              k8s.kuma.io/namespace: kuma-system
        """

    Scenario Outline: clicking the detail link
      When I visit the "<URL>" URL
      When I click the "$action-group" element
      And I click the "$view" element
      Then the URL contains "kri_zi__feed-0_kuma-system_monitor-proxy-0-5064a9c9a-icpsl_/overview"
      And the "[data-testid='zone-ingress-detail-view']" element exists

      Examples:
        | URL                               |
        | /zones/kri_z____feed-0_/ingresses |

    Scenario Outline: clicking the row, opening and summary, and clicking the title
      When I visit the "<URL>" URL
      And I click the "$action" element
      Then the URL contains "kri_zi__feed-0_kuma-system_monitor-proxy-0-5064a9c9a-icpsl_"
      And the URL doesn't contain "kri_zi__feed-0_kuma-system_monitor-proxy-0-5064a9c9a-icpsl_/overview"
      Then I click the "$summary-title" element
      Then the URL contains "kri_zi__feed-0_kuma-system_monitor-proxy-0-5064a9c9a-icpsl_/overview"
      And the "[data-testid='zone-ingress-detail-view']" element exists

      Examples:
        | URL                               |
        | /zones/kri_z____feed-0_/ingresses |

  Rule: In a non-namespaced environment

    Background:
      Given the environment
        """
        KUMA_ENVIRONMENT: universal
        """
      And the URL "/zone-ingresses/_overview" responds with
        """
        body:
          items:
          - name: monitor-proxy-0
            kri: kri_zi__feed-0__monitor-proxy-0_
        """

    Scenario Outline: clicking the detail link
      When I visit the "<URL>" URL
      When I click the "$action-group" element
      And I click the "$view" element
      Then the URL contains "kri_zi__feed-0__monitor-proxy-0_/overview"
      And the "[data-testid='zone-ingress-detail-view']" element exists

      Examples:
        | URL                               |
        | /zones/kri_z____feed-0_/ingresses |

    Scenario Outline: clicking the row, opening and summary, and clicking the title
      When I visit the "<URL>" URL
      And I click the "$action" element
      Then the URL contains "kri_zi__feed-0__monitor-proxy-0_"
      And the URL doesn't contain "kri_zi__feed-0__monitor-proxy-0_/overview"
      Then I click the "$summary-title" element
      Then the URL contains "kri_zi__feed-0__monitor-proxy-0_/overview"
      And the "[data-testid='zone-ingress-detail-view']" element exists

      Examples:
        | URL                               |
        | /zones/kri_z____feed-0_/ingresses |
