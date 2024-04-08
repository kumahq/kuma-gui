Feature: zones / ingresses / navigation
  Background:
    Given the CSS selectors
      | Alias         | Selector                                                                 |
      | row           | [data-testid$='-collection'] tr:first-child td:first-child               |
      | summary-title | [data-testid='slideout-title'] a                                         |
      | detail-link   | [data-testid$='-collection'] tr:first-child [data-testid='details-link'] |
    And the environment
      """
      KUMA_MODE: global
      KUMA_ZONE_NAME: feed-0
      KUMA_ZONEINGRESS_COUNT: 1
      """

    Rule: In a namepaced environment
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
              labels:
                kuma.io/display-name: monitor-proxy-0-5064a9c9a-icpsl
                k8s.kuma.io/namespace: kuma-system
          """
      Scenario Outline: clicking the detail link
        When I visit the "<URL>" URL
        And I click the "$detail-link" element
        Then the URL contains "monitor-proxy-0-5064a9c9a-icpsl.kuma-system/overview"
        And the "[data-testid='zone-ingress-detail-view']" element exists
        Examples:
          | URL                     |
          | /zones/feed-0/ingresses |
      Scenario Outline: clicking the row, opening and summary, and clicking the title
        When I visit the "<URL>" URL
        And I click the "$row" element
        Then the URL contains "monitor-proxy-0-5064a9c9a-icpsl.kuma-system"
        And the URL doesn't contain "monitor-proxy-0-5064a9c9a-icpsl.kuma-system/overview"
        Then I click the "$summary-title" element
        Then the URL contains "monitor-proxy-0-5064a9c9a-icpsl.kuma-system/overview"
        And the "[data-testid='zone-ingress-detail-view']" element exists
        Examples:
          | URL                     |
          | /zones/feed-0/ingresses |

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
          """
      Scenario Outline: clicking the detail link
        When I visit the "<URL>" URL
        And I click the "$detail-link" element
        Then the URL contains "monitor-proxy-0/overview"
        And the "[data-testid='zone-ingress-detail-view']" element exists
        Examples:
          | URL                     |
          | /zones/feed-0/ingresses |
      Scenario Outline: clicking the row, opening and summary, and clicking the title
        When I visit the "<URL>" URL
        And I click the "$row" element
        Then the URL contains "monitor-proxy-0"
        And the URL doesn't contain "monitor-proxy-0/overview"
        Then I click the "$summary-title" element
        Then the URL contains "monitor-proxy-0/overview"
        And the "[data-testid='zone-ingress-detail-view']" element exists
        Examples:
          | URL                     |
          | /zones/feed-0/ingresses |
