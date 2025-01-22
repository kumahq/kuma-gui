Feature: HostnameGenerator summary

  Background:
    Given the CSS selectors
      | Alias             | Selector                                 |
      | summary           | [data-testid='summary']                  |
      | select-preference | $summary [data-testid='select-input']    |
      | structured-view   | $summary [data-testid='structured-view'] |

  Scenario: Switching to YAML format and back
    Given the URL "/hostnamegenerators" responds with
      """
      body:
        items:
          - name: <HostnameGenerator>
      """
    When I visit the "/hostname-generators/<HostnameGenerator>" URL
    Then the "$select-preference" element exists
    And the "$structured-view" element exists
    When I click the "$select-preference" element
    When I click the "[data-testid='select-item-yaml'] button" element
    Then the URL contains "format=yaml"
    And the "[data-testid='k-code-block']" element exists
    And the "$structured-view" element doesn't exists
    When I click the "$select-preference" element
    When I click the "[data-testid='select-item-structured'] button" element
    Then the URL contains "format=structured"
    And the "$structured-view" element exists

    Examples:
      | HostnameGenerator           |
      | local-mesh-external-service |
