Feature: mesh / services / mesh-multi-zone-services / index

  Background:
    Given the CSS selectors
      | Alias         | Selector                                                                     |
      | items         | [data-testid$='-collection']                                                 |
      | item          | $items tbody tr:first-child                                                  |
      | button-group  | [data-testid='service-list-view-sub-tab']                                    |
      | summary-title | [data-testid='slideout-title'] a                                             |
      | action-group  | $item [data-testid='x-action-group-control']                                 |
      | view          | $item [data-testid='x-action-group'] li:first-child [data-testid='x-action'] |
      | action        | $item [data-action]                                                          |
      | input-search  | [data-testid='filter-bar-filter-input']                                      |
    And the environment
      """
      KUMA_MULTIZONESERVICE_COUNT: 1
      """

  Rule: In a namespaced environment

    Background:
      Given the environment
        """
        KUMA_ENVIRONMENT: kubernetes
        """
      And the URL "/meshes/default/meshmultizoneservices" responds with
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
      And the "[data-testid='mesh-multi-zone-service-detail-view']" element exists

      Examples:
        | URL                                               |
        | /meshes/default/services/mesh-multi-zone-services |

    Scenario Outline: clicking the row, opening the summary, and clicking the title
      When I visit the "<URL>" URL
      Then the "$button-group" element exists
      And I click the "$action" element
      Then the URL contains "monitor-proxy-0.kuma-demo"
      And the URL doesn't contain "monitor-proxy-0.kuma-demo/overview"
      Then I click the "$summary-title" element
      Then the URL contains "monitor-proxy-0.kuma-demo/overview"
      And the "[data-testid='mesh-multi-zone-service-detail-view']" element exists

      Examples:
        | URL                                               |
        | /meshes/default/services/mesh-multi-zone-services |

    Scenario Outline: sending filters to the API
      When I visit the "<URL>" URL
      Then the "$input-search" element exists
      When I "type" "foo kuma.io/service-name:bar" into the "$input-search" element
      And I "type" "{enter}" into the "$input-search" element
      Then the URL "/meshes/default/meshmultizoneservices" was requested with
        """
        searchParams:
          name: foo
          filter[labels.kuma.io/service-name]: bar
          offset: 0
          size: 50
        """

      Examples:
        | URL                                               |
        | /meshes/default/services/mesh-multi-zone-services |
