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

  describe('dataplane.dataplaneType', () => {
    test(
      "an empty networking.gateway.type gets set to the default of 'delegated'",
      async ({ fixture }) => {
        expect.assertions(2)
        const actual = await fixture.setup((item) => {
          if (typeof item.dataplane.networking.gateway !== 'undefined') {
            delete item.dataplane.networking.gateway.type
            expect(item.dataplane.networking.gateway.type).toBeUndefined()
          }
          return item
        }, {
          env: {
            KUMA_DATAPLANE_TYPE: 'delegated',
            KUMA_DATAPLANEINBOUND_COUNT: '1',
          },
        })
        expect(actual.dataplaneType).toStrictEqual('delegated')
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
            item.dataplane.networking.inbound[0].state = 'Ready'
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
            item.dataplane.networking.inbound[0].state = 'Ready'
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
            item.dataplane.networking.inbound[0].state = 'Ready'
            item.dataplane.networking.inbound[1].state = 'NotReady'
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
            item.dataplane.networking.inbound[0].state = 'NotReady'
            item.dataplane.networking.inbound[1].state = 'NotReady'
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
            item.dataplane.networking.inbound[0].state = 'NotReady'
            item.dataplane.networking.inbound[1].state = 'NotReady'
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
            item.dataplane.networking.inbound[0].state = 'NotReady'
            item.dataplane.networking.inbound[1].state = 'NotReady'
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
      "if state isn't set we default it to Ready",
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
        expect(actual.dataplane.networking.inbounds[0].state).toStrictEqual('Ready')
      },
    )
    test(
      "if state is set we don't overwrite it",
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (item.dataplane.networking.inbound?.length === 1) {
            item.dataplane.networking.inbound[0].state = 'NotReady'
          }
          return item
        }, {
          env: {
            KUMA_DATAPLANEINBOUND_COUNT: '1',
          },
        })
        expect(actual.dataplane.networking.inbounds[0].state).toStrictEqual('NotReady')
      },
    )
  })
  describe('dataplane.config', () => {
    test(
      'config is derived from Dataplane and based on DataplaneOverview data',
      async ({ fixture }) => {
        const expected = {
          type: 'Dataplane',
          name: 'dp-name',
          mesh: 'dp-mesh',
          creationTime: '2021-02-19T07:06:16.384057Z',
          modificationTime: '2021-02-29T07:06:00.00Z',
          networking: {
            address: '167.61.18.108',
            type: 'sidecar',
            inboundAddress: 'localhost',
            inbounds: [],
            outbounds: [],
          },
        }

        const actual = await fixture.setup((item) => {
          item.name = expected.name
          item.mesh = expected.mesh
          item.creationTime = expected.creationTime
          item.modificationTime = expected.modificationTime
          item.dataplane.networking = expected.networking

          return item
        })

        expect(actual.config).toStrictEqual(expected)
      })
  })
})
