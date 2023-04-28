Feature: The HTML title is correct on each page
  Scenario Outline: Visiting the "<Title>" page
    When I visit the "<URL>" URL
    Then the page title contains "<Title>"

    Examples:
      | URL                                     | Title              |
      | /                                       | Overview           |
      | /diagnostics                            | Diagnostics        |
      | /zones                                  | Zones              |
      | /zone-ingresses                         | Zone Ingresses     |
      | /zone-egresses                          | Zone Egresses      |

      | /mesh/default                           | Mesh overview      |
      | /mesh/default/services                  | Services           |
      | /mesh/default/gateways                  | Gateways           |
      | /mesh/default/data-planes               | Data plane proxies |
      # TODO: This should say Circuit Breakers
      | /mesh/default/policies/circuit-breakers | Manager            |
      # | /mesh/default/policies/circuit-breakers | Circuit Breakers   |
