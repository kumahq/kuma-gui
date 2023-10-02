Feature: Zones: Page navigation
  Background:
    Given the CSS selectors
      | Alias       | Selector                 |
      | breadcrumbs | .k-breadcrumbs           |
      | nav-tabs    | [data-testid='nav-tabs'] |

  Scenario Outline: Navigating through zone pages by various means works
    Given the environment
      """
      KUMA_ZONE_COUNT: 2
      KUMA_ZONEINGRESS_COUNT: 1
      KUMA_ZONEEGRESS_COUNT: 1
      KUMA_MODE: global
      """
    And the URL "/zones+insights" responds with
      """
      body:
        items:
          - name: zone-cp-1
      """
    And the URL "/zoneingresses+insights" responds with
      """
      body:
        items:
          - name: zone-ingress-1
      """
    And the URL "/zoneegressoverviews" responds with
      """
      body:
        items:
          - name: zone-egress-1
      """

    When I visit the "/zones" URL

    When I click the "$nav-tabs #<RouteName>-tab a" element
    Then the page title contains "<ListViewTitle>"

    When I click the "<TableSelector> tbody tr:nth-child(1) [data-testid='detail-view-link']" element
    Then the page title contains "<DetailViewTitle>"

    When I click the "$breadcrumbs > .k-breadcrumbs-item:nth-child(1) > a" element
    Then the page title contains "<ListViewTitle>"
    Then the "<TableSelector>" element exists

    Examples:
      | RouteName              | TableSelector                           | DetailViewTitle | ListViewTitle       |
      | zone-cp-list-view      | [data-testid='zone-cp-collection']      | zone-cp-1       | Zone Control Planes |
      | zone-ingress-list-view | [data-testid='zone-ingress-collection'] | zone-ingress-1  | Ingresses           |
      | zone-egress-list-view  | [data-testid='zone-egress-collection']  | zone-egress-1   | Egresses            |
