Feature: Dataplane traffic
  Background:
    Given the CSS selectors
      | Alias       | Selector                                    |
      | detail-view | [data-testid='data-plane-detail-tabs-view'] |
      | traffic     | [data-testid='dataplane-traffic']           |
      | inbound     | [data-testid='dataplane-inbound']           |
      | outbound    | [data-testid='dataplane-outbound']          |

  # IMPORTANT: These tests use fixtures rather than random mocks. If they
  # become troublesome to maintain or work with, feel free to replace with
  # something else. They were originally added to give confidence through
  # actual data rather than random mocks.

  Scenario: Builtin gateway with inbound and outbound stats
    When I visit the "/meshes/default/data-planes/default-gateway-instance-1-86cbb55644-6rxhg.kuma-demo/overview" URL

    And the "$detail-view" element contains "default-gateway-instance-1-86cbb55644-6rxhg.kuma-demo"
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
    When I visit the "/meshes/default/data-planes/kong-gateway-5bcc776cb4-578gc.kong/overview" URL

    And the "$detail-view" element contains "kong-gateway-5bcc776cb4-578gc.kong"
    And the "$inbound" element exists 0 times
    And the "$outbound" element exists 1 times

    And the "$outbound:nth-child(1) [data-testid='rq-2xx'] dd" element contains "722"
    And the "$outbound:nth-child(1) [data-testid='rq-4xx'] dd" element contains "1"
    And the "$outbound:nth-child(1) [data-testid='rq-5xx'] dd" element contains "0"

  Scenario: HTTP sidecar with inbound and outbound stats
    When I visit the "/meshes/default/data-planes/demo-app-fcc8bc4cb-5xjwd.kuma-demo/overview" URL

    And the "$detail-view" element contains "demo-app-fcc8bc4cb-5xjwd.kuma-demo"
    And the "$inbound" element exists 1 time
    And the "$outbound" element exists 1 time

    And the "$inbound:nth-child(1) [data-testid='rq-2xx'] dd" element contains "4,614"
    And the "$inbound:nth-child(1) [data-testid='rq-3xx'] dd" element contains "17"
    And the "$inbound:nth-child(1) [data-testid='rq-4xx'] dd" element contains "3"
    And the "$inbound:nth-child(1) [data-testid='rq-5xx'] dd" element contains "0"

    And the "$outbound:nth-child(1) [data-testid='connections-total'] dd" element contains "4,608"
    And the "$outbound:nth-child(1) [data-testid='bytes-received'] dd" element contains "359"
    And the "$outbound:nth-child(1) [data-testid='bytes-sent'] dd" element contains "24.8"

  Scenario: gRPC sidecar with inbound and outbound stats
    When I visit the "/meshes/default/data-planes/grpc-service-75b4ccdfd5-z2jmp.kuma-demo/overview" URL

    And the "$detail-view" element contains "grpc-service-75b4ccdfd5-z2jmp.kuma-demo"
    And the "$inbound" element exists 1 time
    And the "$outbound" element exists 0 times

    And the "$inbound:nth-child(1) [data-testid='grpc-success'] dd" element contains "16"
    And the "$inbound:nth-child(1) [data-testid='grpc-failure'] dd" element contains "0"

  Scenario: TCP sidecar with inbound and outbound stats
    When I visit the "/meshes/default/data-planes/redis-54754f5b57-xl2tw.kuma-demo/overview" URL

    And the "$detail-view" element contains "redis-54754f5b57-xl2tw.kuma-demo"
    And the "$inbound" element exists 1 time
    And the "$outbound" element exists 0 times

    And the "$inbound:nth-child(1) [data-testid='connections-total'] dd" element contains "4,953"
    And the "$inbound:nth-child(1) [data-testid='bytes-received'] dd" element contains "26.6"
    And the "$inbound:nth-child(1) [data-testid='bytes-sent'] dd" element contains "390"


