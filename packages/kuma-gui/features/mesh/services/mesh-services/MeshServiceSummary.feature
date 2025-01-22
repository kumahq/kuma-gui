Feature: MeshService summary

  Background:
    Given the CSS selectors
      | Alias             | Selector                                 |
      | summary           | [data-testid='summary']                  |
      | select-preference | $summary [data-testid='select-input']    |
      | structured-view   | $summary [data-testid='structured-view'] |
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

    Scenario Outline: Switching to YAML format and back
      When I visit the "<URL>" URL
      Then the "$select-preference" element exists
      And the "$structured-view" element exists
      When I click the "$select-preference" element
      When I click the "[data-testid='select-item-yaml'] button" element
      Then the URL contains "format=yaml"
      And the "[data-testid='k-code-block']" element exists
      And the "$structured-view" element doesn't exists
      When I click the "$select-preference" element
      When I click the "[data-testid='select-item-structured'] button" element
      Then the URL contains "format=structured"
      And the "$structured-view" element exists

      Examples:
        | URL                                                              |
        | /meshes/default/services/mesh-services/monitor-proxy-0.kuma-demo |
