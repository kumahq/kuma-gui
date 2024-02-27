Feature: mesh / builtin-gateways / item
  Background:
    Given the CSS selectors
      | Alias      | Selector                                         |
      | tabs-view  | [data-testid='builtin-gateway-detail-tabs-view'] |
      | dataplanes | [data-testid='data-plane-collection']            |
      | config     | [data-testid='config']                           |
    Given the URL "/meshes/default/meshgateways/gateway-1" responds with
      """
      body:
        networking:
          address: '1.2.3.4'
      """
    Given the URL "/meshes/default/meshgateways/gateway-1/_resources/dataplanes" responds with
      """
      body:
        items:
          - name: backend
          - name: db
          - name: frontend
      """

  Scenario: Overview tab has expected content
    When I visit the "/meshes/default/gateways/builtin/gateway-1/overview" URL

    Then the "$tabs-view" element contains "gateway-1"
    Then the "$dataplanes" element exists

  Scenario: Config tab has expected content
    When I visit the "/meshes/default/gateways/builtin/gateway-1/config" URL

    Then the "$config" element exists
