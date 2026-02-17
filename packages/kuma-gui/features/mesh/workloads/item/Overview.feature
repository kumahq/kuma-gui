Feature: mesh / workloads / item / overview

  Background:
    Given the CSS selectors
      | Alias                  | Selector                                                 |
      | table                  | table                                                    |
      | table-header           | $table th                                                |
      | item                   | $table tbody tr                                          |
      | about-section          | [data-testid='about-workload']                           |
      | dataplane-table        | [data-testid='data-plane-collection']                    |
      | dataplane-item         | $dataplane-table tbody tr                                |
      | dataplane-action-group | $dataplane-table tbody tr [data-testid='x-action-group'] |
      | dataplane-link         | $dataplane-action-group [data-testid='x-action']         |
    And the environment
      """
      KUMA_DATAPLANE_COUNT: 1
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
          kuma.io/origin: zone
        status:
          dataplaneProxies:
            connected: 1
            healthy: 1
            total: 1
      """
    And the URL "/meshes/default/dataplanes/_overview" responds with
      """
      body:
        items:
          - name: workload-1-dataplane
            mesh: default
      """

  Scenario: The about section has the expected content
    When I visit the "/meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_/overview" URL
    Then the "$about-section" element exists
    And the "$about-section" element contains "z1"
    And the "$about-section" element contains "kuma.io/origin:zone"

  Scenario: The dataplane list shows related dataplanes to this workload
    Given the environment
      """
      KUMA_DATAPLANE_COUNT: 2
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
            connected: 2
            healthy: 2
            total: 2
      """
    And the URL "/meshes/default/dataplanes/_overview" responds with
      """
      body:
        items:
          - name: workload-1-dataplane-1
            mesh: default
          - name: workload-1-dataplane-2
            mesh: default
      """
    When I visit the "/meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_/overview" URL
    Then the "$dataplane-table" element exists
    And the "$dataplane-item" element exists 2 times
    And the "$dataplane-item:nth-child(1)" element contains "workload-1-dataplane-1"
    And the "$dataplane-item:nth-child(2)" element contains "workload-1-dataplane-2"

  Scenario: Clicking on a dataplane row navigates to the summary of the respective dataplane
    When I visit the "/meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_/overview" URL
    Then the "$dataplane-table" element exists
    And I click the "$dataplane-item td:nth-child(1) [data-testid='x-action']" element
    Then the URL contains "/meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_/overview/workload-1-dataplane"
    And the "[data-testid='workload-data-plane-summary-view']" element exists

  Scenario: Clicking on a dataplane action link navigates to the respective dataplane overview
    When I visit the "/meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_/overview" URL
    Then the "$dataplane-table" element exists
    And the "$dataplane-action-group" element exists
    Then I click the "$dataplane-action-group" element
    Then I click the "$dataplane-link" element
    Then the URL contains "/meshes/default/data-planes/workload-1-dataplane"
    And the "[data-testid='data-plane-detail-view']" element exists
