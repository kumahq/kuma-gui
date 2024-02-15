Feature: mesh / external-services / index
  Background:
    Given the CSS selectors
      | Alias        | Selector                                    |
      | items        | [data-testid='external-service-collection'] |
      | items-header | $items th                                   |
      | item         | $items tbody tr                             |
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

  Scenario: The items have the correct columns
    When I visit the "/meshes/default/external-services" URL

    Then the "$items-header" element exists 3 times
    Then the "$items-header" elements contain
      | Value   |
      | Name    |
      | Address |

  Scenario: The items have the expected content and UI elements
    When I visit the "/meshes/default/external-services" URL

    Then the "#service-list-view-tab.active" element exists
    Then the "$item" element exists 1 times
    Then the "$item:nth-child(1)" element contains
      | Value     |
      | service-1 |

  Scenario: Clicking View details goes to the detail page and back again
    When I visit the "/meshes/default/external-services" URL

    Then the "$item:nth-child(1) td:nth-child(1)" element contains "service-1"

    When I click the "$item:nth-child(1) [data-testid='details-link']" element

    Then the URL contains "/external-services/service-1/overview"
    Then the "#external-service-detail-view-tab a" element exists
    Then the "#external-service-config-view-tab a" element exists
