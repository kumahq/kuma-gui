Feature: onboarding / add-new-services / index
  Background:
    Given the CSS selectors
      | Alias           | Selector                            |
      | demo-button     | [data-testid='onboarding-demo']     |
      | manually-button | [data-testid='onboarding-manually'] |

  Scenario: Clicking between demo and manually
    When I visit the "/onboarding/add-services" URL
    And I click the "$demo-button" element
    Then the "$demo-button.box--active" element exists
    And I click the "$manually-button" element
    Then the "$manually-button.box--active" element exists
