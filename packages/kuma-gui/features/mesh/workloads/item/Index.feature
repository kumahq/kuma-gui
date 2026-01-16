Feature: mesh / workloads / item / index

  Background:
    Given the CSS selectors
      | Alias      | Selector                                   |
      | config-tab | [data-testid='workload-config-view-tab'] a |

  Scenario: The workload tabs view has the expected title
    Given the URL "/_kri/kri_wl_default_z1_ns1_workload-1_" responds with
      """
      body:
        name: workload-1
        kri: kri_wl_default_z1_ns1_workload-1_
        mesh: default
        labels:
          k8s.kuma.io/namespace: ns1
          kuma.io/display-name: workload-1
      """
    When I visit the "/meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_/overview" URL
    Then the page title contains "workload-1"
    Then the "header" element contains "workload-1"

  Scenario: The workload tabs view has the expected tabs
    Given the URL "/_kri/kri_wl_default_z1_ns1_workload-1_" responds with
      """
      body:
        name: workload-1
        kri: kri_wl_default_z1_ns1_workload-1_
        mesh: default
        labels:
          k8s.kuma.io/namespace: ns1
          kuma.io/display-name: workload-1
      """
    When I visit the "/meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_/overview" URL
    Then the "header" element contains "workload-1"
    Then I click the "$config-tab" element
    Then the URL contains "/meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_/config"
