Feature: mesh / services / mesh-external-services / index

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
      And the URL "/meshes/default/meshexternalservices" responds with
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
      And the "[data-testid='mesh-external-service-detail-view']" element exists

      Examples:
        | URL                                             |
        | /meshes/default/services/mesh-external-services |

    Scenario Outline: clicking the row, opening the summary, and clicking the title
      When I visit the "<URL>" URL
      Then the "$button-group" element exists
      And I click the "$action" element
      Then the URL contains "monitor-proxy-0.kuma-demo"
      And the URL doesn't contain "monitor-proxy-0.kuma-demo/overview"
      Then I click the "$summary-title" element
      Then the URL contains "monitor-proxy-0.kuma-demo/overview"
      And the "[data-testid='mesh-external-service-detail-view']" element exists

      Examples:
        | URL                                             |
        | /meshes/default/services/mesh-external-services |
