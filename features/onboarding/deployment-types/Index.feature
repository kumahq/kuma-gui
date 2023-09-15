Feature: onboarding / deployment-types / index
  Background:
    Given the CSS selectors
      | Alias             | Selector                                           |
      | standalone-button | [data-testid='onboarding-standalone-radio-button'] |
      | multizone-button  | [data-testid='onboarding-multi-zone-radio-button'] |
      | standalone-image  | [data-testid='standalone-graph']                   |
      | multizone-image   | [data-testid='multizone-graph']                    |

  Scenario: Clicking between standalone and multizone to change the image
    When I visit the "/onboarding/deployment-types" URL

    And I click the "$standalone-button" element
    Then the "$standalone-image" element exists
    Then the "$multizone-image" element doesn't exist

    And I click the "$multizone-button" element
    Then the "$multizone-image" element exists
    Then the "$standalone-image" element doesn't exist

