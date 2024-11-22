Feature: Configuration: Detail view content

  Background:
    Given the CSS selectors
      | Alias                         | Selector                                |
      | details                       | [data-testid='code-block-configuration']|
      | code-block-search-input       | [data-testid='code-block-search-input'] |
      | code-block-regexp-mode-button | [data-testid='regexp-mode-button']      |
      | code-block-filter-mode-button | [data-testid='filter-mode-button']      |

  Scenario: Configuration detail view has expected content
    Given the environment
      """
      KUMA_MODE: global
      """
    When I visit the "/configuration" URL
    Then the page title contains "Configuration"
    Then the "$details" element contains ""mode": "global""
    Then the "$details" element contains ""environment": "universal""

  Scenario: Reads code search value from URL
    When I visit the "/configuration?codeSearch=(groups%257Cusers)&codeRegExp&codeFilter" URL
    Then the "$code-block-search-input" element contains "(groups|users)"
    And the "$code-block-regexp-mode-button[aria-pressed='true']" element exists
    And the "$code-block-filter-mode-button[aria-pressed='true']" element exists

  Scenario: Stores code search value in URL
    When I visit the "/configuration" URL
    Then the "$code-block-regexp-mode-button[aria-pressed='true']" element doesn't exist
    And the "$code-block-filter-mode-button[aria-pressed='true']" element doesn't exist
    When I "input" "(groups|users)" into the "$code-block-search-input" element
    Then the URL contains "/configuration?codeSearch=(groups%257Cusers)"
    When I click the "$code-block-regexp-mode-button" element
    Then the URL contains "/configuration?codeSearch=(groups%257Cusers)&codeRegExp"
    When I click the "$code-block-filter-mode-button" element
    Then the URL contains "/configuration?codeSearch=(groups%257Cusers)&codeRegExp&codeFilter"
