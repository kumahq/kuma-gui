Feature: application / titles

  Scenario Outline: Visiting the "<Title>" page in "global" Mode
    Given the environment
      """
      KUMA_MODE: global
      """
    When I visit the "<URL>" URL
    Then the page title contains "<Title>"

    Examples:
      | URL                                                          | Title               |
      | /                                                            | Overview            |
      | /configuration                                               | Configuration       |
      | /onboarding                                                  | Welcome to Kuma!    |
      | /onboarding/deployment-types                                 | Deployment Types    |
      | /onboarding/configuration-types                              | Configuration Types |
      | /onboarding/multi-zone                                       | Multizone           |
      | /onboarding/create-mesh                                      | Create the Mesh     |
      | /onboarding/add-services                                     | Add new services    |
      | /onboarding/add-services-code                                | Add new services    |
      | /onboarding/dataplanes-overview                              | Data plane overview |
      | /onboarding/completed                                        | Completed           |
      | /zones                                                       | Zone Control Planes |
      | /zones/zone-cp-name/overview                                 | zone-cp-name        |
      | /zones/zone-cp-name/ingresses                                | Ingresses           |
      | /zones/zone-cp-name/ingresses/zone-ingress-name/overview     | zone-ingress-name   |
      | /zones/zone-cp-name/egresses                                 | Egresses            |
      | /zones/zone-cp-name/egresses/zone-egress-name/overview       | zone-egress-name    |
      | /meshes                                                      | Meshes              |
      | /meshes/default/overview                                     | Mesh overview       |
      | /meshes/default/services/internal                            | Services            |
      | /meshes/default/services/internal/service-name/overview      | service-name        |
      | /meshes/default/services/external                            | External Services   |
      | /meshes/default/services/external/service-name/overview      | service-name        |
      | /meshes/default/services/mesh-services                       | Mesh Services       |
      | /meshes/default/gateways/builtin                             | Built-in Gateways   |
      | /meshes/default/gateways/builtin/gateway.namespace/overview  | gateway             |
      | /meshes/default/gateways/delegated                           | Delegated Gateways  |
      | /meshes/default/gateways/delegated/gateway/overview          | gateway             |
      | /meshes/default/data-planes                                  | Data Plane Proxies  |
      | /meshes/default/data-planes/data-plane-name/overview         | data-plane-name     |
      | /meshes/default/policies/circuit-breakers                    | Policies            |
      | /meshes/default/policies/circuit-breakers/program-0/overview | program-0           |

  Scenario Outline: Visiting the "<Title>" page in "zone" Mode
    Given the environment
      """
      KUMA_MODE: zone
      """
    When I visit the "<URL>" URL
    Then the page title contains "<Title>"

    Examples:
      | URL                                       | Title            |
      | /zones/egresses                           | Egresses         |
      | /zones/egresses/zone-egress-name/overview | zone-egress-name |
