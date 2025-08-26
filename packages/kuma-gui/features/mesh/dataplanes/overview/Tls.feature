Feature: mesh / dataplanes / overview / TLS

  Background:
    Given the CSS selectors
      | Alias       | Selector                           |
      | tls-section | [data-testid="dataplane-mtls"]     |
      | summary     | [data-testid="slideout-container"] |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      KUMA_DATAPLANE_TLS_ISSUED_MESHIDENTITY: true
      """

  Scenario: The TLS section shows expected content
    Given the URL "/meshes/default/dataplanes/backend/_overview" responds with
      """
      body:
        dataplaneInsight:
          mTLS:
            issuedBackend: kri_mid_default_east_kuma-demo_identity-1_
      """
    When I visit the "/meshes/default/data-planes/backend/overview" URL
    Then the "$tls-section" element exists
    And the "$tls-section" element contains "The certificate is managed externally"
    And the "$tls-section" element contains "kri_mid_default_east_kuma-demo_identity-1_"
    And the "$tls-section" element doesn't contain "Supported CAs"

  Scenario: Clicking on issuedBackend KRI opens MeshIdentity summary
    Given the URL "/meshes/default/dataplanes/backend/_overview" responds with
      """
      body:
        dataplaneInsight:
          mTLS:
            issuedBackend: kri_mid_default_east_kuma-demo_identity-1_
      """
    When I visit the "/meshes/default/data-planes/backend/overview" URL
    Then the "$tls-section" element exists
    And I wait for 500 ms
    Then I click the "$tls-section a" element
    Then the URL contains "/meshes/default/data-planes/backend/overview/meshidentity/identity-1"
