Feature: mesh / services / mesh-services / index

  Background:
    Given the CSS selectors
      | Alias         | Selector                                                                     |
      | items         | [data-testid='service-collection']                                           |
      | item          | $items tbody tr:first-child                                                  |
      | button-group  | [data-testid='service-list-view-sub-tab']                                    |
      | summary-title | [data-testid='slideout-title'] a                                             |
      | action-group  | $item [data-testid='x-action-group-control']                                 |
      | view          | $item [data-testid='x-action-group'] li:first-child [data-testid='x-action'] |
      | action        | $item [data-action]                                                          |
      | input-search  | [data-testid='filter-bar-filter-input']                                      |
    And the environment
      """
      KUMA_SERVICE_COUNT: 1
      """

  Rule: In a namespaced environment

    Background:
      Given the environment
        """
        KUMA_ENVIRONMENT: kubernetes
        """
      And the URL "/meshes/default/meshservices" responds with
        """
        body:
          items:
          - name: monitor-proxy-0.kuma-demo
            labels:
              kuma.io/display-name: monitor-proxy-0
              k8s.kuma.io/namespace: kuma-demo
        """

    Scenario Outline: clicking the detail link
      When I visit the "<URL>" URL
      When I click the "$action-group" element
      And I click the "$view" element
      Then the URL contains "monitor-proxy-0.kuma-demo/overview"
      And the "[data-testid='mesh-service-detail-view']" element exists

      Examples:
        | URL                                    |
        | /meshes/default/services/mesh-services |

    Scenario Outline: clicking the row, opening the summary, and clicking the title
      When I visit the "<URL>" URL
      Then the "$button-group" element exists
      And I click the "$action" element
      Then the URL contains "monitor-proxy-0.kuma-demo"
      And the URL doesn't contain "monitor-proxy-0.kuma-demo/overview"
      Then I click the "$summary-title" element
      Then the URL contains "monitor-proxy-0.kuma-demo/overview"
      And the "[data-testid='mesh-service-detail-view']" element exists

      Examples:
        | URL                                    |
        | /meshes/default/services/mesh-services |

    Scenario Outline: sending filters to the API
      When I visit the "<URL>" URL
      Then the "$input-search" element exists
      When I "type" "foo namespace:bar zone:baz kuma.io/service-name:qux" into the "$input-search" element
      And I "type" "{enter}" into the "$input-search" element
      Then the URL "/meshes/default/meshservices" was requested with
        """
        searchParams:
          name: foo
          filter[labels.k8s.kuma.io/namespace]: bar
          filter[labels.kuma.io/zone]: baz
          filter[labels.kuma.io/service-name]: qux
          offset: 0
          size: 50
        """

      Examples:
        | URL                                    |
        | /meshes/default/services/mesh-services |
