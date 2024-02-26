# This test won’t work in CI because the preview environment won’t evaluate environment variable-based feature flags. Locally, this test works.
@skip
Feature: mesh / services / old routes
  Background:
    Given the CSS selectors
      | Alias           | Selector                                  |
      | items           | [data-testid='service-collection']        |
      | item            | $items tbody tr                           |
      | service-sub-tab | [data-testid='service-list-view-sub-tab'] |
    And the environment
      """
      KUMA_GATEWAYS_UI: false
      KUMA_SERVICE_COUNT: 1
      """
    And the URL "/meshes/default/service-insights" responds with
      """
      body:
        items:
          - name: service-1
      """

  Scenario: Old routes work without feature flag
    When I visit the "/meshes/default/services" URL

    Then the "#service-list-tabs-view-tab.active" element exists
    Then the "$item" element exists 1 times
    Then the "$item:nth-child(1)" element contains
      | Value     |
      | service-1 |

    When I click the "$item:nth-child(1) [data-testid='details-link']" element

    Then the URL contains "/services/service-1/overview"
