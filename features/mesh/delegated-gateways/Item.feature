# TODO: Enable this test suite when unflagging the KUMA_GATEWAYS_UI feature.
# Unskip to run the test.
@skip
Feature: mesh / delegated-gateways / item
  Background:
    Given the CSS selectors
      | Alias     | Selector                                           |
      | tabs-view | [data-testid='delegated-gateway-detail-tabs-view'] |
    # TODO: Remove KUMA_GATEWAYS_UI when unflagging the KUMA_GATEWAYS_UI feature.
    Given the environment
      """
      KUMA_GATEWAYS_UI: true
      """
    Given the URL "/meshes/default/service-insights/service-1-gateway_delegated" responds with
      """
      """

  Scenario: Overview tab has expected content
    When I visit the "/meshes/default/gateways/delegated/service-1-gateway_delegated/overview" URL

    Then the "$tabs-view" element contains "service-1"
