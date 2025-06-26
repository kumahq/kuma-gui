Feature: hostname-generators / item

  Background:
    Given the CSS selectors
      | Alias              | Selector                                       |
      | detail-view        | [data-testid='hostname-generator-detail-view'] |
      | title-bar          | $detail-view .app-view-title-bar               |
      | config-universal   | [data-testid='codeblock-yaml-universal']       |
      | config-k8s         | [data-testid='codeblock-yaml-k8s']             |
      | select-environment | [data-testid='select-input']                   |

  Scenario: Visiting the detail view of HostnameGenerator <HostnameGenerator>
    Given the URL "/hostnamegenerators/<HostnameGenerator>" responds with
      """
      body:
        name: <HostnameGenerator>
      """
    When I visit the "/hostname-generators/<HostnameGenerator>/overview" URL
    Then the "$detail-view" element exists
    And the "<Selector>" element contains "<HostnameGenerator>"

    Examples:
      | HostnameGenerator           | Selector   |
      | local-mesh-external-service | $title-bar |

  Scenario: Shows config with format based on environment
    When I visit the "/hostname-generators/<HostnameGenerator>/overview" URL
    Then the "$config-universal" element exists
    And the URL contains "?environment=universal"
    When I click the "$select-environment" element
    When I click the "[data-testid='select-item-k8s'] button" element
    Then the "$config-k8s" element exists
    And the URL contains "?environment=k8s"
