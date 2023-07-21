Feature: Zones: Page navigation
  Background:
    Given the CSS selectors
      | Alias       | Selector                            |
      | breadcrumbs | .k-breadcrumbs                      |
      | main-nav    | .app-sidebar                        |
      | nav-tabs    | [data-testid='nav-tabs']            |
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

    When I visit the "/zones" URL
    # This `cy.wait` stabilizes the test significantly. For some reason, it can happen that the subsequent navigation to via nav tab is never triggered.
    Then I wait for 1000 milliseconds

    When I click the "$nav-tabs #<RouteName>-tab a" element
    Then the page title contains "<ListViewTitle>"

    When I click the "<TableSelector> tbody tr:nth-child(1) [data-testid='detail-view-link']" element
    Then the page title contains "<DetailViewTitle>"

    When I click the "$nav-tabs #<RouteName>-tab a" element
    Then the page title contains "<ListViewTitle>"
    Then the "<TableSelector>" element exists

    When I click the "$breadcrumbs > .k-breadcrumbs-item:nth-child(1) > a" element
    Then the page title contains "Control Planes"

    Examples:
      | RouteName              | TableSelector                      | DetailViewTitle | ListViewTitle  |
      | zone-cp-list-view      | [data-testid='zone-cp-table']      | Control Plane   | Control Planes |
      | zone-ingress-list-view | [data-testid='zone-ingress-table'] | Ingress         | Ingresses      |
      | zone-egress-list-view  | [data-testid='zone-egress-table']  | Egress          | Egresses       |
