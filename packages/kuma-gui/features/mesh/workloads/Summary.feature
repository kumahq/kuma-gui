Feature: mesh / workloads / summary

  Background:
    Given the CSS selectors
      | Alias        | Selector                     |
      | table        | table                        |
      | table-header | $table th                    |
      | item         | $table tbody tr              |
      | summary      | [data-testid='summary']      |
      | codeblock    | [data-testid='k-code-block'] |

  Scenario: Navigating to the Workload summary and back
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
    Then I click on the "$item td:nth-child(1)" element
    Then the URL is "/meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_?page=1&size=50&s=&environment=universal"
    Then the "$summary" element exists
    And the "$codeblock" element exists
    Then I navigate "back"
    Then the URL is "/meshes/default/workloads?page=1&size=50"
    And the "$table" element exists but the "$summary" element doesn't exist
    And the "$item" element exists 1 times

  Scenario: The Workload summary has the expected content
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
    When I visit the "/meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_" URL
    Then the "$summary" element exists
    And the "$codeblock" element contains "type: Workload"
    And the "$codeblock" element contains "name: workload-1"
    And the "$codeblock" element contains "kri: kri_wl_default_z1_ns1_workload-1_"
