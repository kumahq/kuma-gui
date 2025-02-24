Feature: mesh / dataplanes / warnings

  Background:
    Given the CSS selectors
      | Alias                     | Selector                                                                |
      | expired-cert-warning      | [data-testid^='notification-CERT_EXPIRED']                              |
      | unsupported-kuma-warning  | [data-testid^='notification-INCOMPATIBLE_UNSUPPORTED_KUMA_DP']          |
      | unsupported-envoy-warning | [data-testid^='notification-INCOMPATIBLE_UNSUPPORTED_ENVOY']            |
      | unsupported-zone-warning  | [data-testid^='notification-INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS'] |

  Scenario: With an expired certificate a cert warning is shown
    Given the URL "/meshes/default/dataplanes/dpp-1/_overview" responds with
      """
      body:
        dataplaneInsight:
          mTLS:
            certificateExpirationTime: 2022-10-03T12:40:13Z
            lastCertificateRegeneration: 2021-10-03T12:40:13Z
      """
    When I visit the "/meshes/default/data-planes/dpp-1/overview" URL
    Then the "$expired-cert-warning" element exists

  Scenario: With an expired CA a CA warning isn't shown
    Given the URL "/meshes/default/dataplanes/dpp-1/_overview" responds with
      """
      body:
        dataplaneInsight:
          mTLS:
            certificateExpirationTime: 3022-10-03T12:40:13Z
            lastCertificateRegeneration: 3021-10-03T12:40:13Z
      """
    When I visit the "/meshes/default/data-planes/dpp-1/overview" URL
    Then the "$expired-cert-warning" element doesn't exist

  Scenario: With no mTLS a certificate warning isn't shown
    Given the URL "/meshes/default/dataplanes/dpp-1/_overview" responds with
      """
      body:
        dataplaneInsight:
          mTLS: !!js/undefined
      """
    When I visit the "/meshes/default/data-planes/dpp-1/overview" URL
    Then the "$expired-cert-warning" element doesn't exist

  Scenario: Unsupported zone warning is shown
    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 1
      KUMA_MODE: global
      """
    And the URL "/meshes/default/dataplanes/dpp-1/_overview" responds with
      """
      body:
        dataplaneInsight:
          subscriptions:
            - version:
                kumaDp:
                  kumaCpCompatible: false
        dataplane:
          networking:
            inbound:
              - tags:
                  kuma.io/zone: zone
      """
    When I visit the "/meshes/default/data-planes/dpp-1/overview" URL
    Then the "$unsupported-zone-warning" element exists

  Scenario: Unsupported kuma warning is shown
    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 1
      """
    And the URL "/meshes/default/dataplanes/dpp-1/_overview" responds with
      """
      body:
        dataplaneInsight:
          subscriptions:
            - version:
                kumaDp:
                  kumaCpCompatible: false
                envoy:
                  kumaDpCompatible: true
      """
    When I visit the "/meshes/default/data-planes/dpp-1/overview" URL
    Then the "$unsupported-kuma-warning" element exists

  Scenario: Unsupported envoy warning is shown
    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 1
      """
    And the URL "/meshes/default/dataplanes/dpp-1/_overview" responds with
      """
      body:
        dataplaneInsight:
          subscriptions:
            - version:
                kumaDp:
                  kumaCpCompatible: true
                envoy:
                  kumaDpCompatible: false
      """
    When I visit the "/meshes/default/data-planes/dpp-1/overview" URL
    Then the "$unsupported-envoy-warning" element exists
