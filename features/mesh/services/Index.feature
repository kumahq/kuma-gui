Feature: mesh / services / index
  Background:
    Given the CSS selectors
      | Alias        | Selector                              |
      | items        | [data-testid='service-collection']    |
      | children     | [data-testid='data-plane-collection'] |
      | items-header | $items th                             |
      | item         | $items tbody tr                       |
      | breadcrumbs  | .k-breadcrumbs                        |
    And the environment
      """
      KUMA_SERVICEINSIGHT_COUNT: 2
      """
    And the URL "/meshes/default/service-insights" responds with
      """
      body:
        items:
        - name: service-1
        - name: service-2
      """
    When I visit the "/meshes/default/services" URL

  Scenario: The items have the correct columns
    Then the "$items-header" element exists 6 times
    Then the "$items-header" elements contain
      | Value                       |
      | Name                        |
      | Type                        |
      | Address                     |
      | DP proxies (online / total) |
      | Status                      |

  Scenario: The items have the expected content and UI elements
    Then the "#service-list-view-tab.active" element exists
    Then the "$item" element exists 2 times
    Then the "$item:nth-child(1)" element contains
      | Value     |
      | service-1 |
  Scenario: Clicking the link goes to the detail page and back again
    Given the URL "/meshes/default/service-insights/service-1" responds with
      """
      body:
        serviceType: external
      """
    And the URL "/meshes/default/service-insights/service-2" responds with
      """
      body:
        serviceType: internal
      """
    Then the "$item:nth-child(1) td:nth-child(1)" element contains "service-1"
    When I click the "$item:nth-child(1) td:first-of-type a" element
    Then the URL contains "services/service-1/overview"
    Then the "#service-detail-view-tab a" element exists
    # Service Insights with serviceType "external" shouldn't have a Data Plane Proxy table
    And the "#service-data-plane-proxies-view-tab a" element doesn't exists

    When I click the "$breadcrumbs > .k-breadcrumbs-item:nth-child(3) > a" element
    Then the "$item" element exists 2 times
    Then the "$item:nth-child(2) td:nth-child(1)" element contains "service-2"
    When I click the "$item:nth-child(2) td:first-of-type a" element
    Then the URL contains "services/service-2/overview"
    Then the "[data-testid='service-detail-tabs-view']" element contains "service-2"
    Then the "#service-detail-view-tab a" element exists
    # Service Insights with serviceType "internal" should have a Data Plane Proxy table
    And the "#service-data-plane-proxies-view-tab a" element exists
