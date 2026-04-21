Feature: dataplanes / subscriptions

  Background:
    Given the CSS selectors
      | Alias                             | Selector                                               |
      | about-section                     | [data-testid='about-section-content']                  |
      | about-zone-ingress-subscriptions  | [data-testid='about-zone-ingress-subscriptions']       |
      | zone-ingress-subscriptions        | [data-testid='subscriptions-listing']                  |
      | zone-ingress-subscription-summary | [data-testid='zone-ingress-subscription-summary-view'] |
      | summary                           | [data-testid='summary']                                |
      | close-summary-button              | $summary [data-testid='slideout-close-icon']           |
    And the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 1
      """
    And the URL "/_kri/kri_zi__zone-1_kuma-system_east-ingress_" responds with
      """
      body:
        name: east-ingress
        kri: kri_zi__zone-1_kuma-system_east-ingress_
        labels:
          kuma.io/display-name: east-ingress
      """

  Scenario Outline: When there are subscription the about section has expected content
    Given the URL "/zone-ingresses/east-ingress/_overview" responds with
      """
      body:
        zoneIngressInsight:
          subscriptions:
            - controlPlaneInstanceId: foo
              disconnectTime: !!js/undefined
      """
    When I visit the "/zones/east/ingresses/<Name>/overview" URL
    Then the "$about-section" element contains "XDS connections"
    And the "$about-zone-ingress-subscriptions" element contains "foo"

    Examples:
      | Name             |
      | east-ingress     |
      | kri_zi__zone-1_kuma-system_east-ingress_ |

  Scenario Outline: Go to subscription detail and back
    Given the URL "/zone-ingresses/east-ingress/_overview" responds with
      """
      body:
        zoneIngressInsight:
          subscriptions:
            - controlPlaneInstanceId: foo
              id: bar
      """
    When I visit the "/zones/east/ingresses/<Name>/overview" URL
    Then the "$about-zone-ingress-subscriptions" element exists
    Then I click the "$about-zone-ingress-subscriptions a" element
    Then the URL contains "/zones/east/ingresses/<Name>/subscriptions"
    And the "$zone-ingress-subscriptions" element exists
    Then I click the "$zone-ingress-subscriptions table tbody tr a" element
    Then the URL contains "/zones/east/ingresses/<Name>/subscriptions/subscription/bar"
    And the "$zone-ingress-subscription-summary" element exists
    Then I navigate "back"
    Then the URL contains "/zones/east/ingresses/<Name>/subscriptions"

    Examples:
      | Name             |
      | east-ingress     |
      | kri_zi__zone-1_kuma-system_east-ingress_ |
