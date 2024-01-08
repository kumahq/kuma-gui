Feature: Diagnostics: Detail view content
  Background:
    Given the CSS selectors
      | Alias                         | Selector                                        |
      | details                       | [data-testid='code-block-diagnostics']          |
      | code-block-search-input       | [data-testid='k-code-block-search-input']       |
      | code-block-regexp-mode-button | [data-testid='k-code-block-regexp-mode-button'] |
      | code-block-filter-mode-button | [data-testid='k-code-block-filter-mode-button'] |

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
    When I visit the "/diagnostics?codeSearch=(groups%257Cusers)&codeRegExp&codeFilter" URL

    Then the "$code-block-search-input" element contains "(groups|users)"
    And the "$code-block-regexp-mode-button[aria-pressed='true']" element exists
    And the "$code-block-filter-mode-button[aria-pressed='true']" element exists

  Scenario: Stores code search value in URL
    When I visit the "/diagnostics" URL

    Then the "$code-block-regexp-mode-button[aria-pressed='true']" element doesn't exist
    And the "$code-block-filter-mode-button[aria-pressed='true']" element doesn't exist

    When I "input" "(groups|users)" into the "$code-block-search-input" element

    Then the URL contains "/diagnostics?codeSearch=(groups%257Cusers)"

    When I click the "$code-block-regexp-mode-button" element

    Then the URL contains "/diagnostics?codeSearch=(groups%257Cusers)&codeRegExp"

    When I click the "$code-block-filter-mode-button" element

    Then the URL contains "/diagnostics?codeSearch=(groups%257Cusers)&codeRegExp&codeFilter"
