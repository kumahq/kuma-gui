import { describe, expect, test } from 'vitest'

import { Stat, ConnectionCollection } from './'

describe('Stat', () => {
  describe('fromObject', () => {
    test('it works', () => {
      const expected = statsAsJSON()
      const actual = Stat.fromCollection(`
cluster.localhost_9090.grpc.0: 12
cluster.localhost_9090.grpc.request_message_count: 12
cluster.localhost_9090.grpc.response_message_count: 12
cluster.localhost_9090.grpc.success: 12
cluster.localhost_9090.grpc.total: 12
listener.10.244.0.11_8081.http.edge-gateway.downstream_rq_1xx: 0
http.service_with_underscores_8080.strings_with_quotes: "a82b5279-497d-43ad-a5d6-2913957629a5"
http.service_with_underscores_8080.strings_without_quotes: a82b5279-497d-43ad-a5d6-2913957629a5
http.service_with_underscores_8080.numbers: 0
http.service_with_underscores_8080.strings_with_quotes: "a82b5279-497d-43ad-a5d6-2913957629a5"
http.service_with_underscores_8080.strings_without_quotes: a82b5279-497d-43ad-a5d6-2913957629a5
http.service_with_underscores_8080.numbers: 0
tcp.service_with_underscores_8081.strings_with_quotes: "a82b5279-497d-43ad-a5d6-2913957629a5"
tcp.service_with_underscores_8081.strings_without_quotes: a82b5279-497d-43ad-a5d6-2913957629a5
tcp.service_with_underscores_8081.numbers: 0
http.admin.connections_accepted_per_socket_event: P0(nan,1) P25(nan,1.025) P50(nan,1.05) P75(nan,1.075) P90(nan,1.09) P95(nan,1.095) P99(nan,1.099) P99.5(nan,1.0995) P99.9(nan,1.0999) P100(nan,1.1)
http.127.0.0.1.borken_due_to_ip_but_never_happens: 0
not_http_or_tcp_as_root.service_with_underscores_8080.numbers: 0
`)
      expect(actual).toStrictEqual(expected)
    })
  })
})
describe('ConnectionCollection', () => {
  describe('fromObject', () => {
    test('it works', () => {
      const expected = {
        listener: {
          '10.244.0.11_8081': {
            tcp: {},
            $clusterName: 'edge-gateway',
            http: {
              downstream_rq_1xx: 0,
            },
          },
        },
        cluster: {
          localhost_9090: {
            $kind: '',
            tcp: {},
            grpc: {
              0: 12,
              request_message_count: 12,
              response_message_count: 12,
              success: 12,
              total: 12,
            },
          },
        },
      }
      const actual = ConnectionCollection.fromObject(statsAsJSON())
      expect(actual).toStrictEqual(expected)
    })
  })
})

function statsAsJSON() {
  return {
    http: {
      service_with_underscores_8080: {
        strings_with_quotes: 'a82b5279-497d-43ad-a5d6-2913957629a5',
        strings_without_quotes: 'a82b5279-497d-43ad-a5d6-2913957629a5',
        numbers: 0,
      },
      127: {
        0: {
          0: {
            1: {
              borken_due_to_ip_but_never_happens: 0,
            },
          },
        },
      },
      admin: {
        connections_accepted_per_socket_event: 'P0(nan,1) P25(nan,1.025) P50(nan,1.05) P75(nan,1.075) P90(nan,1.09) P95(nan,1.095) P99(nan,1.099) P99.5(nan,1.0995) P99.9(nan,1.0999) P100(nan,1.1)',
      },
    },
    tcp: {
      service_with_underscores_8081: {
        strings_with_quotes: 'a82b5279-497d-43ad-a5d6-2913957629a5',
        strings_without_quotes: 'a82b5279-497d-43ad-a5d6-2913957629a5',
        numbers: 0,
      },
    },
    cluster: {
      localhost_9090: {
        grpc: {
          0: 12,
          request_message_count: 12,
          response_message_count: 12,
          success: 12,
          total: 12,
        },
      },
    },
    listener: {
      '10.244.0.11_8081': {
        http: {
          'edge-gateway': {
            downstream_rq_1xx: 0,
          },
        },
      },
    },
  }
}
