Feature: mesh / services / index

  Background:
    Given the CSS selectors
      | Alias           | Selector                                                                                 |
      | items           | [data-testid='service-collection']                                                       |
      | items-header    | $items th                                                                                |
      | item            | $items tbody tr                                                                          |
      | action-group    | $item:first-child [data-testid='x-action-group-control']                                 |
      | view            | $item:first-child [data-testid='x-action-group'] li:first-child [data-testid='x-action'] |
      | action          | $item:first-child [data-action]                                                          |
      | breadcrumbs     | .k-breadcrumbs                                                                           |
      | service-sub-tab | [data-testid='service-list-view-sub-tab']                                                |
    And the environment
      """
      KUMA_SERVICE_COUNT: 1
      """
    And the URL "/meshes/default/service-insights" responds with
      """
      body:
        items:
          - name: service-1
            serviceType: internal
      """
    When I visit the "/meshes/default/services/internal" URL

  Scenario: Sub navigation has expected content
    Then the "$service-sub-tab" element exists

  Scenario: The items have the correct columns
    Then the "$items-header" element exists 5 times
    Then the "$items-header" elements contain
      | Value                       |
      | Name                        |
      | Address                     |
      | DP proxies (online / total) |
      | Status                      |

  Scenario: The items have the expected content and UI elements
    Then the "[data-testid='service-list-tabs-view-tab'].active" element exists
    Then the "$item" element exists 1 times
    Then the "$item:nth-child(1)" element contains
      | Value     |
      | service-1 |

  Scenario: Clicking View details goes to the detail page and back again
    Then the "$item:nth-child(1) td:nth-child(1)" element contains "service-1"
    When I click the "$action-group" element
    And I click the "$view" element
    Then the URL contains "/services/internal/service-1/overview"
    Then the "[data-testid='service-detail-view-tab'].active" element exists
    When I click the "$breadcrumbs > .breadcrumbs-item-container:nth-child(3) > a" element
    Then the "$item" element exists 1 times
