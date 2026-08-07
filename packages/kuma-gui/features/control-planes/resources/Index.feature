Feature: control-planes / resources / index

  Background:
    Given the CSS selectors
      | Alias                   | Selector                                                                                 |
      | resources-nav           | [data-testid='control-plane-resources-navigator'] a                                      |
      | type-hostname-generator | [data-testid='resource-type-link-HostnameGenerator']                                     |
      | type-mesh               | [data-testid='resource-type-link-Mesh']                                                  |
      | type-zone               | [data-testid='resource-type-link-Zone']                                                  |
      | type-mesh-access-log    | [data-testid='resource-type-link-MeshAccessLog']                                         |
      | items                   | [data-testid='control-plane-resource-list-view']                                         |
      | items-header            | $items th                                                                                |
      | item                    | $items tbody tr                                                                          |
      | action                  | $item:first-child [data-action]                                                          |
      | action-group            | $item:first-child [data-testid='x-action-group-control']                                 |
      | view                    | $item:first-child [data-testid='x-action-group'] li:first-child [data-testid='x-action'] |
      | button-docs             | [data-testid='policy-documentation-link']                                                |
      | input-search            | [data-testid='filter-bar-filter-input']                                                  |
      | summary                 | [data-testid='summary']                                                                  |
      | summary-title           | $summary [data-testid='slideout-title']                                                  |
      | state-empty             | [data-testid='empty-block']                                                              |
      | state-error             | [data-testid='x-error-state']                                                            |
    And the environment
      """
      KUMA_MODE: global
      """
    And the URL "/hostnamegenerators" responds with
      """
      body:
        items:
          - name: resource-1.kuma-system
            kri: kri_hg__zone-1_kuma-system_resource-1_
            labels:
              kuma.io/display-name: resource-1
              k8s.kuma.io/namespace: kuma-system
              kuma.io/origin: zone
              kuma.io/zone: zone-1
          - name: resource-2.kuma-system
            kri: kri_hg__zone-2_kuma-system_resource-2_
            labels:
              kuma.io/display-name: resource-2
              k8s.kuma.io/namespace: kuma-system
              kuma.io/origin: zone
              kuma.io/zone: zone-2
      """

  Scenario: Clicking the sidebar tab opens the resources listing
    When I visit the "/" URL
    And I click the "$resources-nav" element
    Then the page title contains "Resources"
    And the "$type-hostname-generator" element exists

  Scenario: The tab lists global-scoped resource types
    When I visit the "/resources" URL
    Then the "$type-hostname-generator" element exists
    And the "$type-mesh" element exists
    And the "$type-zone" element exists

  Scenario: Mesh-scoped resource types are not listed in the tab
    When I visit the "/resources" URL
    Then the "$type-hostname-generator" element exists but the "$type-mesh-access-log" element doesn't exist

  Scenario: The first resource type is selected when none is given
    When I visit the "/resources" URL
    Then the URL contains "/resources/hg"
    And the "$items" element exists

  Scenario: Listing has expected content
    When I visit the "/resources/hg" URL
    Then the "$button-docs" element exists
    And the "$items-header" element exists 4 times
    And the "$item:nth-child(1)" element contains
      | Value       |
      | resource-1  |
      | kuma-system |
      | zone-1      |
    And the "$item:nth-child(2)" element contains
      | Value       |
      | resource-2  |
      | kuma-system |
      | zone-2      |

  Scenario: Selecting a different resource type lists that type
    Given the environment
      """
      KUMA_MESH_COUNT: 2
      """
    And the URL "/meshes" responds with
      """
      body:
        items:
          - name: mesh-1
            kri: kri_m____mesh-1_
          - name: mesh-2
            kri: kri_m____mesh-2_
      """
    When I visit the "/resources" URL
    And I click the "$type-mesh" element
    Then the URL contains "/resources/m"
    And the "$item" element exists 2 times
    And the "$item:nth-child(1)" element contains "mesh-1"
    And the "$item:nth-child(2)" element contains "mesh-2"

  Scenario: Clicking the item name opens the summary
    When I visit the "/resources/hg" URL
    And I click the "$action" element
    Then the URL contains "/resources/hg/kri_hg__zone-1_kuma-system_resource-1_"
    And the "$summary" element exists
    And the "$summary-title" element contains "resource-1"

  Scenario: Clicking the view action navigates to the detail page
    When I visit the "/resources/hg" URL
    And I click the "$action-group" element
    And I click the "$view" element
    Then the URL contains "kri_hg__zone-1_kuma-system_resource-1_/overview"
    And the URL doesn't contain "/resources/hg/kri_hg__zone-1_kuma-system_resource-1_"

  Scenario: Sending filters to the API
    When I visit the "/resources/hg" URL
    Then the "$input-search" element exists
    When I "type" "my-resource namespace:kuma-demo zone:zone-1" into the "$input-search" element
    And I "type" "{enter}" into the "$input-search" element
    Then the URL "/hostnamegenerators" was requested with
      """
      searchParams:
        name: my-resource
        filter[labels.k8s.kuma.io/namespace]: kuma-demo
        filter[labels.kuma.io/zone]: zone-1
        offset: 0
        size: 50
      """

  Scenario: Having no resources of a type shows the empty state
    Given the URL "/hostnamegenerators" responds with
      """
      body:
        total: 0
        items: !!js/undefined
        next: !!js/undefined
      """
    When I visit the "/resources/hg" URL
    Then the "$state-empty" element exists

  Scenario: Erroring shows an error state
    Given the URL "/hostnamegenerators" responds with
      """
      headers:
        Status-Code: '500'
      """
    When I visit the "/resources/hg" URL
    Then the "$state-error" element exists

  Scenario: An unknown resource type falls back to the first resource type
    When I visit the "/resources/not-a-short-name" URL
    Then the URL contains "/resources/hg"
    And the "$item:nth-child(1)" element contains "resource-1"
