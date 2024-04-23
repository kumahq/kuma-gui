Feature: mesh / external-services / index
  Background:
    Given the CSS selectors
      | Alias                    | Selector                                           |
      | items                    | [data-testid='external-service-collection']        |
      | items-header             | $items th                                          |
      | item                     | $items tbody tr                                    |
      | external-service-sub-tab | [data-testid='external-service-list-view-sub-tab'] |
    Given the environment
      """
      KUMA_EXTERNALSERVICE_COUNT: 1
      """
    Given the URL "/meshes/default/external-services" responds with
      """
      body:
        items:
          - name: service-1
      """

  Scenario: Sub navigation has expected content
    When I visit the "/meshes/default/services/external" URL

    Then the "$external-service-sub-tab" element exists

  Scenario: The items have the correct columns
    When I visit the "/meshes/default/services/external" URL

    Then the "$items-header" element exists 3 times
    Then the "$items-header" elements contain
      | Value   |
      | Name    |
      | Address |

  Scenario: The items have the expected content and UI elements
    When I visit the "/meshes/default/services/external" URL

    Then the "[data-testid='service-list-tabs-view-tab'].active" element exists
    Then the "$item" element exists 1 times
    Then the "$item:nth-child(1)" element contains
      | Value     |
      | service-1 |

  Scenario: Clicking View details goes to the detail page and back again
    When I visit the "/meshes/default/services/external" URL

    Then the "$item:nth-child(1) td:nth-child(1)" element contains "service-1"

    When I click the "$item:nth-child(1) [data-testid='details-link']" element

    Then the URL contains "/services/external/service-1/overview"
    Then the "[data-testid='external-service-detail-view-tab'].active" element exists
