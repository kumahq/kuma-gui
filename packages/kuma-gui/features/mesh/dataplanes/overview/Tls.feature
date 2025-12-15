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
    And the URL "/meshes/default/dataplanes/backend/stats" responds with
      """
      body: |
        cluster.kri_msvc_default_east_kuma-demo_my-service_5050.ssl.certificate.spiffe://default.local-zone.mesh.local/ns/kuma-demo/sa/default.expiration_unix_time_seconds: 1765823243
      """
    When I visit the "/meshes/default/data-planes/backend/overview" URL
    Then the "$tls-section" element exists
    And the "$tls-section" element contains "The certificate is managed externally"
    And the "$tls-section" element contains "kri_mid_default_east_kuma-demo_identity-1_"
    And the "$tls-section" element contains "Certificate expires at"
    And the "$tls-section" element doesn't contain "Supported CAs"
