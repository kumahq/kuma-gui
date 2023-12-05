import { describe, expect, test } from 'vitest'

import { parse, getTraffic } from './stats'

describe('stats.ts', () => {
  describe('parse', () => {
    test('it works', () => {
      const expected = statsAsJSON()
      const actual = parse(`
cluster.service_with_underscores_8080.strings_with_quotes: "a82b5279-497d-43ad-a5d6-2913957629a5"
cluster.service_with_underscores_8080.strings_without_quotes: a82b5279-497d-43ad-a5d6-2913957629a5
cluster.service_with_underscores_8080.numbers: 0
http.service_with_underscores_8080.strings_with_quotes: "a82b5279-497d-43ad-a5d6-2913957629a5"
http.service_with_underscores_8080.strings_without_quotes: a82b5279-497d-43ad-a5d6-2913957629a5
http.service_with_underscores_8080.numbers: 0
tcp.service_with_underscores_8080.strings_with_quotes: "a82b5279-497d-43ad-a5d6-2913957629a5"
tcp.service_with_underscores_8080.strings_without_quotes: a82b5279-497d-43ad-a5d6-2913957629a5
tcp.service_with_underscores_8080.numbers: 0
cluster.admin.connections_accepted_per_socket_event: P0(nan,1) P25(nan,1.025) P50(nan,1.05) P75(nan,1.075) P90(nan,1.09) P95(nan,1.095) P99(nan,1.099) P99.5(nan,1.0995) P99.9(nan,1.0999) P100(nan,1.1)
cluster.127.0.0.1.borken_due_to_ip: 0
not_cluster_http_or_tcp_as_root.service_with_underscores_8080.numbers: 0
`)
      expect(actual).toStrictEqual(expected)
    })
  })
  describe('getTraffic', () => {
    test('picks the right name depending on the filter', () => {
      const actual = getTraffic(statsAsJSON(), (key: string) => key === 'admin')
      expect(actual.length).toEqual(1)
      expect(actual[0].cluster?.connections_accepted_per_socket_event).toEqual('P0(nan,1) P25(nan,1.025) P50(nan,1.05) P75(nan,1.075) P90(nan,1.09) P95(nan,1.095) P99(nan,1.099) P99.5(nan,1.0995) P99.9(nan,1.0999) P100(nan,1.1)')
    })
    test('sets cluster, http and tcp', () => {
      const actual = getTraffic(statsAsJSON(), (key: string) => key.startsWith('service_with_underscores_'))
      expect(actual.length).toEqual(1);
      (['cluster', 'http', 'tcp'] as const).forEach((item) => {
        expect(actual[0][item]).toBeDefined()
      })
    })
  })
})

function statsAsJSON() {
  return {
    cluster: {
      127: {
        0: {
          0: {
            1: {
              borken_due_to_ip: 0,
            },
          },
        },
      },
      service_with_underscores_8080: {
        strings_with_quotes: 'a82b5279-497d-43ad-a5d6-2913957629a5',
        strings_without_quotes: 'a82b5279-497d-43ad-a5d6-2913957629a5',
        numbers: 0,
      },
      admin: {
        connections_accepted_per_socket_event: 'P0(nan,1) P25(nan,1.025) P50(nan,1.05) P75(nan,1.075) P90(nan,1.09) P95(nan,1.095) P99(nan,1.099) P99.5(nan,1.0995) P99.9(nan,1.0999) P100(nan,1.1)',
      },
    },
    http: {
      service_with_underscores_8080: {
        strings_with_quotes: 'a82b5279-497d-43ad-a5d6-2913957629a5',
        strings_without_quotes: 'a82b5279-497d-43ad-a5d6-2913957629a5',
        numbers: 0,
      },
    },
    tcp: {
      service_with_underscores_8080: {
        strings_with_quotes: 'a82b5279-497d-43ad-a5d6-2913957629a5',
        strings_without_quotes: 'a82b5279-497d-43ad-a5d6-2913957629a5',
        numbers: 0,
      },
    },
  }
}
