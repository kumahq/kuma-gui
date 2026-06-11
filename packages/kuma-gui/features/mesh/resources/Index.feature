Feature: mesh / resources / index

  Background:
    Given the CSS selectors
      | Alias        | Selector                                                                                 |
      | items        | [data-testid='app-collection']                                                           |
      | items-header | $items th                                                                                |
      | item         | $items tbody tr                                                                          |
      | action-group | $item:first-child [data-testid='x-action-group-control']                                 |
      | view         | $item:first-child [data-testid='x-action-group'] li:first-child [data-testid='x-action'] |
      | action       | $item:first-child [data-action]                                                          |
      | button-docs  | [data-testid='policy-documentation-link']                                                |
      | input-search | [data-testid='filter-bar-filter-input']                                                  |
    And the environment
      """
      KUMA_MODE: global
      KUMA_MESHACCESSLOG_COUNT: 2
      """
    And the URL "/meshes/default/meshaccesslogs" responds with
      """
      body:
        items:
          - name: resource-1.kuma-system
            kri: kri_mal_default_zone-1_kuma-system_resource-1_
            labels:
              kuma.io/display-name: resource-1
              k8s.kuma.io/namespace: kuma-system
              kuma.io/origin: zone
              kuma.io/zone: zone-1
          - name: resource-2.kuma-system
            kri: kri_mal_default_zone-2_kuma-system_resource-2_
            labels:
              kuma.io/display-name: resource-2
              k8s.kuma.io/namespace: kuma-system
              kuma.io/origin: zone
              kuma.io/zone: zone-2
      """

  Scenario: Listing has expected content
    When I visit the "/meshes/default/resources/meshaccesslogs" URL
    # Then the "$button-docs" element exists
    Then the "$items-header" element exists 4 times
    And the "$item" element exists 2 times
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

  Scenario: Clicking the item name opens the summary
    When I visit the "/meshes/default/resources/meshaccesslogs" URL
    And I click the "$action" element
    Then the URL contains "meshaccesslogs/kri_mal_default_zone-1_kuma-system_resource-1_"

  Scenario: Clicking the view action navigates to the detail page
    When I visit the "/meshes/default/resources/meshaccesslogs" URL
    And I click the "$action-group" element
    And I click the "$view" element
    Then the URL contains "meshaccesslogs/kri_mal_default_zone-1_kuma-system_resource-1_/overview"

  Scenario: Sending filters
    When I visit the "/meshes/default/resources/meshaccesslogs" URL
    Then the "$input-search" element exists
    When I "type" "my-resource namespace:kuma-demo" into the "$input-search" element
    And I "type" "{enter}" into the "$input-search" element
    Then the URL "/meshes/default/meshaccesslogs" was requested with
      """
      searchParams:
        name: my-resource
        filter[labels.k8s.kuma.io/namespace]: kuma-demo
        offset: 0
        size: 50
      """
