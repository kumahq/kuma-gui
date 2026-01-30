Feature: mesh / workloads / item / config

  Background:
    Given the CSS selectors
      | Alias              | Selector                                     |
      | config-universal   | [data-testid='codeblock-yaml-universal']     |
      | config-k8s         | [data-testid='codeblock-yaml-k8s']           |
      | select-environment | [data-testid='select-input']                 |
      | select-universal   | [data-testid='select-item-universal'] button |
      | select-k8s         | [data-testid='select-item-k8s'] button       |
    And the environment
      """
      KUMA_WORKLOAD_COUNT: 1
      """
    And the URL "/_kri/kri_wl_default_z1_ns1_workload-1_" responds with
      """
      body:
        name: workload-1
        kri: kri_wl_default_z1_ns1_workload-1_
        mesh: default
        labels:
          k8s.kuma.io/namespace: kuma-demo
          kuma.io/display-name: workload-1
        status:
          dataplaneProxies:
            connected: 1
            healthy: 1
            total: 1
      """

  Scenario: The config view has the expected content
    When I visit the "/meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_/config" URL
    And the "$config-universal" element exists
    And the "$config-universal" element contains "name: workload-1"
    And the URL contains "?environment=universal"

  Scenario: Shows config with format based on environment
    When I visit the "/meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_/config" URL
    Then the "$config-universal" element exists
    And the URL contains "?environment=universal"
    When I click the "$select-environment" element
    When I click the "$select-k8s" element
    Then the "$config-k8s" element exists
    And the "$config-k8s" element contains "apiVersion: kuma.io/v1alpha1"
    And the URL contains "?environment=k8s"
