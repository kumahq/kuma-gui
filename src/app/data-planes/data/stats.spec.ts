import { describe, expect, test } from 'vitest'

import { parse, getTraffic } from './stats'

describe('stats.ts', () => {
  describe('parse', () => {
    test('it works', () => {
      const expected = statsAsJSON()
      const actual = parse(`
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
http.127.0.0.1.borken_due_to_ip: 0
not_http_or_tcp_as_root.service_with_underscores_8080.numbers: 0
`)
      expect(actual).toStrictEqual(expected)
    })
  })
  describe('getTraffic', () => {
    test('picks the right name depending on the filter', () => {
      const actual = getTraffic(statsAsJSON().cluster, (key: string) => key === 'admin')
      expect(actual.length).toEqual(1)
      expect(actual[0].http?.connections_accepted_per_socket_event).toEqual('P0(nan,1) P25(nan,1.025) P50(nan,1.05) P75(nan,1.075) P90(nan,1.09) P95(nan,1.095) P99(nan,1.099) P99.5(nan,1.0995) P99.9(nan,1.0999) P100(nan,1.1)')
    })
    test('sets connection http, tcp and grpc', () => {
      let actual = getTraffic(statsAsJSON().cluster, (key: string) => key.startsWith('service_with_underscores_8080'))
      expect(actual.length).toEqual(1)
      expect(actual[0].http).toBeDefined()

      actual = getTraffic(statsAsJSON().cluster, (key: string) => key.startsWith('service_with_underscores_8081'))
      expect(actual.length).toEqual(1)
      expect(actual[0].tcp).toBeDefined()

      actual = getTraffic(statsAsJSON().cluster, (key: string) => key.startsWith('localhost_'))
      expect(actual.length).toEqual(1)
      expect(actual[0].grpc).toBeDefined()
    })
  })
})

function statsAsJSON() {
  return {
    cluster: {
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
                borken_due_to_ip: 0,
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
      unknown: {
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
    },
    listener: {
      http: {
        'edge-gateway_8081': {
          downstream_rq_1xx: 0,
        },
      },
    },
  }
}
