Feature: zones / delete

  Background:
    Given the CSS selectors
      | Alias          | Selector                                                                                   |
      | items          | [data-testid="zone-cp-collection"]                                                         |
      | item           | $items tbody tr                                                                            |
      | action-group   | $item:nth-child(1) [data-testid='x-action-group-control']                                  |
      | delete         | $item:nth-child(1) [data-testid='x-action-group'] li:nth-child(2) [data-testid='x-action'] |
      | delete-prompt  | [data-testid="delete-zone-modal"]                                                          |
      | confirm-button | $delete-prompt [data-testid='modal-action-button']                                         |
      | confirm-input  | $delete-prompt [data-testid='confirmation-input']                                          |
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
    Then I click the "$action-group" element
    And I click the "$delete" element
    Then I "type" "zone-1" into the "$confirm-input" element
    And I click the "$confirm-button" element
    Then the URL "/zones/zone-1" was requested with
      """
      method: DELETE
      """
    And the "$delete-prompt" element doesn't exist
