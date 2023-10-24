Feature: zones / delete
  Background:
    Given the CSS selectors
      | Alias          | Selector                                                       |
      | items          | [data-testid="zone-cp-collection"]                             |
      | item           | $items tbody tr                                                |
      | actions-button | $item:nth-child(1) [data-testid='dropdown-trigger'] button     |
      | delete-button  | $item:nth-child(1) [data-testid='dropdown-delete-item'] button |
      | delete-prompt  | [data-testid="delete-zone-modal"]                              |
      | confirm-button | $delete-prompt .k-prompt-proceed                               |
      | confirm-input  | $delete-prompt .k-prompt-confirm-text .k-input                 |

    And the environment
      """
      KUMA_ZONE_COUNT: 3
      """
    And the URL "/zones/_overview" responds with
      """
      body:
        items:
        - name: zone-1
        - name: zone-2
        - name: zone-3
      """

    When I visit the "/zones" URL

  Scenario: Clicking delete on an item from the listing page
    Then I click the "$actions-button" element
    And I click the "$delete-button" element
    Then I "type" "zone-1" into the "$confirm-input" element
    And I click the "$confirm-button" element
    Then the URL "/zones/zone-1" was requested with
      """
      method: DELETE
      """
    And the "$delete-prompt" element doesn't exist
