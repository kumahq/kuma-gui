Feature: gateways / mesh / dataplanes / connections / Connections

  Background:
    Given the CSS selectors
      | Alias       | Selector                                    |
      | detail-view | [data-testid='data-plane-detail-tabs-view'] |
      | inbound     | [data-testid='dataplane-inbound']           |
      | outbound    | [data-testid='dataplane-outbound']          |
    And the environment
      """
      KUMA_GATEWAYS_ENABLED: true
      """
  # IMPORTANT: These tests use fixtures rather than random mocks. If they
  # become troublesome to maintain or work with, feel free to replace with
  # something else. They were originally added to give confidence through
  # actual data rather than random mocks.

  Scenario: Builtin gateway with inbound and outbound stats
    Given the URL "/_kri/kri_dp_default_zone-1_kuma-demo_default-gateway-instance-1-86cbb55644-6rxhg_" responds with
      """
      body:
        name: default-gateway-instance-1-86cbb55644-6rxhg.kuma-demo
        kri: kri_dp_default_zone-1_kuma-demo_default-gateway-instance-1-86cbb55644-6rxhg_
        labels:
          kuma.io/display-name: default-gateway-instance-1-86cbb55644-6rxhg
      """
    When I visit the "/meshes/default/data-planes/kri_dp_default_zone-1_kuma-demo_default-gateway-instance-1-86cbb55644-6rxhg_/overview" URL
    And the "$detail-view" element contains "default-gateway-instance-1-86cbb55644-6rxhg"
    And the "$inbound" element exists 4 times
    And the "$outbound" element exists 3 times
    And the "$inbound:nth-child(1) [data-testid='connections-total'] dd" element contains "1"
    And the "$inbound:nth-child(2) [data-testid='connections-total'] dd" element contains "0"
    And the "$inbound:nth-child(3) [data-testid='rq-2xx'] dd" element contains "691"
    And the "$inbound:nth-child(3) [data-testid='rq-3xx'] dd" element contains "4"
    And the "$inbound:nth-child(3) [data-testid='rq-4xx'] dd" element contains "5"
    And the "$inbound:nth-child(3) [data-testid='rq-5xx'] dd" element contains "0"
    And the "$inbound:nth-child(4) [data-testid='rq-2xx'] dd" element contains "2"
    And the "$inbound:nth-child(4) [data-testid='rq-4xx'] dd" element contains "0"
    And the "$inbound:nth-child(4) [data-testid='rq-5xx'] dd" element contains "0"
    And the "$outbound:nth-child(1) [data-testid='rq-2xx'] dd" element contains "355"
    And the "$outbound:nth-child(1) [data-testid='rq-3xx'] dd" element contains "4"
    And the "$outbound:nth-child(1) [data-testid='rq-4xx'] dd" element contains "0"
    And the "$outbound:nth-child(1) [data-testid='rq-5xx'] dd" element contains "0"
    And the "$outbound:nth-child(2) [data-testid='rq-2xx'] dd" element contains "2"
    And the "$outbound:nth-child(2) [data-testid='rq-4xx'] dd" element contains "2"
    And the "$outbound:nth-child(2) [data-testid='rq-5xx'] dd" element contains "0"
    And the "$outbound:nth-child(3) [data-testid='connections-total'] dd" element contains "1"
    And the "$outbound:nth-child(3) [data-testid='bytes-received'] dd" element contains "14"
    And the "$outbound:nth-child(3) [data-testid='bytes-sent'] dd" element contains "167"

  Scenario: Delegated gateway with inbound and outbound stats
    Given the URL "/_kri/kri_dp_default_zone-1_kong_kong-gateway-5bcc776cb4-578gc_" responds with
      """
      body:
        name: kong-gateway-5bcc776cb4-578gc.kong
        kri: kri_dp_default_zone-1_kong_kong-gateway-5bcc776cb4-578gc_
        labels:
          kuma.io/display-name: kong-gateway-5bcc776cb4-578gc
      """
    When I visit the "/meshes/default/data-planes/kri_dp_default_zone-1_kong_kong-gateway-5bcc776cb4-578gc_/overview" URL
    And the "$detail-view" element contains "kong-gateway-5bcc776cb4-578gc"
    And the "$inbound" element exists 0 times
    And the "$outbound" element exists 1 times
    And the "$outbound:nth-child(1) [data-testid='rq-2xx'] dd" element contains "722"
    And the "$outbound:nth-child(1) [data-testid='rq-4xx'] dd" element contains "1"
    And the "$outbound:nth-child(1) [data-testid='rq-5xx'] dd" element contains "0"
