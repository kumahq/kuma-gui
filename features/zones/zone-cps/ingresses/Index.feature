Feature: zones / ingresses / index
  Background:
    Given the CSS selectors
      | Alias | Selector                                         |
      | item  | [data-testid='zone-ingress-collection'] tbody tr |

  Scenario: List view has expected content
    Given the environment
      """
      KUMA_MODE: global
      KUMA_ZONEINGRESS_COUNT: 2
      KUMA_SUBSCRIPTION_COUNT: 2
      """
    And the URL "/zoneingresses+insights" responds with
      """
      body:
        items:
          - name: zone-ingress-1
            zoneIngress:
              zone: zone-cp-1
            zoneIngressInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: !!js/undefined

          - name: zone-ingress-2
            zoneIngress:
              zone: zone-cp-1
            zoneIngressInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z

          - name: zone-ingress-3-is-not-part-of-this-zone
            zoneIngress:
              zone: zone-cp-not-zone-cp-1
            zoneIngressInsight:
              subscriptions:
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
                - connectTime: 2020-07-28T16:18:09.743141Z
                  disconnectTime: 2020-07-28T16:18:09.743141Z
      """

    When I visit the "/zones/zone-cps/zone-cp-1/ingresses" URL
    Then the page title contains "Ingresses"
    And the "$item" element exists 2 times

    Then the "$item:nth-child(1) .status-column" element contains "online"
    Then the "$item:nth-child(1) .name-column" element contains "zone-ingress-1"

    Then the "$item:nth-child(2) .status-column" element contains "offline"
    Then the "$item:nth-child(2) .name-column" element contains "zone-ingress-2"
