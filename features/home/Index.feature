Feature: The create Zone flow works
  Background:
    Given the CSS selectors
      | Alias  | Selector |
      | services-chart | [data-testid='services'] canvas   |
    When I visit the "/" URL

  Scenario: Clicking the charts
    When I click the "$services-chart" element
    Then everything is ok

