Feature: mesh / warnings

  Background:
    Given the CSS selectors
      | Alias                   | Selector                                                                   |
      | mesh-service-activation | [data-testid^='notification-meshes.notifications.mesh-service-activation'] |

  Rule: MeshService activation

    Scenario: meshServices is not configured
      Given the URL "/meshes/default" responds with
        """
        body:
          meshServices: !!js/undefined
        """
      When I visit the "/meshes/default/overview" URL
      Then the "$mesh-service-activation" element exists

    Scenario: meshServices is configured
      Given the URL "/meshes/default" responds with
        """
        body:
          meshServices:
            mode: Exclusive
        """
      When I visit the "/meshes/default/overview" URL
      Then the "$mesh-service-activation" element doesn't exists
