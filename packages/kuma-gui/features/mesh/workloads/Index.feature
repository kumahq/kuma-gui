Feature: mesh / workloads / index

  Background:
    Given the CSS selectors
      | Alias        | Selector        |
      | table        | table           |
      | table-header | $table th       |
      | item         | $table tbody tr |

  Scenario: The Workload listing table has the correct columns
    When I visit the "/meshes/default/workloads" URL
    Then the "$table-header" element exists 4 times

  Scenario: The Workload listing has the expected content
    Given the environment
      """
      KUMA_WORKLOAD_COUNT: 1
      """
    And the URL "/meshes/default/workloads" responds with
      """
      body:
        items:
        - name: workload-1
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
    When I visit the "/meshes/default/workloads" URL
    Then the "$item" element exists 1 times
    Then the "$item:nth-child(1)" element contains
      | Value      |
      | workload-1 |
      | kuma-demo  |
      |  1 / 1 / 1 |
