Feature: hostname-generators / index

  Background:
    Given the CSS selectors
      | Alias                      | Selector                                                   |
      | items                      | [data-testid='hostname-generator-collection']              |
      | item                       | $items tbody tr                                            |
      | breadcrumbs                | .k-breadcrumbs                                             |
      | summary-slideout-container | [data-testid='summary'] [data-testid='slideout-container'] |
      | summary-title              | $summary-slideout-container [data-testid='slideout-title'] |
      | input-search               | [data-testid='filter-bar-filter-input']                    |

  Scenario: Clicking a hostname generator action link and back again for <HostnameGenerator>
    Given the URL "/hostnamegenerators" responds with
      """
      body:
        items:
          - name: local-mesh-external-service
          - name: synced-kube-mesh-service
      """
    When I visit the "/hostname-generators" URL
    When I click the "<Selector> [data-testid='x-action-group-control']" element
    And I click the "<Selector> [data-testid='x-action-group'] li:nth-child(1) [data-testid='x-action']" element
    Then the URL contains "/hostname-generators/<HostnameGenerator>/overview"
    And the "$breadcrumbs" element contains "Hostname Generators"
    And I click the "$breadcrumbs > .breadcrumbs-item-container:nth-child(1) > a" element

    Examples:
      | HostnameGenerator           | Selector           |
      | local-mesh-external-service | $item:nth-child(1) |
      | synced-kube-mesh-service    | $item:nth-child(2) |

  Scenario: Clicking a hostname generator
    Given the URL "/hostnamegenerators" responds with
      """
      body:
        items:
          - name: local-mesh-external-service
      """
    When I visit the "/hostname-generators" URL
    When I click the "<Selector> td:nth-child(1)" element
    Then the URL contains "/hostname-generators/<HostnameGenerator>"
    And the "$summary-slideout-container" element exists
    And the "$summary-title" element contains "<HostnameGenerator>"

    Examples:
      | HostnameGenerator           | Selector           |
      | local-mesh-external-service | $item:nth-child(1) |

  Scenario Outline: sending filters to the API
    When I visit the "/hostname-generators" URL
    Then the "$input-search" element exists
    When I "type" "foo namespace:bar zone:baz kuma.io/service-name:qux" into the "$input-search" element
    And I "type" "{enter}" into the "$input-search" element
    Then the URL "/hostnamegenerators" was requested with
      """
      searchParams:
        name: foo
        filter[labels.k8s.kuma.io/namespace]: bar
        filter[labels.kuma.io/zone]: baz
        filter[labels.kuma.io/service-name]: qux
        offset: 0
        size: 50
      """
