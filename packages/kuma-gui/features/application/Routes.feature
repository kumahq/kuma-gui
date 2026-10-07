Feature: application / routes

  Scenario Outline: Visiting "<URL>" page in "global" Mode
    Given the environment
      """
      KUMA_MODE: global
      """
    When I visit the "<URL>" URL
    Then the "[data-testid='<Route>']" element exists

    Examples:
      | URL                                                                                                         | Route                                 |
      | /                                                                                                           | control-plane-detail-view             |
      | /404                                                                                                        | kuma-not-found-view                   |
      | /not-a-real-page                                                                                            | kuma-not-found-view                   |
      | /configuration                                                                                              | configuration-view                    |
      | /zones                                                                                                      | zone-cp-list-view                     |
      | /zones/kri_z____zone-cp-name_                                                                               | zone-cp-detail-view                   |
      | /zones/kri_z____zone-cp-name_/overview                                                                      | zone-cp-detail-view                   |
      | /zones/kri_z____zone-cp-name_/config                                                                        | zone-cp-config-view                   |
      | /zones/kri_z____zone-cp-name_/subscriptions                                                                 | zone-cp-subscriptions-list-view       |
      | /meshes                                                                                                     | mesh-list-view                        |
      | /meshes/default                                                                                             | mesh-detail-view                      |
      | /meshes/default/overview                                                                                    | mesh-detail-view                      |
      | /meshes/default/services                                                                                    | service-list-tabs-view                |
      | /meshes/default/services/mesh-services                                                                      | mesh-service-list-view                |
      | /meshes/default/services/mesh-services/kri_msvc_default_zone-1_kuma-demo_service-name_/overview             | mesh-service-detail-view              |
      | /meshes/default/services/mesh-services/kri_msvc_default_zone-1_kuma-demo_item-1_/config                     | mesh-service-config-view              |
      | /meshes/default/services/mesh-multi-zone-services                                                           | mesh-multi-zone-service-list-view     |
      | /meshes/default/services/mesh-multi-zone-services/kri_mzsvc_default_zone-1_kuma-demo_service-name_/overview | mesh-multi-zone-service-detail-view   |
      | /meshes/default/services/mesh-external-services                                                             | mesh-external-service-list-view       |
      | /meshes/default/services/mesh-external-services/kri_extsvc_default_zone-1_kuma-demo_service-name_/overview  | mesh-external-service-detail-view     |
      | /meshes/default/data-planes                                                                                 | data-plane-list-view                  |
      | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/overview                       | data-plane-detail-view                |
      | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/config                         | data-plane-config-view                |
      | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/clusters                       | data-plane-clusters-view              |
      | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/stats                          | data-plane-stats-view                 |
      | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/xds-config                     | data-plane-xds-config-view            |
      | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/subscriptions                  | data-plane-subscriptions-list-view    |
      | /meshes/default/policies                                                                                    | policy-list-index-view                |
      | /meshes/default/policies/mal                                                                                | policy-list-view                      |
      | /meshes/default/policies/kri_mal_default___program-0_/overview                                              | policy-detail-view                    |
      | /meshes/default/policies/kri_mal_default___program-0_/config                                                | policy-detail-config-view             |
      | /meshes/default/resources                                                                                   | mesh-resource-type-list-view          |
      | /meshes/default/resources/mfi                                                                               | mesh-resource-list-view               |
      | /meshes/default/resources/kri_mfi_default_adviser_kuma-system_pension-0-959cb35ab-xtzqf_/overview           | mesh-resource-detail-view             |
      | /meshes/default/workloads                                                                                   | workload-list-view                    |
      | /meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_/overview                                        | workload-detail-view                  |
      | /meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_/config                                          | workload-config-view                  |
      | /meshes/default/zones                                                                                       | mesh-zone-address-list-view           |
      | /hostname-generators                                                                                        | hostname-generator-list-view          |
      | /hostname-generators/kri_hg____hg-name_/overview                                                            | hostname-generator-detail-view        |
      | /resources                                                                                                  | control-plane-resource-type-list-view |
      | /resources/hg                                                                                               | control-plane-resource-list-view      |
      | /resources/kri_hg____hg-name_/overview                                                                      | control-plane-resource-detail-view    |

  Scenario Outline: Visiting "<URL>" summary in "global" Mode
    Given the environment
      """
      KUMA_MODE: global
      """
    When I visit the "<URL>" URL
    Then the "[data-testid='<Route>']" element exists

    Examples:
      | URL                                                                                                                                            | Route                                       |
      | /zones/kri_z____zone-cp-name_/subscriptions/subscription/bar                                                                                   | zone-cp-subscription-summary-view           |
      | /meshes/default/overview/meshidentity/kri_mid_default___identity-1_                                                                            | mesh-mesh-identity-summary-view             |
      | /meshes/default/overview/meshtrust/kri_mtrust_default___trust-1_                                                                               | mesh-mesh-trust-summary-view                |
      | /meshes/default/services/mesh-services/kri_msvc_default_zone-1_kuma-demo_item-1_                                                               | mesh-service-summary-view                   |
      | /meshes/default/services/mesh-services/kri_msvc_default_zone-1_kuma-demo_item-1_/overview/kri_dp_default_zone-1_kuma-demo_dp-1_                | mesh-service-data-plane-summary-view        |
      | /meshes/default/services/mesh-multi-zone-services/kri_mzsvc_default_zone-1_kuma-demo_item-1_                                                   | mesh-multi-zone-service-summary-view        |
      | /meshes/default/services/mesh-external-services/kri_extsvc_default_zone-1_kuma-demo_item-1_                                                    | mesh-external-service-summary-view          |
      | /meshes/default/data-planes/kri_dp_default_zone-1__test-data-plane-1_                                                                          | data-plane-summary-view                     |
      | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/subscriptions/subscription/bar                                    | data-plane-subscription-summary-view        |
      | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/overview/meshidentity/kri_mid_default___identity-1_               | data-plane-mesh-identity-summary-view       |
      | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/overview/meshtrust/kri_mtrust_default___trust-1_                  | data-plane-mesh-trust-summary-view          |
      | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/overview/policy/meshtrafficpermission                             | data-plane-policy-config-summary-view       |
      | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/overview/inbound/self_inbound_http                                | data-plane-connection-inbound-summary-view  |
      | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/overview/outbound/kri_msvc_default_zone-1_kuma-demo_demo-app_5050 | data-plane-connection-outbound-summary-view |
      | /meshes/default/policies/mfi/kri_mfi_default___mfi-1_                                                                                          | policy-summary-view                         |
      | /meshes/default/resources/mal/kri_mal_default_zone-1_kuma-system_resource-1_                                                                   | mesh-resource-summary-view                  |
      | /meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_                                                                                    | workload-summary-view                       |
      | /meshes/default/workloads/kri_wl_default_z1_ns1_workload-1_/overview/kri_dp_default_zone-1_kuma-demo_workload-1-dataplane_                     | workload-data-plane-summary-view            |
      | /hostname-generators/kri_hg__zone-1_kuma-system_hg-summary-name_                                                                               | hostname-generator-summary-view             |
      | /resources/hg/kri_hg__zone-1_kuma-system_resource-1_                                                                                           | control-plane-resource-summary-view         |
      # requires guaranteed data
      # | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/overview/inbound/self_inbound_http/overview                                  | data-plane-connection-inbound-summary-overview-view    |
      # | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/overview/inbound/self_inbound_http/stats                                     | data-plane-connection-inbound-summary-stats-view       |
      # | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/overview/inbound/self_inbound_http/clusters                                  | data-plane-connection-inbound-summary-clusters-view    |
      # | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/overview/inbound/self_inbound_http/xds-config                                | data-plane-connection-inbound-summary-xds-config-view  |
      # requires guaranteed data
      # | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/overview/outbound/kri_msvc_default_zone-1_kuma-demo_demo-app_5050/overview   | data-plane-connection-outbound-summary-overview-view   |
      # | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/overview/outbound/kri_msvc_default_zone-1_kuma-demo_demo-app_5050/stats      | data-plane-connection-outbound-summary-stats-view      |
      # | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/overview/outbound/kri_msvc_default_zone-1_kuma-demo_demo-app_5050/clusters   | data-plane-connection-outbound-summary-clusters-view   |
      # | /meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_data-plane-name_/overview/outbound/kri_msvc_default_zone-1_kuma-demo_demo-app_5050/xds-config | data-plane-connection-outbound-summary-xds-config-view |
