Feature: hostname-generators / item

  Background:
    Given the CSS selectors
      | Alias          | Selector                                                   |
      | detail-view    | [data-testid='hostname-generator-detail-view']             |
      | title-bar      | $detail-view .app-view-title-bar                           |

  Scenario: Visiting the detail view of HostnameGenerator <HostnameGenerator>
    Given the URL "/hostnamegenerators/<HostnameGenerator>" responds with
      """
      body:
        name: <HostnameGenerator>
      """ 
    When I visit the "/hostname-generators/<HostnameGenerator>/overview" URL
    Then the "$detail-view" element exists
    And the "<Selector>" element contains "<HostnameGenerator>"

    Examples:
      | HostnameGenerator           | Selector   |
      | local-mesh-external-service | $title-bar |
