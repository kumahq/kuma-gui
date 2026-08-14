Feature: gateways / mesh / dataplanes / policies

  Background:
    Given the CSS selectors
      | Alias                   | Selector                                           |
      | to-rules                | [data-testid='to-rule-list']                       |
      | legacy-sidecar-policies | [data-testid='sidecar-dataplane-policies']         |
      | legacy-gateway-policies | [data-testid='builtin-gateway-dataplane-policies'] |
    And the environment
      """
      KUMA_GATEWAYS_ENABLED: true
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: false
      """
    And the URL "/_kri/kri_dp_default_zone-1_kuma-demo_dataplane-1_" responds with
      """
      body:
        name: dataplane-1.kuma-demo
        kri: kri_dp_default_zone-1_kuma-demo_dataplane-1_
        labels:
          kuma.io/display-name: dataplane-1
      """

  Rule: Delegated gateway

    Background:
      Given the environment
        """
        KUMA_DATAPLANE_TYPE: delegated
        KUMA_DATAPLANE_TO_RULE_COUNT: 1
        """

    Scenario: Federated shows the rules but no legacy content
      Given the environment
        """
        KUMA_MODE: global
        """
      When I visit the "/meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_dataplane-1_ /policies" URL
      Then the "$to-rules" element exists but the "$legacy-sidecar-policies" element doesn't exist
      And the "$to-rules" element exists but the "$legacy-gateway-policies" element doesn't exist
    # We repeat the same test as the one before but with an omitted so we can test
    # an omitted gateway.type. If we ever stop folks accessing gateway.type and rely on the
    # data layer unit test for this instead, we can remove this test.

    Scenario: Federated (with a default/delegated type) shows the rules but no legacy content
      Given the environment
        """
        KUMA_MODE: global
        """
      And the URL "/meshes/default/dataplanes/dataplane-1.kuma-demo/_overview" responds with
        """
        body:
          dataplane:
            networking:
              gateway:
                type: !!js/undefined
        """
      When I visit the "/meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_dataplane-1_/policies" URL
      Then the "$to-rules" element exists but the "$legacy-sidecar-policies" element doesn't exist
      And the "$to-rules" element exists but the "$legacy-gateway-policies" element doesn't exist

    Scenario: Non-federated shows the rules and only sidecar-like (i.e. delegated) gateway legacy content
      Given the environment
        """
        KUMA_MODE: zone
        """
      When I visit the "/meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_dataplane-1_/policies" URL
      Then the "$to-rules" element exists
      And the "$legacy-sidecar-policies" element exists but the "$legacy-gateway-policies" element doesn't exist

  Rule: Built-in gateway

    Background:
      Given the environment
        """
        KUMA_DATAPLANE_TYPE: builtin
        KUMA_DATAPLANE_TO_RULE_COUNT: 1
        """
      And the URL "/_kri/kri_dp_default_zone-1_kuma-demo_dataplane-gateway_builtin-1_" responds with
        """
        body:
          name: dataplane-gateway_builtin-1.kuma-demo
          kri: kri_dp_default_zone-1_kuma-demo_dataplane-gateway_builtin-1_
          labels:
            kuma.io/display-name: dataplane-gateway_builtin-1
        """

    Scenario: Federated shows the rules but no legacy content
      Given the environment
        """
        KUMA_MODE: global
        """
      When I visit the "/meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_dataplane-gateway-builtin-1_/policies" URL
      Then the "$to-rules" element exists but the "$legacy-sidecar-policies" element doesn't exist
      And the "$to-rules" element exists but the "$legacy-gateway-policies" element doesn't exist

    Scenario: Non-federated shows the rules and only builtin gateway legacy content
      Given the environment
        """
        KUMA_MODE: zone
        """
      When I visit the "/meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_dataplane-gateway-builtin-1_/policies" URL
      Then the "$to-rules" element exists
      And the "$legacy-gateway-policies" element exists but the "$legacy-sidecar-policies" element doesn't exist
