Feature: Dataplane policy summary
  Background:
    Given the CSS selectors
      | Alias                      | Selector                                                                   |
      | summary-slideout-container | [data-testid='summary'] [data-testid='slideout-container']                 |
      | summary-title              | $summary-slideout-container [data-testid='slideout-title']                 |
      | summary-content            | $summary-slideout-container [data-testid='data-plane-policy-summary-view'] |
  
  Scenario: Policy Summary View has expected content
    Given the environment
      """
      """
    And the URL "/meshes/default/meshhttproutes/the-other-http-route" responds with
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
    And the "$summary-content [data-testid='k-code-block']" element exists
