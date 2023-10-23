Feature: Service tray
  Background:
    Given the CSS selectors
      | Alias             | Selector                                    |
      | item              | [data-testid='service-collection'] tbody tr |
      | tray              | [data-testid='tray']                        |
      | close-tray-button | $tray [data-testid^='close-button-']        |
    And the URL "/meshes/default/service-insights" responds with
      """
      body:
        items:
          - name: service-1
      """

  Scenario: Clicking a row opens the summary tray
    Given the environment
      """
      KUMA_SERVICEINSIGHT_COUNT: 1
      """

    When I visit the "/meshes/default/services" URL
    And I click the "$item:nth-child(1) td:nth-child(2)" element
    Then the "$tray" element exists
    And the "$tray" element contains "service-1"

    When I click the "$close-tray-button" element
    Then the "$tray" element doesn't exist

    When I navigate "back"
    Then the "$tray" element exists
    And the "$tray" element contains "service-1"

    When I navigate "forward"
    Then the "$tray" element doesn't exist

  Scenario: Summary tray URL goes to page with open service tray
    Given the environment
      """
      KUMA_SERVICEINSIGHT_COUNT: 51
      """

    When I visit the "/meshes/default/services/service-1?page=2&size=50" URL
    Then the "$tray" element exists
