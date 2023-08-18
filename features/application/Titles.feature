Feature: The HTML title is correct on each page
  Scenario Outline: Visiting the "<Title>" page
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

      | /zones/create                           | Create & connect Zone |
      | /zones/zone-cps                         | Zone Control Planes   |
      | /zones/zone-cps/zone-cp-name            | Zone Control Plane    |
      | /zones/zone-ingresses                   | Ingresses             |
      | /zones/zone-ingresses/zone-ingress-name | Ingress               |
      | /zones/zone-egresses                    | Egresses              |
      | /zones/zone-egresses/zone-egress-name   | Egress                |

      | /mesh         | Meshes        |
      | /mesh/default | Mesh overview |

      | /mesh/default/services             | Services |
      | /mesh/default/service/service-name | Service  |

      | /mesh/default/gateways             | Gateways |
      | /mesh/default/gateway/gateway-name | Gateway  |

      | /mesh/default/data-planes                | Data Plane Proxies |
      | /mesh/default/data-plane/data-plane-name | Data Plane Proxy   |

      | /mesh/default/policies/CircuitBreaker         | CircuitBreaker |
      | /mesh/default/policy/CircuitBreaker/program-0 | CircuitBreaker |
