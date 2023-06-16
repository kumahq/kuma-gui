Feature: mesh / services / index
  Background:
    Given the CSS selectors
      | Alias               | Selector                                     |
      | button-refresh      | [data-testid='data-overview-refresh-button'] |
      | items               | [data-testid='data-overview-table']          |
      | items-header        | $items th                                    |
      | item                | $items tbody tr                              |
      | item-title          | .entity-title         |
      | navigation          | .route-mesh-view-tabs ul >                   |
      | button-tab          | $navigation li:nth-child(2) a                |
      | button-tab-selected | $navigation li:nth-child(2).active           |
    And the environment
    """
      KUMA_SERVICEINSIGHT_COUNT: 2
    """
    And the URL "/meshes/default/service-insights" responds with
      """
      body:
        items:
        - name: fake-service-1
        - name: fake-service-2
      """
    When I visit the "/mesh/default/services" URL

  Scenario: The items have the correct columns
    Then the "$items-header" element exists 5 times
    Then the "$items-header" elements contain
      | Value                       |
      | Name                        |
      | Type                        |
      | Address                     |
      | Status                      |
      | DP proxies (online / total) |

  Scenario: The items have the expected content and UI elements
    Then the "$button-tab-selected" element exists
    Then the "$button-refresh" element exists
    Then the "$item" element exists 2 times
    Then the "$item:nth-child(1)" element contains
      | Value          |
      | fake-service-1 |

  Scenario: Shows information of selected item when clicked
    Then the "$item:nth-child(1) td:nth-child(1)" element contains "fake-service-1"
    Then the URL contains "service=fake-service-1"
    Then the "$item-title" element contains "fake-service-1"
    Then the "$item:nth-child(2)" element contains "fake-service-2"
    Then the "$item:nth-child(2):not(.is-selected)" element exists
    When I click the "$item:nth-child(2) td:nth-child(1)" element
    Then the "$item:nth-child(2).is-selected" element exists
    Then the "$item-title" element contains "fake-service-2"
    Then the URL contains "service=fake-service-2"
  Scenario: Clicking the link goes to the detail page and back again
    Given the URL "/meshes/default/service-insights/fake-service-1" responds with
      """
      body:
        serviceType: external
      """
    And the URL "/meshes/default/service-insights/fake-service-2" responds with
      """
      body:
        serviceType: internal
      """
    Then the "$item:nth-child(1) td:nth-child(1)" element contains "fake-service-1"
    When I click the "$item:nth-child(1) a" element
    Then the URL contains "service/fake-service-1"
    Then the "$item-title" element contains "fake-service-1"
    # In this case $items refers to the data-plane-proxy table
    # external services shouldn't have this
    Then the "$items" element doesn't exist
    Then the "$button-tab-selected" element exists
    When I click the "$button-tab-selected a" element
    Then the "$item" element exists 2 times
    Then the "$item:nth-child(2) td:nth-child(1)" element contains "fake-service-2"
    When I click the "$item:nth-child(2) a" element
    Then the URL contains "service/fake-service-2"
    Then the "$item-title" element contains "fake-service-2"
    # In this case $items refers to the data-plane-proxy table
    Then the "$items" element exists
