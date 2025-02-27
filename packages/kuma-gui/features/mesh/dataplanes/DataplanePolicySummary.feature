Feature: Dataplane policy summary

  Background:
    Given the CSS selectors
      | Alias                      | Selector                                                                   |
      | summary                    | [data-testid='summary']                                                    |
      | summary-slideout-container | $summary [data-testid='slideout-container']                                |
      | summary-title              | $summary-slideout-container [data-testid='slideout-title']                 |
      | summary-content            | $summary-slideout-container [data-testid='data-plane-policy-summary-view'] |
      | select-preference          | $summary [data-testid='select-input']                                      |
      | structured-view            | $summary [data-testid='structured-view']                                   |

  Scenario: Policy Summary View has expected content
    Given the URL "/meshes/default/meshhttproutes/the-other-http-route" responds with
      """
      body:
        type: MeshHTTPRoute
        mesh: default
        name: the-other-http-route
        labels:
          k8s.kuma.io/namespace: kuma-system
          kuma.io/display-name: foo
          kuma.io/mesh: default
          kuma.io/origin: zone
          kuma.io/zone: port
        spec:
          targetRef:
            kind: MeshGateway
            name: foo
          to:
            - targetRef:
                kind: Mesh
              rules:
                - matches:
                    - path:
                        value: /api
                        type: PathPrefix
                  default:
                    backendRefs:
                      - kind: MeshService
                        name: bar
                        weight: 1
      """
    When I visit the "/meshes/default/data-planes/dataplane-1/policies/meshhttproutes/the-other-http-route" URL
    Then the "[data-testid='data-plane-policies-view']" element exists
    Then the "$summary-slideout-container" element exists
    And the "$summary-title" element contains "the-other-http-route"
    And the "$summary-content" element contains "Target Ref"
    And the "$summary-content" element contains "MeshGateway:foo"
    And the "$summary-content" element contains "Namespace"
    And the "$summary-content" element contains "kuma-system"
    And the "$select-preference" element exists

  Scenario: Switching to k8s format and back
    Given the URL "/meshes/default/meshhttproutes/<PolicyName>" responds with
      """
      body:
        type: MeshHTTPRoute
        mesh: default
        name: <PolicyName>
        labels:
          k8s.kuma.io/namespace: kuma-system
          kuma.io/display-name: foo
        spec:
          targetRef:
            kind: MeshGateway
            name: foo
      """
    When I visit the "/meshes/default/data-planes/dataplane-1/policies/meshhttproutes/<PolicyName>" URL
    Then the "$select-preference" element exists
    And the "$structured-view" element exists
    When I click the "$select-preference" element
    When I click the "[data-testid='select-item-k8s'] button" element
    Then the URL contains "format=k8s"
    And the "[data-testid='k-code-block']" element exists
    And the "$structured-view" element doesn't exists
    When I click the "$select-preference" element
    When I click the "[data-testid='select-item-structured'] button" element
    Then the URL contains "format=structured"
    And the "$structured-view" element exists

    Examples:
      | PolicyName           |
      | the-other-http-route |
