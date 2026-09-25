Feature: mesh / policies / index

  Background:
    Given the CSS selectors
      | Alias            | Selector                                                                                 |
      | policy-type-list | [data-testid='policy-type-list']                                                         |
      | items            | [data-testid='app-collection']                                                           |
      | dataplanes-tab   | [data-testid='data-plane-list-view-tab'] a                                               |
      | policies-tab     | [data-testid='policy-list-index-view-tab'] a                                             |
      | detail-view      | [data-testid='policy-detail-tabs-view']                                                  |
      | items-header     | $items th                                                                                |
      | item             | $items tbody tr                                                                          |
      | action-group     | $item:first-child [data-testid='x-action-group-control']                                 |
      | view             | $item:first-child [data-testid='x-action-group'] li:first-child [data-testid='x-action'] |
      | action           | $item:first-child [data-action]                                                          |
      | button-docs      | [data-testid='policy-documentation-link']                                                |
      | breadcrumbs      | .k-breadcrumbs                                                                           |
      | input-search     | [data-testid='filter-bar-filter-input']                                                  |
    And the environment
      """
      KUMA_MODE: global
      KUMA_MESHACCESSLOG_COUNT: 2
      """
    And the URL "/meshes/default/meshaccesslogs" responds with
      """
      body:
        items:
        - kri: kri_mal_default___fake-mal-1_
          name: fake-mal-1
          labels:
            kuma.io/display-name: fake-mal-1
        - kri: kri_mal_default___fake-mal-2_
          name: fake-mal-2
          labels:
            kuma.io/display-name: fake-mal-2
      """

  Scenario: Visiting `/policies` redirects to the first policy type
    And the URL "/_resources" responds with
      """
      body:
        resources:
          - includeInFederation': true
            name: 'MeshAccessLog'
            path: 'meshaccesslogs'
            pluralDisplayName: 'Mesh Access Logs'
            policy: 
              hasFromTargetRef: true
              hasRulesTargetRef: true
              hasToTargetRef: true
              isFromAsRules: true
              isTargetRef: true
            readOnly: false
            scope: 'Mesh'
            shortName: 'mal'
            singularDisplayName: 'Mesh Access Log'
            isInsight: false
            adminOnly: false
      """
    When I visit the "/meshes/default/policies" URL
    And the "$item:nth-child(1)" element contains
      | Value      |
      | fake-mal-1 |
    Then the URL contains "/meshes/default/policies/mal"

  Scenario: Navigating away and back to the policies tab keeps redirecting to the first policy type
    When I visit the "/meshes/default/data-planes" URL
    And I wait for 100 ms
    And I click the "$policies-tab" element
    And I wait for 100 ms
    And I click the "$dataplanes-tab" element
    And I wait for 100 ms
    And I click the "$policies-tab" element
    Then the URL contains "/meshes/default/policies/mal"

  Scenario: Listing has expected content
    When I visit the "/meshes/default/policies/mal" URL
    Then the "$button-docs" element exists
    And the "$items-header" element exists 6 times
    And the "[data-testid='policy-list-index-view-tab'].active" element exists
    And the "$item" element exists 2 times
    And the "$item:nth-child(1)" element contains
      | Value      |
      | fake-mal-1 |

  Scenario: Clicking the link goes to the detail page and back again
    When I visit the "/meshes/default/policies/mal" URL
    Then the "$item:nth-child(1) td:nth-child(2)" element contains "fake-mal-1"
    When I click the "$action-group" element
    And I click the "$view" element
    Then the URL contains "/overview"
    And the "$detail-view" element contains "fake-mal-1"
    When I click the "$breadcrumbs > .breadcrumbs-item-container:nth-child(3) > a" element
    Then the "$item" element exists 2 times

  Scenario: Clicking policy types in the sidebar switches listing
    Given the environment
      """
      KUMA_MESHFAULTINJECTION_COUNT: 2
      """
    And the URL "/meshes/default/meshfaultinjections" responds with
      """
      body:
        items:
          - name: mfi-1
          - name: mfi-2
      """
    When I visit the "/meshes/default/policies/mal" URL
    Then the "$item:nth-child(1) td:nth-child(2)" element contains "fake-mal-1"
    When I click the "[data-testid='policy-type-link-MeshFaultInjection']" element
    Then the "$item:nth-child(1) td:nth-child(2)" element contains "mfi-1"

  Scenario: TargetRef-based policies show Zone and targetRef columns
    Given the URL "/meshes/default/meshaccesslogs" responds with
      """
      body:
        items:
          - name: fake-mal-1
            kri: kri_mal_default_zone-1__fake-mal-1_
            labels:
              kuma.io/display-name: fake-mal-1
              kuma.io/origin: zone
              kuma.io/zone: zone-1
            spec:
              targetRef:
                kind: MeshService
                name: service-1
      """
    When I visit the "/meshes/default/policies/mal" URL
    Then the "$item:nth-child(1) td:nth-child(2)" element contains "fake-mal-1"
    And the "$item:nth-child(1) td:nth-child(4)" element contains "zone-1"
    And the "$item:nth-child(1) td:nth-child(5)" element contains "MeshService"
    And the "$item:nth-child(1) td:nth-child(5)" element contains "service-1"

  Scenario: Sending filters
    When I visit the "/meshes/default/policies/mal" URL
    Then the "$input-search" element exists
    Then I "type" "foo namespace:bar zone:baz kuma.io/service-name:qux" into the "$input-search" element
    And I "type" "{enter}" into the "$input-search" element
    Then the URL "/meshes/default/meshaccesslogs" was requested with
      """
      searchParams:
        name: foo
        filter[labels.k8s.kuma.io/namespace]: bar
        filter[labels.kuma.io/zone]: baz
        filter[labels.kuma.io/service-name]: qux
        offset: 0
        size: 50
      """
