Feature: Dataplane policies
  Background:
    Given the CSS selectors
      | Alias                              | Selector                                           |
      | builtin-gateway-dataplane-policies | [data-testid='builtin-gateway-dataplane-policies'] |
      | standard-dataplane-policies        | [data-testid='standard-dataplane-policies']        |

  Scenario: Dataplane policies view shows expected content for standard proxy
    Given the URL "/meshes/default/dataplanes/dataplane-1/_overview" responds with
      """
      body:
        mesh: default
        dataplane:
          networking:
            gateway: !!js/undefined
      """
    When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL

    Then the "$standard-dataplane-policies" element exists

  Scenario: Dataplane policies view shows expected content for delegated gateway
    Given the URL "/meshes/default/dataplanes/dataplane-1/_overview" responds with
      """
      body:
        mesh: default
        dataplane:
          networking:
            gateway:
              type: DELEGATED
      """
    When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL

    Then the "$standard-dataplane-policies" element exists

  Scenario: Dataplane policies view shows expected content for delegated gateway (with omitted type field)
    Given the URL "/meshes/default/dataplanes/dataplane-1/_overview" responds with
      """
      body:
        mesh: default
        dataplane:
          networking:
            gateway:
              type: !!js/undefined
      """
    When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL

    Then the "$standard-dataplane-policies" element exists

  Scenario: Dataplane policies view shows expected content for built-in gateway
    Given the URL "/meshes/default/dataplanes/dataplane-1/_overview" responds with
      """
      body:
        mesh: default
        dataplane:
          networking:
            gateway:
              type: BUILTIN
      """
    When I visit the "/meshes/default/data-planes/dataplane-1/policies" URL

    Then the "$builtin-gateway-dataplane-policies" element exists
