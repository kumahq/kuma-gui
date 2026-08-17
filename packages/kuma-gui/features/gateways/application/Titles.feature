Feature: gateways / application / titles

  Background:
    Given the environment
      """
      KUMA_GATEWAYS_ENABLED: true
      """

  Scenario Outline: Visiting "<URL>" page in "global" Mode
    Given the environment
      """
      KUMA_MODE: global
      """
    When I visit the "<URL>" URL
    Then the page title contains "<Title>"

    Examples:
      | URL                                                         | Title              |
      | /meshes/default/gateways/builtin                            | Built-in gateways  |
      | /meshes/default/gateways/builtin/gateway.namespace/overview | gateway            |
      | /meshes/default/gateways/delegated                          | Delegated gateways |
      | /meshes/default/gateways/delegated/gateway/overview         | gateway            |
