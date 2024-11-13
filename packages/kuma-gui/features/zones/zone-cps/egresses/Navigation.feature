Feature: zones / egresses / navigation

  Background:
    Given the CSS selectors
      | Alias         | Selector                                                                    |
      | row           | [data-testid$='-collection'] tr:first-child                                 |
      | action-group  | $row [data-testid='x-action-group-control']                                 |
      | view          | $row [data-testid='x-action-group'] li:first-child [data-testid='x-action'] |
      | action        | $row [data-action]                                                          |
      | summary-title | [data-testid='slideout-title'] a                                            |
      | detail-link   | [data-testid$='-collection'] tr:first-child [data-testid='details-link']    |
    And the environment
      """
      KUMA_MODE: global
      KUMA_ZONE_NAME: feed-0
      KUMA_ZONEEGRESS_COUNT: 1
      """

  Rule: In a namepaced environment

    Background:
      Given the environment
        """
        KUMA_ENVIRONMENT: kubernetes
        """
      And the URL "/zoneegresses/_overview" responds with
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
      When I click the "$action-group" element
      And I click the "$view" element
      Then the URL contains "monitor-proxy-0-5064a9c9a-icpsl.kuma-system/overview"
      And the "[data-testid='zone-egress-detail-view']" element exists

      Examples:
        | URL                    |
        | /zones/feed-0/egresses |

    Scenario Outline: clicking the row, opening and summary, and clicking the title
      When I visit the "<URL>" URL
      And I click the "$action" element
      Then the URL contains "monitor-proxy-0-5064a9c9a-icpsl.kuma-system"
      And the URL doesn't contain "monitor-proxy-0-5064a9c9a-icpsl.kuma-system/overview"
      Then I click the "$summary-title" element
      Then the URL contains "monitor-proxy-0-5064a9c9a-icpsl.kuma-system/overview"
      And the "[data-testid='zone-egress-detail-view']" element exists

      Examples:
        | URL                    |
        | /zones/feed-0/egresses |

  Rule: In a non-namespaced environment

    Background:
      Given the environment
        """
        KUMA_ENVIRONMENT: universal
        """
      And the URL "/zoneegresses/_overview" responds with
        """
        body:
          items:
          - name: monitor-proxy-0
        """

    Scenario Outline: clicking the detail link
      When I visit the "<URL>" URL
      When I click the "$action-group" element
      And I click the "$view" element
      Then the URL contains "monitor-proxy-0/overview"
      And the "[data-testid='zone-egress-detail-view']" element exists

      Examples:
        | URL                    |
        | /zones/feed-0/egresses |

    Scenario Outline: clicking the row, opening and summary, and clicking the title
      When I visit the "<URL>" URL
      And I click the "$action" element
      Then the URL contains "monitor-proxy-0"
      And the URL doesn't contain "monitor-proxy-0/overview"
      Then I click the "$summary-title" element
      Then the URL contains "monitor-proxy-0/overview"
      And the "[data-testid='zone-egress-detail-view']" element exists

      Examples:
        | URL                    |
        | /zones/feed-0/egresses |
