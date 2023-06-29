Feature: The HTML title is correct on each page
  Scenario Outline: Visiting the "<Title>" page
    When I visit the "<URL>" URL
    Then the page title contains "<Title>"

    Examples:
      | URL                                                 | Title                         |
      | /                                                   | Overview                      |
      | /diagnostics                                        | Diagnostics                   |

      | /onboarding                                         | Welcome to Kuma!              |
      | /onboarding/deployment-types                        | Deployment Types              |
      | /onboarding/configuration-types                     | Configuration Types           |
      | /onboarding/multi-zone                              | Multizone                     |
      | /onboarding/create-mesh                             | Create the Mesh               |
      | /onboarding/add-services                            | Add new services              |
      | /onboarding/add-services-code                       | Add new services              |
      | /onboarding/dataplanes-overview                     | Data plane overview           |
      | /onboarding/completed                               | Completed                     |

      | /zones/create                                       | Create & connect Zone         |
      | /zones/zone-cps                                     | Zone CPs                      |
      | /zones/zone-cps/zone-cp-name                        | Zone CP                       |
      | /zones/zone-ingresses                               | Zone Ingresses                |
      | /zones/zone-ingresses/zone-ingress-name             | Zone Ingress                  |
      | /zones/zone-egresses                                | Zone Egresses                 |
      | /zones/zone-egresses/zone-egress-name               | Zone Egress                   |

      | /mesh                                               | Meshes                        |
      | /mesh/default                                       | Mesh overview                 |

      | /mesh/default/services                              | Services                      |
      | /mesh/default/service/service-name                  | Service                       |

      | /mesh/default/gateways                              | Gateways                      |
      | /mesh/default/gateway/gateway-name                  | Gateway                       |

      | /mesh/default/data-planes                           | Data plane proxies            |
      | /mesh/default/data-plane/data-plane-name            | Data plane proxy              |

      | /mesh/default/policies/circuit-breakers             | CircuitBreaker                |
      | /mesh/default/policy/circuit-breakers/program-0 | Policy                        |
