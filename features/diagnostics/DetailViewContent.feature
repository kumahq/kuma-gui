Feature: Diagnostics: Detail view content
  Background:
    Given the CSS selectors
      | Alias                   | Selector                                  |
      | details                 | [data-testid='code-block-diagnostics']    |
      | code-block-search-input | [data-testid='k-code-block-search-input'] |

  Scenario: Diagnostics detail view has expected content
    Given the environment
      """
      KUMA_MODE: global
      """

    When I visit the "/diagnostics" URL
    Then the page title contains "Diagnostics"
    Then the "$details" element contains ""mode": "global""
    Then the "$details" element contains ""environment": "universal""

  Scenario: Reads code search value from URL
    When I visit the "/diagnostics?codeSearch=(groups%257Cusers)" URL

    Then the "$code-block-search-input" element has value "(groups|users)"

  Scenario: Stores code search value in URL
    When I visit the "/diagnostics" URL
    And I "input" "(groups|users)" into the "$code-block-search-input" element

    Then the URL contains "/diagnostics?codeSearch=(groups%257Cusers)"
