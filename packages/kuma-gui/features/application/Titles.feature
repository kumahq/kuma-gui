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
      | /zones                                                       | Zone control planes |
      | /zones/zone-cp-name/overview                                 | zone-cp-name        |
      | /zones/zone-cp-name/ingresses                                | Ingresses           |
      | /zones/zone-cp-name/ingresses/zone-ingress-name/overview     | zone-ingress-name   |
      | /zones/zone-cp-name/egresses                                 | Egresses            |
      | /zones/zone-cp-name/egresses/zone-egress-name/overview       | zone-egress-name    |
      | /meshes                                                      | Meshes              |
      | /meshes/default/overview                                     | Mesh overview       |
      | /meshes/default/services/internal                            | Services            |
      | /meshes/default/services/internal/service-name/overview      | service-name        |
      | /meshes/default/services/external                            | ExternalServices   |
      | /meshes/default/services/external/service-name/overview      | service-name        |
      | /meshes/default/services/mesh-services                       | MeshServices       |
      | /meshes/default/gateways/builtin                             | Built-in gateways   |
      | /meshes/default/gateways/builtin/gateway.namespace/overview  | gateway             |
      | /meshes/default/gateways/delegated                           | Delegated gateways  |
      | /meshes/default/gateways/delegated/gateway/overview          | gateway             |
      | /meshes/default/data-planes                                  | Data plane proxies  |
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
