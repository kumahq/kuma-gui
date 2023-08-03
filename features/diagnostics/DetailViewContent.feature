Feature: Diagnostics: Detail view content
  Background:
    Given the CSS selectors
      | Alias   | Selector                               |
      | details | [data-testid='code-block-diagnostics'] |

  Scenario: Diagnostics detail view has expected content
    Given the URL "/config" responds with
      """
      body:
        mode: global
      """

    When I visit the "/diagnostics" URL
    Then the page title contains "Diagnostics"
    Then the "$details" element contains ""mode": "global""
    Then the "$details" element contains ""environment": "universal""
