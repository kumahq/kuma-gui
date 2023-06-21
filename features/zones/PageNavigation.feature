Feature: Zones: Page navigation
  Background:
    Given the CSS selectors
      | Alias       | Selector                            |
      | breadcrumbs | .k-breadcrumbs                      |
      | main-nav    | .app-sidebar                        |
      | nav-tabs    | [data-testid='nav-tabs']            |
      | summary     | [data-testid='list-view-summary']   |
      | table       | [data-testid='data-overview-table'] |
      | table-row   | $table tbody tr                     |

  Scenario Outline: Navigating through zone pages by various means works
    Given the environment
      """
      KUMA_ZONE_COUNT: 2
      KUMA_ZONEINGRESS_COUNT: 1
      KUMA_ZONEEGRESS_COUNT: 1
      """
    And the URL "/config" responds with
      """
      body:
        mode: global
      """

    When I visit the "/" URL
    And I click the "$main-nav .nav-item-zone-cp-list-view > a" element

    When I click the "$nav-tabs #<RouteName>-tab a" element
    Then the page title contains "<ListViewTitle>"

    When I click the "$table-row:nth-child(1) [data-testid='detail-view-link']" element
    Then the page title contains "<DetailViewTitle>"

    When I click the "$nav-tabs #<RouteName>-tab a" element
    Then the page title contains "<ListViewTitle>"
    Then the "$table" element exists
    And the "$summary" element exists

    When I click the "$breadcrumbs > .k-breadcrumbs-item:nth-child(1) > a" element
    Then the page title contains "Zone CPs"

    Examples:
      | RouteName              | DetailViewTitle | ListViewTitle  |
      | zone-cp-list-view      | Zone CP         | Zone CPs       |
      | zone-ingress-list-view | Zone Ingress    | Zone Ingresses |
      | zone-egress-list-view  | Zone Egress     | Zone Egresses  |
