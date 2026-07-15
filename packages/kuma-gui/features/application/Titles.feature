Feature: application / titles

  Scenario Outline: Visiting "<URL>" page in "global" Mode
    Given the environment
      """
      KUMA_MODE: global
      """
    When I visit the "<URL>" URL
    Then the page title contains "<Title>"

    Examples:
      | URL                                                                                                                   | Title                     |
      | /                                                                                                                     | Overview                  |
      | /configuration                                                                                                        | Configuration             |
      | /zones                                                                                                                | Zone control planes       |
      | /zones/kri_z____zone-cp-name_/overview                                                                                | zone-cp-name              |
      | /zones/kri_z____zone-cp-name_/ingresses                                                                               | Ingresses                 |
      | /zones/kri_z____zone-cp-name_/ingresses/kri_zi__zone-cp-name__zone-ingress-name_/overview                             | zone-ingress-name         |
      | /zones/kri_z____zone-cp-name_/egresses                                                                                | Egresses                  |
      | /zones/kri_z____zone-cp-name_/egresses/kri_ze__zone-cp-name__zone-egress-name_/overview                               | zone-egress-name          |
      | /meshes                                                                                                               | Meshes                    |
      | /meshes/default/overview                                                                                              | Mesh overview             |
      | /meshes/default/services/internal                                                                                     | Services                  |
      | /meshes/default/services/internal/service-name/overview                                                               | service-name              |
      | /meshes/default/services/external                                                                                     | ExternalServices          |
      | /meshes/default/services/external/service-name/overview                                                               | service-name              |
      | /meshes/default/gateways/builtin                                                                                      | Built-in gateways         |
      | /meshes/default/gateways/builtin/gateway.namespace/overview                                                           | gateway                   |
      | /meshes/default/gateways/delegated                                                                                    | Delegated gateways        |
      | /meshes/default/gateways/delegated/gateway/overview                                                                   | gateway                   |
      | /meshes/default/services/mesh-services                                                                                | MeshServices              |
      | /meshes/default/services/mesh-services/kri_msvc____service-name_/overview                                             | service-name              |
      | /meshes/default/services/mesh-multi-zone-services                                                                     | MeshMultiZoneServices     |
      | /meshes/default/services/mesh-multi-zone-services/kri_mzsvc____service-name_/overview                                 | service-name              |
      | /meshes/default/services/mesh-external-services                                                                       | MeshExternalServices      |
      | /meshes/default/services/mesh-external-services/kri_extsvc____service-name_/overview                                  | service-name              |
      | /meshes/default/data-planes                                                                                           | Data plane proxies        |
      | /meshes/default/data-planes/kri_dp_default___data-plane-name_/overview                                                | data-plane-name           |
      | /meshes/default/policies/circuit-breakers                                                                             | Policies                  |
      | /meshes/default/policies/circuit-breakers/kri_~circuitbreaker_default___program-0_/overview                           | program-0                 |
      | /meshes/default/resources/meshfaultinjections                                                                         | Resources                 |
      | /meshes/default/resources/meshfaultinjections/kri_mfi_default_adviser_kuma-system_pension-0-959cb35ab-xtzqf_/overview | pension-0-959cb35ab-xtzqf |
      | /meshes/default/workloads                                                                                             | Workloads                 |
      | /meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_/overview                                                  | workload-1                |
      | /hostname-generators                                                                                                  | HostnameGenerators        |
      | /hostname-generators/kri_hg____hg-name_/overview                                                                      | hg-name                   |

  Scenario Outline: Visiting the "<Title>" page in "zone" Mode
    Given the environment
      """
      KUMA_MODE: zone
      """
    When I visit the "<URL>" URL
    Then the page title contains "<Title>"

    Examples:
      | URL                                                      | Title            |
      | /zones/egresses                                          | Egresses         |
      | /zones/egresses/kri_ze__zone__zone-egress-name_/overview | zone-egress-name |
