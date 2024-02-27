Feature: mesh / services / index
  Background:
    Given the CSS selectors
      | Alias           | Selector                                  |
      | items           | [data-testid='service-collection']        |
      | dataplanes      | [data-testid='data-plane-collection']     |
      | config          | [data-testid='external-service-config']   |
      | items-header    | $items th                                 |
      | item            | $items tbody tr                           |
      | breadcrumbs     | .k-breadcrumbs                            |
      | service-sub-tab | [data-testid='service-list-view-sub-tab'] |
    And the environment
      """
      KUMA_SERVICE_COUNT: 2
      """
    And the URL "/meshes/default/service-insights" responds with
      """
      body:
        items:
        - name: service-1
        - name: service-2
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
    Then the "#service-list-tabs-view-tab.active" element exists
    Then the "$item" element exists 2 times
    Then the "$item:nth-child(1)" element contains
      | Value     |
      | service-1 |

  Scenario: Clicking View details goes to the detail page and back again
    Given the URL "/meshes/default/service-insights/service-1" responds with
      """
      body:
        serviceType: external
      """
    Given the URL "/meshes/default/service-insights/service-2" responds with
      """
      body:
        serviceType: internal
      """

    Then the "$item:nth-child(1) td:nth-child(1)" element contains "service-1"

    When I click the "$item:nth-child(1) [data-testid='details-link']" element

    Then the URL contains "/services/internal/service-1/overview"
    Then the "#service-detail-view-tab a" element exists
    # Service Insights with serviceType "external" shouldn't have a Data Plane Proxy table
    Then the "$config" element exists
    Then the "$dataplanes" element doesn't exist

    When I click the "$breadcrumbs > .k-breadcrumbs-item:nth-child(3) > a" element

    Then the "$item" element exists 2 times

    Then the "$item:nth-child(2) td:nth-child(1)" element contains "service-2"

    When I click the "$item:nth-child(2) [data-testid='details-link']" element

    Then the URL contains "/services/internal/service-2/overview"
    Then the "[data-testid='service-detail-tabs-view']" element contains "service-2"
    Then the "#service-detail-view-tab a" element exists
    # Service Insights with serviceType "internal" should have a Data Plane Proxy table
    Then the "$dataplanes" element exists
    Then the "$config" element doesn't exist
