Feature: mesh / resources / summary

  Background:
    Given the CSS selectors
      | Alias                | Selector                                     |
      | items                | [data-testid='app-collection']               |
      | item                 | $items tbody tr                              |
      | action               | $item:first-child [data-action]              |
      | summary              | [data-testid='summary']                      |
      | close-summary-button | $summary [data-testid='slideout-close-icon'] |
      | select-preference    | $summary [data-testid='select-input']        |
    And the environment
      """
      KUMA_MODE: global
      KUMA_MESHACCESSLOG_COUNT: 1
      """
    And the URL "/_resources" responds with
      """
      body:
        resources:
          - name: MeshAccessLog
            path: meshaccesslogs
            scope: Mesh
            singularDisplayName: Mesh Access Log
            pluralDisplayName: Mesh Access Logs
            readOnly: false
            includeInFederation: true
            shortName: MAL
            policy:
              hasFromTargetRef: true
              hasToTargetRef: false
              isTargetRef: true
      """
    And the URL "/meshes/default/meshaccesslogs" responds with
      """
      body:
        items:
          - name: resource-1
            kri: kri_mal_default_z1_ns1_resource-1_
            mesh: default
            namespace: kuma-demo
            zone: zone-1
            labels:
              k8s.kuma.io/namespace: kuma-demo
              kuma.io/zone: zone-1
      """

  Scenario: Clicking a row opens the summary
    When I visit the "/meshes/default/resources/meshaccesslogs" URL
    And I click the "$action" element
    Then the "$summary" element exists
    And the "$summary" element contains "resource-1"
    When I click the "$close-summary-button" element
    Then the "$item" element exists but the "$summary" element doesn't exist
    When I navigate "back"
    Then the "$summary" element exists
    And the "$summary" element contains "resource-1"
    When I navigate "forward"
    Then the "$item" element exists but the "$summary" element doesn't exist

  Scenario: Opening a summary URL directly shows the summary
    When I visit the "/meshes/default/resources/meshaccesslogs/kri_mal_default_z1_ns1_resource-1_" URL
    Then the "$summary" element exists
    And the "$summary" element contains "resource-1"

  Rule: Offering different view formats

    Scenario: The universal format is shown by default
      When I visit the "/meshes/default/resources/meshaccesslogs/kri_mal_default_z1_ns1_resource-1_" URL
      Then the "$summary [data-testid='codeblock-yaml-universal']" element exists

    Scenario: Switching to k8s format shows the k8s codeblock
      Given the URL "/_kri/kri_mal_default_z1_ns1_resource-1_" responds with
        """
        body:
          name: resource-1
          kri: kri_mal_default_z1_ns1_resource-1_
          mesh: default
        """
      When I visit the "/meshes/default/resources/meshaccesslogs/kri_mal_default_z1_ns1_resource-1_" URL
      And I click the "$select-preference" element
      And I click the "[data-testid='select-item-k8s'] button" element
      Then the URL contains "format=k8s"
      And the "$summary [data-testid='codeblock-yaml-k8s']" element exists
