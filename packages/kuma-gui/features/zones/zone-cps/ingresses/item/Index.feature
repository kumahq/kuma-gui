Feature: zones / ingresses / item

  Background:
    Given the CSS selectors
      | Alias              | Selector                                       |
      | page               | [data-testid='zone-ingress-detail-tabs-view']  |
      | header             | $page .app-view-title-bar                      |
      | overview-view      | [data-testid='zone-ingress-detail-view']       |
      | config-view        | [data-testid='zone-ingress-config-view']       |
      | navigation         | [data-testid='zone-ingress-tabs'] ul           |
      | config-tab         | [data-testid='zone-ingress-config-view-tab'] a |
      | config-universal   | [data-testid='codeblock-yaml-universal']       |
      | config-k8s         | [data-testid='codeblock-yaml-k8s']             |
      | select-environment | [data-testid='select-input']                   |
      | about-section      | [data-testid='zone-ingress-about-section']     |
    And the environment
      """
      KUMA_MODE: global
      KUMA_SUBSCRIPTION_COUNT: 2
      """
    And the URL "/zone-ingresses/item-1/_overview" responds with
      """
      body:
        labels:
          kuma.io/display-name: default
      """
    And the URL "/_kri/kri_zi__zone-1_kuma-system_item-1_" responds with
      """
      body:
        name: item-1
        kri: kri_zi__zone-1_kuma-system_item-1_
        labels:
          kuma.io/display-name: default
      """

  Scenario Outline: The about section has the expected content
    When I visit the "/zones/zone-cp-1/ingresses/<Name>/overview" URL
    Then the "$about-section" element exists
    And the "$about-section" element contains "kuma.io/display-name:default"

    Examples:
      | Name                               |
      | item-1                             |
      | kri_zi__zone-1_kuma-system_item-1_ |

  Scenario Outline: Clicking through the secondary navigation
    When I visit the "/zones/zone-cp-1/ingresses/<Name>/overview" URL
    Then I click the "$navigation li:nth-child(2) a" element
    Then I click the "$navigation li:nth-child(3) a" element
    Then I click the "$navigation li:nth-child(4) a" element
    Then I click the "$navigation li:nth-child(5) a" element
    Then I click the "$navigation li:nth-child(6) a" element
    Then I click the "$navigation li:nth-child(1) a" element

    Examples:
      | Name                               |
      | item-1                             |
      | kri_zi__zone-1_kuma-system_item-1_ |

  Scenario Outline: Detail view has expected content
    And the URL "/zone-ingresses/item-1/_overview" responds with
      """
      body:
        zoneIngress:
          zone: zone-cp-1
          networking:
            address: '166.197.238.26'
            advertisedAddress: !!js/undefined
            port: 20555
      """
    When I visit the "/zones/zone-cp-1/ingresses/<Name>/overview" URL
    Then the "$header" element contains "item-1"
    Then the "$overview-view" element contains "166.197.238.26:20555"
    When I click the "$config-tab" element
    Then the "$config-view" element contains "type: ZoneIngress"

    Examples:
      | Name                               |
      | item-1                             |
      | kri_zi__zone-1_kuma-system_item-1_ |

  Scenario Outline: Shows config with format based on environment
    When I visit the "/zones/zone-cp-1/ingresses/<Name>/config" URL
    Then the "$config-universal" element exists
    And the URL contains "?environment=universal"
    When I click the "$select-environment" element
    When I click the "[data-testid='select-item-k8s'] button" element
    Then the "$config-k8s" element exists
    And the URL contains "?environment=k8s"

    Examples:
      | Name                               |
      | item-1                             |
      | kri_zi__zone-1_kuma-system_item-1_ |
