Feature: control-planes / resources / item

  Background:
    Given the CSS selectors
      | Alias       | Selector                                 |
      | breadcrumbs | .k-breadcrumbs                           |
      | about       | [data-testid='about-resource']           |
      | config      | [data-testid='codeblock-yaml-universal'] |
      | config-k8s  | [data-testid='codeblock-yaml-k8s']       |
    And the environment
      """
      KUMA_MODE: global
      """
    And the URL "/_kri/kri_hg__zone-1_kuma-system_resource-1_" responds with
      """
      body:
        name: resource-1
        labels:
          kuma.io/display-name: resource-1
          k8s.kuma.io/namespace: kuma-system
          kuma.io/origin: zone
          kuma.io/zone: zone-1
      """

  Scenario: Shows expected content
    When I visit the "/resources/kri_hg__zone-1_kuma-system_resource-1_/overview" URL
    Then the page title contains "resource-1"
    And the "$about" element exists
    And the "$about" element contains
      | Value       |
      | zone-1      |
      | kuma-system |
    And the "$config" element exists

  Scenario: The breadcrumb links back to the resource type listing
    When I visit the "/resources/kri_hg__zone-1_kuma-system_resource-1_/overview" URL
    Then the "$breadcrumbs" element contains "Resources"
    When I click the "$breadcrumbs a" element
    Then the URL contains "/resources/hg"

  Scenario: Deeplinking the kubernetes format shows the kubernetes configuration
    When I visit the "/resources/kri_hg__zone-1_kuma-system_resource-1_/overview?environment=k8s" URL
    Then the "$config-k8s" element exists but the "$config" element doesn't exist
