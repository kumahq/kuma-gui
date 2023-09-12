Feature: Gateways: Page navigation
  Scenario Outline: Tabs have expected URLs

    When I visit the "/mesh/default/gateway/firewal-gateway-1" URL
    # This `cy.wait` stabilizes the test significantly. For some reason, it can happen that the subsequent navigation to via nav tab is never triggered.
    Then I wait for 1000 milliseconds

    When I click the "<TabSelector>" element
    And the URL contains "<Path>"
    Then the page title contains "<Title>"

    Examples:
      | TabSelector                    | Path                                  | Title             |
      | #gateway-detail-view-tab a     | /gateway/firewal-gateway-1            | firewal-gateway-1 |
      | #gateway-policies-view-tab a   | /gateway/firewal-gateway-1/policies   | Policies          |
      | #gateway-xds-config-view-tab a | /gateway/firewal-gateway-1/xds-config | XDS Configuration |
      | #gateway-stats-view-tab a      | /gateway/firewal-gateway-1/stats      | Stats             |
      | #gateway-clusters-view-tab a   | /gateway/firewal-gateway-1/clusters   | Clusters          |
