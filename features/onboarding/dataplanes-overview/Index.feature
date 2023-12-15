Feature: onboarding / dataplanes-overview / index
  Background:
    Given the CSS selectors
      | Alias         | Selector                               |
      | next-button   | [data-testid='onboarding-next-button'] |
      | state-success | [data-testid='state-success']          |
      | state-waiting | [data-testid='state-waiting']          |

  Scenario: Next button is disabled if there are no Dataplanes
    Given the environment
      """
      KUMA_DATAPLANE_COUNT: 0
      """

    When I visit the "/onboarding/dataplanes-overview" URL

    Then the "$next-button[disabled]" element exists

  Scenario: Next button is enabled if there is at least one Dataplane
    Given the environment
      """
      KUMA_DATAPLANE_COUNT: 1
      """
    And the URL "/dataplanes/_overview" responds with
      """
      body:
        items:
          - name: dataplane-test
            dataplaneInsight:
              subscriptions:
                - connectTime: 2021-02-17T07:33:36.412683Z
                  disconnectTime: !!js/undefined
      """

    When I visit the "/onboarding/dataplanes-overview" URL

    Then the "$next-button:not([disabled])" element exists

  Scenario: UI updates in response to Dataplanes not being offline anymore
    Given the environment
      """
      KUMA_DATAPLANE_COUNT: 1
      KUMA_SUBSCRIPTION_COUNT: 1
      """
    And the URL "/dataplanes/_overview" responds with
      """
      body:
        items:
          - name: dataplane-test
            dataplaneInsight:
              subscriptions:
                - connectTime: 2021-02-17T07:33:36.412683Z
                  disconnectTime: 2021-02-17T07:33:36.412683Z
      """

    When I visit the "/onboarding/dataplanes-overview" URL

    Then the "$state-waiting" element exists

    When the URL "/dataplanes/_overview" responds with
      """
      body:
        items:
          - name: dataplane-test
            dataplaneInsight:
              subscriptions:
                - connectTime: 2021-02-17T07:33:36.412683Z
                  disconnectTime: !!js/undefined
      """

    Then the "$state-success" element exists
