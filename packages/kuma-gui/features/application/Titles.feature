Feature: application / titles

  Scenario Outline: Visiting "<URL>" page in "global" Mode
    Given the environment
      """
      KUMA_MODE: global
      """
    When I visit the "<URL>" URL
    Then the page title contains "<Title>"

    Examples:
      | URL                                                                                               | Title                     |
      | /                                                                                                 | Overview                  |
      | /configuration                                                                                    | Configuration             |
      | /zones                                                                                            | Zone control planes       |
      | /zones/kri_z____zone-cp-name_/overview                                                            | zone-cp-name              |
      | /meshes                                                                                           | Meshes                    |
      | /meshes/default/overview                                                                          | Mesh overview             |
      | /meshes/default/services/mesh-services                                                            | MeshServices              |
      | /meshes/default/services/mesh-services/kri_msvc____service-name_/overview                         | service-name              |
      | /meshes/default/services/mesh-multi-zone-services                                                 | MeshMultiZoneServices     |
      | /meshes/default/services/mesh-multi-zone-services/kri_mzsvc____service-name_/overview             | service-name              |
      | /meshes/default/services/mesh-external-services                                                   | MeshExternalServices      |
      | /meshes/default/services/mesh-external-services/kri_extsvc____service-name_/overview              | service-name              |
      | /meshes/default/data-planes                                                                       | Data plane proxies        |
      | /meshes/default/data-planes/kri_dp_default___data-plane-name_/overview                            | data-plane-name           |
      | /meshes/default/policies/circuit-breakers                                                         | Policies                  |
      | /meshes/default/policies/kri_~circuitbreaker_default___program-0_/overview                        | program-0                 |
      | /meshes/default/resources/mfi                                                                     | Resources                 |
      | /meshes/default/resources/kri_mfi_default_adviser_kuma-system_pension-0-959cb35ab-xtzqf_/overview | pension-0-959cb35ab-xtzqf |
      | /meshes/default/workloads                                                                         | Workloads                 |
      | /meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_/overview                              | workload-1                |
      | /hostname-generators                                                                              | HostnameGenerators        |
      | /hostname-generators/kri_hg____hg-name_/overview                                                  | hg-name                   |
      | /resources/hg                                                                                     | Resources                 |
      | /resources/kri_hg____hg-name_/overview                                                            | hg-name                   |
