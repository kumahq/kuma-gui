Feature: hostname-generators / item

  Background:
    Given the CSS selectors
      | Alias              | Selector                                         |
      | detail-view        | [data-testid='hostname-generator-detail-view']   |
      | title-bar          | $detail-view .app-view-title-bar                 |
      | config-universal   | [data-testid='codeblock-yaml-universal']         |
      | config-k8s         | [data-testid='codeblock-yaml-k8s']               |
      | select-environment | [data-testid='select-input']                     |
      | about-section      | [data-testid='hostname-generator-about-section'] |
    And the URL "/hostnamegenerators/local-mesh-external-service" responds with
      """
      body:
        name: local-mesh-external-service
        labels:
          kuma.io/zone: zone-1
          k8s.kuma.io/namespace: kuma-system
          kuma.io/env: kubernetes
          kuma.io/origin: zone
        spec:
          selector:
            meshExternalService:
              matchLabels:
                kuma.io/origin: zone
      """

  Scenario: The about section has the expected content
    When I visit the "/hostname-generators/local-mesh-external-service/overview" URL
    Then the "$about-section" element exists
    And the "$about-section" element contains "kuma-system"
    And the "$about-section" element contains "zone-1"
    And the "$about-section" element contains "kuma.io/origin:zone"
    And the "$about-section" element contains "kuma.io/env:kubernetes"

  Scenario: Visiting the detail view of HostnameGenerator
    When I visit the "/hostname-generators/local-mesh-external-service/overview" URL
    Then the "$detail-view" element exists
    And the "$title-bar" element contains "local-mesh-external-service"

  Scenario: Shows config with format based on environment
    When I visit the "/hostname-generators/local-mesh-external-service/overview" URL
    Then the "$config-universal" element exists
    And the URL contains "?environment=universal"
    When I click the "$select-environment" element
    When I click the "[data-testid='select-item-k8s'] button" element
    Then the "$config-k8s" element exists
    And the URL contains "?environment=k8s"
