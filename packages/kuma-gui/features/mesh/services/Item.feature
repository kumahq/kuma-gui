Feature: mesh / services / item

  Background:
    Given the CSS selectors
      | Alias     | Selector                                      |
      | hostnames | [data-testid='hostnames-collection'] tbody tr |

  Rule: With a mesh service of type mesh-service, mesh-multi-zone-service or mesh-external-service

    Scenario: Hostnames listing exists for different mesh service types
      Given the URL "<API>" responds with
        """
        body:
          items:
            - hostname: my-meshservice.<SVC>.mesh.local
              zones:
                - name: zone-1
          total: 1
        """
      When I visit the "<URL>" URL
      Then the "$hostnames:nth-child(1)" element exists

      Examples:
        | API                                                             | URL                                                                                            | SVC    |
        | /meshes/default/meshservices/my-meshservice/_hostnames          | /meshes/default/services/mesh-services/kri_msvc_default___my-meshservice_/overview             | svc    |
        | /meshes/default/meshexternalservices/my-meshservice/_hostnames  | /meshes/default/services/mesh-external-services/kri_extsvc_default___my-meshservice_/overview  | extsvc |
        | /meshes/default/meshmultizoneservices/my-meshservice/_hostnames | /meshes/default/services/mesh-multi-zone-services/kri_mzsvc_default___my-meshservice_/overview | mzsvc  |
