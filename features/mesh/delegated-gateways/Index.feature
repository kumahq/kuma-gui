# TODO: Enable this test suite when unflagging the KUMA_GATEWAYS_UI feature.
# Unskip to run the test.
@skip
Feature: mesh / delegated-gateways / index
  Background:
    Given the CSS selectors
      | Alias        | Selector                                     |
      | items        | [data-testid='delegated-gateway-collection'] |
      | items-header | $items th                                    |
      | item         | $items tbody tr                              |
    # TODO: Remove KUMA_GATEWAYS_UI when unflagging the KUMA_GATEWAYS_UI feature.
    And the environment
      """
      KUMA_GATEWAYS_UI: true
      KUMA_SERVICE_COUNT: 1
      """
    And the URL "/meshes/default/service-insights" responds with
      """
      body:
        items:
          - name: gateway-1
      """

  Scenario: The items have the correct columns
    When I visit the "/meshes/default/gateways/delegated" URL

    Then the "$items-header" element exists 2 times
    Then the "$items-header" elements contain
      | Value |
      | Name  |

  Scenario: The items have the expected content and UI elements
    When I visit the "/meshes/default/gateways/delegated" URL

    Then the "#gateway-list-tabs-view-tab.active" element exists
    Then the "$item" element exists 1 times
    Then the "$item:nth-child(1)" element contains
      | Value     |
      | gateway-1 |

  Scenario: Clicking View details goes to the detail page and back again
    When I visit the "/meshes/default/gateways/delegated" URL

    Then the "$item:nth-child(1) td:nth-child(1)" element contains "gateway-1"

    When I click the "$item:nth-child(1) [data-testid='details-link']" element

    Then the URL contains "/gateways/delegated/gateway-1/overview"
    Then the "#delegated-gateway-detail-view-tab a" element exists
