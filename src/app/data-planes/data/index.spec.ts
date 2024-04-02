import { describe, expect, test as _test } from 'vitest'

import { Dataplane, DataplaneOverview } from './'
import { plugin, server } from '@/test-support/data'
import dataplaneMock from '@/test-support/mocks/src/meshes/_/dataplanes/_'
import mock from '@/test-support/mocks/src/meshes/_/dataplanes/_/_overview'

describe('Dataplane', () => {
  const test = _test.extend(plugin<typeof Dataplane>(
    Dataplane,
    server(dataplaneMock, {
      params: {
        mesh: 'default',
        name: 'dataplane',
      },
    }),
  ))

  describe('dataplane.config', () => {
    test(
      'config is the same as the original API object',
      async ({ fixture }) => {
        let expected
        const actual = await fixture.setup((item) => {
          expected = item
          return item
        })
        expect(actual.config).toStrictEqual(expected)
      },
    )
  })
  describe('dataplane.networking.inbounds', () => {
    test(
      'absent inbound, inbounds remains defined',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          delete item.networking.inbound
          return item
        })
        expect(actual.networking.inbounds).toBeDefined()
      },
    )
    test(
      'dataplane.networking.inbound.service is set',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          return item
        }, {
          env: {
            KUMA_DATAPLANEINBOUND_COUNT: '1',
          },
        })
        expect(actual.networking.inbounds[0].service).toStrictEqual(actual.networking.inbounds[0].tags['kuma.io/service'])
      },
    )
  })
  describe('dataplane.networking.outbounds', () => {
    test(
      'absent outbound, outbounds remains defined',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          delete item.networking.outbound
          return item
        })
        expect(actual.networking.outbounds).toBeDefined()
      }, {

      },
    )
  })
})
describe('DataplaneOverview', () => {
  const test = _test.extend(plugin<typeof DataplaneOverview>(
    DataplaneOverview,
    server(mock, {
      params: {
        name: 'zone',
      },
    }),
  ))
  describe('labels', () => {
    test(
      "if labels isn't set we default it to {}",
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.labels !== 'undefined') {
            delete item.labels
          }
          return item
        }, {
          env: {
          },
        })
        expect(actual.labels).toBeDefined()
        expect(Object.keys(actual.labels).length === 0).toBeDefined()
      },
    )
    test(
      'display-name and namespace reshaping',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          item.name = 'old-name.namespace'
          item.labels = {
            'kuma.io/display-name': 'new-name',
            'k8s.kuma.io/namespace': 'namespace',
          }
          return item
        }, {
          env: {
          },
        })
        expect(actual.name).toStrictEqual('new-name')
        expect(actual.namespace).toStrictEqual('namespace')
      },
    )
  })

  describe('dataplaneInsight.subscriptions', () => {
    test(
      'absent dataplaneInsight remains defined',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          delete item.dataplaneInsight
          return item
        })
        expect(actual.dataplaneInsight).toBeDefined()
      },
    )
    test(
      'no subscriptions, connectedSubscription remains undefined, status = offline',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.dataplaneInsight !== 'undefined') {
            item.dataplaneInsight.subscriptions = []
          }
          item.dataplane.networking.inbound = []
          return item
        })
        expect(actual.dataplaneInsight.subscriptions.length).toStrictEqual(0)
        expect(actual.dataplaneInsight.connectedSubscription).toBeUndefined()
        expect(actual.status).toStrictEqual('offline')
      },
    )
    test(
      'all disconnected subscriptions, connectedSubscription remains undefined, status = offline',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.dataplaneInsight !== 'undefined') {
            item.dataplaneInsight.subscriptions.forEach((item) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              item.disconnectTime = '2021-03-19T07:06:16.384057Z'
            })
          }
          // take inbounds out of the equation
          if (item.dataplane.networking.inbound?.length === 1) {
            item.dataplane.networking.inbound[0].health = {
              ready: true,
            }
          }
          return item
        }, {
          env: {
            KUMA_SUBSCRIPTION_COUNT: '10',
            KUMA_DATAPLANEINBOUND_COUNT: '1',
          },
        })
        expect(actual.dataplaneInsight.subscriptions.length).toStrictEqual(10)
        expect(actual.dataplaneInsight.connectedSubscription).toBeUndefined()
        expect(actual.status).toStrictEqual('offline')
      },
    )
    test(
      'one connected subscription, connectedSubscription is set, status = online',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.dataplaneInsight !== 'undefined') {
            item.dataplaneInsight.subscriptions.forEach((item, i) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              item.disconnectTime = '2021-03-19T07:06:16.384057Z'
              if (i === 5) {
                delete item.disconnectTime
              }
            })
          }
          // take inbounds out of the equation
          if (item.dataplane.networking.inbound?.length === 1) {
            item.dataplane.networking.inbound[0].health = {
              ready: true,
            }
          }
          return item
        }, {
          env: {
            KUMA_SUBSCRIPTION_COUNT: '10',
            KUMA_DATAPLANEINBOUND_COUNT: '1',
          },
        })
        expect(actual.dataplaneInsight.subscriptions.length).toStrictEqual(10)
        expect(actual.dataplaneInsight.connectedSubscription).toBeDefined()
        expect(actual.status).toStrictEqual('online')
      },
    )
    test(
      'one connected subscription, 1 unhealthy inbound, status = partially_degraded',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.dataplaneInsight !== 'undefined') {
            item.dataplaneInsight.subscriptions.forEach((item, i) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              item.disconnectTime = '2021-03-19T07:06:16.384057Z'
              if (i === 5) {
                delete item.disconnectTime
              }
            })
          }
          if (item.dataplane.networking.inbound?.length === 2) {
            item.dataplane.networking.inbound[0].health = {
              ready: true,
            }
            item.dataplane.networking.inbound[1].health = {
              ready: false,
            }
          }
          return item
        }, {
          env: {
            KUMA_SUBSCRIPTION_COUNT: '10',
            KUMA_DATAPLANEINBOUND_COUNT: '2',
          },
        })
        expect(actual.dataplaneInsight.subscriptions.length).toStrictEqual(10)
        expect(actual.dataplaneInsight.connectedSubscription).toBeDefined()
        expect(actual.status).toStrictEqual('partially_degraded')
      },
    )
    test(
      'one connected subscription, all unhealthy inbounds, status = offline',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.dataplaneInsight !== 'undefined') {
            item.dataplaneInsight.subscriptions.forEach((item, i) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              item.disconnectTime = '2021-03-19T07:06:16.384057Z'
              if (i === 5) {
                delete item.disconnectTime
              }
            })
          }
          if (item.dataplane.networking.inbound?.length === 2) {
            item.dataplane.networking.inbound[0].health = {
              ready: false,
            }
            item.dataplane.networking.inbound[1].health = {
              ready: false,
            }
          }
          return item
        }, {
          env: {
            KUMA_SUBSCRIPTION_COUNT: '10',
            KUMA_DATAPLANEINBOUND_COUNT: '2',
          },
        })
        expect(actual.dataplaneInsight.subscriptions.length).toStrictEqual(10)
        expect(actual.dataplaneInsight.connectedSubscription).toBeDefined()
        expect(actual.status).toStrictEqual('offline')
      },
    )
    test(
      'one connected subscription, all unhealthy inbounds, but builtin gateway, status = online',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.dataplaneInsight !== 'undefined') {
            item.dataplaneInsight.subscriptions.forEach((item, i) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              item.disconnectTime = '2021-03-19T07:06:16.384057Z'
              if (i === 5) {
                delete item.disconnectTime
              }
            })
          }
          if (item.dataplane.networking.inbound?.length === 2) {
            item.dataplane.networking.inbound[0].health = {
              ready: false,
            }
            item.dataplane.networking.inbound[1].health = {
              ready: false,
            }
          }
          return item
        }, {
          env: {
            KUMA_DATAPLANE_TYPE: 'builtin',
            KUMA_SUBSCRIPTION_COUNT: '10',
            KUMA_DATAPLANEINBOUND_COUNT: '2',
          },
        })
        expect(actual.dataplaneInsight.subscriptions.length).toStrictEqual(10)
        expect(actual.dataplaneInsight.connectedSubscription).toBeDefined()
        expect(actual.status).toStrictEqual('online')
      },
    )
    test(
      'one connected subscription, all unhealthy inbounds, but delegated gateway, status = online',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.dataplaneInsight !== 'undefined') {
            item.dataplaneInsight.subscriptions.forEach((item, i) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              item.disconnectTime = '2021-03-19T07:06:16.384057Z'
              if (i === 5) {
                delete item.disconnectTime
              }
            })
          }
          if (item.dataplane.networking.inbound?.length === 2) {
            item.dataplane.networking.inbound[0].health = {
              ready: false,
            }
            item.dataplane.networking.inbound[1].health = {
              ready: false,
            }
          }
          return item
        }, {
          env: {
            KUMA_DATAPLANE_TYPE: 'delegated',
            KUMA_SUBSCRIPTION_COUNT: '10',
            KUMA_DATAPLANEINBOUND_COUNT: '2',
          },
        })
        expect(actual.dataplaneInsight.subscriptions.length).toStrictEqual(10)
        expect(actual.dataplaneInsight.connectedSubscription).toBeDefined()
        expect(actual.status).toStrictEqual('online')
      },
    )
  })
  describe('dataplane.inbounds', () => {
    test(
      "if health isn't set we default it to true",
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (item.dataplane.networking.inbound?.length === 1) {
            item.dataplane.networking.inbound[0] = {
              port: 1,
              tags: {
                'kuma.io/service': 'service-name',
              },
            }
          }
          return item
        }, {
          env: {
            KUMA_DATAPLANEINBOUND_COUNT: '1',
          },
        })
        expect(actual.dataplane.networking.inbounds[0].health.ready).toStrictEqual(true)
      },
    )
    test(
      "if health is set we don't overwrite it",
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (item.dataplane.networking.inbound?.length === 1) {
            item.dataplane.networking.inbound[0].health = {
              ready: false,
            }
          }
          return item
        }, {
          env: {
            KUMA_DATAPLANEINBOUND_COUNT: '1',
          },
        })
        expect(actual.dataplane.networking.inbounds[0].health.ready).toStrictEqual(false)
      },
    )
  })
})
