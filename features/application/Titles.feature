Feature: application / titles
  Scenario Outline: Visiting the "<Title>" page in "global" Mode
    Given the environment
      """
      KUMA_MODE: global
      """
    When I visit the "<URL>" URL
    Then the page title contains "<Title>"

    Examples:
      | URL          | Title       |
      | /            | Overview    |
      | /diagnostics | Diagnostics |

      | /onboarding                     | Welcome to Kuma!    |
      | /onboarding/deployment-types    | Deployment Types    |
      | /onboarding/configuration-types | Configuration Types |
      | /onboarding/multi-zone          | Multizone           |
      | /onboarding/create-mesh         | Create the Mesh     |
      | /onboarding/add-services        | Add new services    |
      | /onboarding/add-services-code   | Add new services    |
      | /onboarding/dataplanes-overview | Data plane overview |
      | /onboarding/completed           | Completed           |

      | /zones/-create                                           | Create & connect Zone |
      | /zones                                                   | Zone Control Planes   |
      | /zones/zone-cp-name/overview                             | zone-cp-name          |
      | /zones/zone-cp-name/ingresses                            | Ingresses             |
      | /zones/zone-cp-name/ingresses/zone-ingress-name/overview | zone-ingress-name     |
      | /zones/zone-cp-name/egresses                             | Egresses              |
      | /zones/zone-cp-name/egresses/zone-egress-name/overview   | zone-egress-name      |

      | /meshes                  | Meshes        |
      | /meshes/default/overview | Mesh overview |

      | /meshes/default/services                       | Services     |
      | /meshes/default/services/service-name/overview | service-name |

      | /meshes/default/data-planes                          | Data Plane Proxies |
      | /meshes/default/data-planes/data-plane-name/overview | data-plane-name    |

      | /meshes/default/policies/circuit-breakers                    | Policies  |
      | /meshes/default/policies/circuit-breakers/program-0/overview | program-0 |

  Scenario Outline: Visiting the "<Title>" page in "standalone" Mode
    Given the environment
      """
      KUMA_MODE: standalone
      """
    When I visit the "<URL>" URL
    Then the page title contains "<Title>"

    Examples:
      | URL                                       | Title            |
      | /zones/egresses                           | Egresses         |
      | /zones/egresses/zone-egress-name/overview | zone-egress-name |
