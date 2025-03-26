import { describe, expect, test as _test } from 'vitest'

import { ZoneEgressOverview } from './'
import { plugin, server } from '@/test-support/data'
import mock from '@/test-support/mocks/src/zoneegresses/_/_overview'

// zoneEgress tests are very similar to zoneIngress tests
// so anything you amend here you should consider also amending in
// the zoneIngress tests
describe('ZoneEgressOverview', () => {
  const test = _test.extend(plugin<typeof ZoneEgressOverview>(
    ZoneEgressOverview,
    server(mock, {
      params: {
        name: 'zone',
      },
    }),
  ))
  //
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
  describe('zoneEgressInsight.subscriptions', () => {
    test(
      'absent enabled, a connected subscription, config has properties',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          delete item.zoneEgressInsight
          return item
        })
        expect(actual.zoneEgressInsight).toBeDefined()
      },
    )

    test(
      'no subscriptions, connectedSubscription remains undefined',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneEgressInsight !== 'undefined') {
            item.zoneEgressInsight.subscriptions = []
          }
          return item
        })
        expect(actual.zoneEgressInsight).toBeDefined()
        expect(actual.zoneEgressInsight.subscriptions.length).toStrictEqual(0)
        expect(actual.zoneEgressInsight.connectedSubscription).toBeUndefined()
      },
    )

    test(
      'all disconnected subscriptions, connectedSubscription remains undefined',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneEgressInsight !== 'undefined') {
            item.zoneEgressInsight.subscriptions.forEach((item: any) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              item.disconnectTime = '2021-03-19T07:06:16.384057Z'
            })
          }
          return item
        }, {
          env: {
            KUMA_SUBSCRIPTION_COUNT: '10',
          },
        })
        expect(actual.zoneEgressInsight).toBeDefined()
        expect(actual.zoneEgressInsight.subscriptions.length).toStrictEqual(10)
        expect(actual.zoneEgressInsight.connectedSubscription).toBeUndefined()
      },
    )
  })
  describe('state', () => {
    test(
      'all disconnected subscriptions, state=offline',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneEgressInsight !== 'undefined') {
            item.zoneEgressInsight.subscriptions.forEach((item: any) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              item.disconnectTime = '2021-03-19T07:06:16.384057Z'
            })
          }
          return item
        }, {
          env: {
            KUMA_SUBSCRIPTION_COUNT: '10',
          },
        })
        expect(actual.state).toStrictEqual('offline')
      },
    )

    test(
      'all disconnected subscriptions, state=online',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneEgressInsight !== 'undefined') {
            item.zoneEgressInsight.subscriptions.forEach((item: any, i: number, arr: any[]) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              if (i === arr.length - 1) {
                delete item.disconnectTime
              } else {
                item.disconnectTime = '2021-03-19T07:06:16.384057Z'
              }
            })
          }
          return item
        }, {
          env: {
            KUMA_SUBSCRIPTION_COUNT: '10',
          },
        })
        expect(actual.state).toStrictEqual('online')
      },
    )
  })
  describe('addresses', () => {
    test(
      'absent addresses, socketAddress = ""',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneEgress.networking === 'undefined') {
            item.zoneEgress.networking = {}
          }
          delete item.zoneEgress.networking?.address
          item.zoneEgress.networking.port = 80
          return item
        })
        expect(actual.zoneEgress.socketAddress).toStrictEqual('')
      },
    )

    test(
      'absent ports, socketAddress = ""',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneEgress.networking === 'undefined') {
            item.zoneEgress.networking = {}
          }
          item.zoneEgress.networking.address = '127.0.0.1'
          delete item.zoneEgress.networking.port
          return item
        })
        expect(actual.zoneEgress.socketAddress).toStrictEqual('')
      },
    )

    test(
      'numbered ports, socketAddress is correct advertisedSocketAddress is correct',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneEgress.networking === 'undefined') {
            item.zoneEgress.networking = {}
          }
          item.zoneEgress.networking.address = '127.0.0.1'
          // @ts-ignore
          item.zoneEgress.networking.port = 80
          return item
        })
        expect(actual.zoneEgress.socketAddress).toStrictEqual('127.0.0.1:80')
      },
    )

    test(
      'string ports, socketAddress is correct advertisedSocketAddress is correct',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneEgress.networking === 'undefined') {
            item.zoneEgress.networking = {}
          }
          item.zoneEgress.networking.address = '127.0.0.1'
          item.zoneEgress.networking.port = 80
          return item
        })
        expect(actual.zoneEgress.socketAddress).toStrictEqual('127.0.0.1:80')
      },
    )
  })

  describe('zoneIngressOverview.config', () => {
    test('config is derived from name, timestamps, mesh and zoneIngress of item', async ({ fixture }) => {
      const expected = {
        type: 'ZoneEgress',
        name: 'zone-egress-name.zone-egress-namespace',
        mesh: 'mesh-0',
        zone: 'zone-0',
        creationTime: '2021-07-13T08:40:59Z',
        modificationTime: '2021-07-13T08:40:59Z',
        networking: {
          address: '486f:d1db:efde:c143:94a5:cb9f:271a:c1a7',
          port: 58936,
        },
      }
      const actual = await fixture.setup((item) => {
        item.name = expected.name
        item.mesh = expected.mesh
        item.creationTime = expected.creationTime
        item.modificationTime = expected.modificationTime
        item.zoneEgress = {
          networking: expected.networking,
          zone: expected.zone,
        }

        return item
      })
      expect(actual.config).toStrictEqual(expected)
    })
  })
})
