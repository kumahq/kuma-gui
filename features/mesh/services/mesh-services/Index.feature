Feature: mesh / services / mesh-services / index
  Background:
    Given the CSS selectors
      | Alias        | Selector                                  |
      | items        | [data-testid='service-collection']        |
      | item         | $items tbody tr                           |
      | button-group | [data-testid='service-list-view-sub-tab'] |
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
      Scenario Outline: clicking the row, opening and summary
        When I visit the "<URL>" URL
        Then the "$button-group" element exists
        And I click the "$item a" element
        Then the URL contains "monitor-proxy-0.kuma-demo"
        And the URL doesn't contain "monitor-proxy-0.kuma-demo/overview"
        Examples:
          | URL                                    |
          | /meshes/default/services/mesh-services |

