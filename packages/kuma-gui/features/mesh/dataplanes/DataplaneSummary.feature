Feature: Dataplane summary

  Background:
    Given the CSS selectors
      | Alias                | Selector                                             |
      | item                 | [data-testid='data-plane-collection'] tbody tr       |
      | summary              | [data-testid='summary']                              |
      | close-summary-button | $summary [data-testid='slideout-close-icon']         |
      | select-preference    | $summary [data-testid='select-input']                |
      | structured-view      | $summary [data-testid='structured-view']             |
      | inbounds             | $structured-view [data-testid='dataplane-inbounds']  |
      | outbounds            | $structured-view [data-testid='dataplane-outbounds'] |
    And the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 2
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      """
    And the URL "/meshes/default/dataplanes/_overview" responds with
      """
      body:
        items:
          - name: test-data-plane-1
            modificationTime: 2021-02-18T08:33:36.442044+01:00
      """

  Scenario: Clicking a row opens the summary
    Given the environment
      """
      KUMA_DATAPLANE_COUNT: 1
      """
    When I visit the "/meshes/default/data-planes" URL
    And I click the "$item:nth-child(1) td:nth-child(2)" element
    Then the "$summary" element exists
    And the "$summary" element contains "test-data-plane-1"
    When I click the "$close-summary-button" element
    Then the "$summary" element doesn't exist
    When I navigate "back"
    Then the "$summary" element exists
    And the "$summary" element contains "test-data-plane-1"
    When I navigate "forward"
    Then the "$summary" element doesn't exist

  Scenario: Summary has expected content
    When I visit the "/meshes/default/data-planes" URL
    And I click the "$item:nth-child(1) td:nth-child(2)" element
    Then the "$summary" element contains "Feb 18, 2021"

  Scenario: Summary URL goes to page with open dataplane summary
    Given the environment
      """
      KUMA_DATAPLANE_COUNT: 51
      """
    When I visit the "/meshes/default/data-planes/test-data-plane-1?page=2&size=50" URL
    Then the "$summary" element exists

  Scenario: Switching to universal format and back
    Given the environment
      """
      KUMA_DATAPLANE_COUNT: 1
      """
    When I visit the "/meshes/default/data-planes/test-data-plane-1" URL
    Then the "$select-preference" element exists
    And the "$structured-view" element exists
    When I click the "$select-preference" element
    When I click the "[data-testid='select-item-universal'] button" element
    Then the URL contains "format=universal"
    And the "[data-testid='k-code-block']" element exists
    And the "$structured-view" element doesn't exists
    When I click the "$select-preference" element
    When I click the "[data-testid='select-item-structured'] button" element
    Then the URL contains "format=structured"
    And the "$structured-view" element exists

  Scenario: Structured shows inbounds and outbounds
    Given the environment
      """
      KUMA_DATAPLANE_COUNT: 1
      """
    And the URL "/meshes/default/dataplanes/_overview" responds with
      """
      body:
        items:
          - name: test-data-plane-1
            dataplane:
              networking:
                type: standard
                gateway: !!js/undefined
                outbound:
                  - address: 127.0.0.1
                    tags:
                      kuma.io/service: foo
                inbound:
                  - address: 127.0.0.1
                    tags:
                      kuma.io/service: foo
      """
    When I visit the "/meshes/default/data-planes/test-data-plane-1?format=structured" URL
    Then the "$inbounds" element exists
    And the "$outbounds" element exists
