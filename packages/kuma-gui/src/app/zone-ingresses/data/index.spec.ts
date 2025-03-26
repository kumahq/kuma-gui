import { describe, expect, test as _test } from 'vitest'

import { ZoneIngressOverview } from './'
import { plugin, server } from '@/test-support/data'
import mock from '@/test-support/mocks/src/zone-ingresses/_/_overview'

// zoneIngress tests are very similar to zoneEgress tests
// so anything you amend here you should consider also amending in
// the zoneEgress tests
//
// Extra things here that DO NOT exist on zoneEgress:
// - advertisedSocketAddress
// - availableServices

describe('ZoneIngressOverview', () => {
  const test = _test.extend(plugin<typeof ZoneIngressOverview>(
    ZoneIngressOverview,
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

  describe('zoneInsight.subscriptions', () => {
    test(
      'absent enabled, a connected subscription, config has properties',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          delete item.zoneIngressInsight
          return item
        })
        expect(actual.zoneIngressInsight).toBeDefined()
      },
    )

    test(
      'no subscriptions, connectedSubscription remains undefined',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneIngressInsight !== 'undefined') {
            item.zoneIngressInsight.subscriptions = []
          }
          return item
        })
        expect(actual.zoneIngressInsight).toBeDefined()
        expect(actual.zoneIngressInsight.subscriptions.length).toStrictEqual(0)
        expect(actual.zoneIngressInsight.connectedSubscription).toBeUndefined()
      },
    )

    test(
      'all disconnected subscriptions, connectedSubscription remains undefined',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneIngressInsight !== 'undefined') {
            item.zoneIngressInsight.subscriptions.forEach((item: any) => {
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
        expect(actual.zoneIngressInsight).toBeDefined()
        expect(actual.zoneIngressInsight.subscriptions.length).toStrictEqual(10)
        expect(actual.zoneIngressInsight.connectedSubscription).toBeUndefined()
      },
    )
  })
  describe('state', () => {
    test(
      'all disconnected subscriptions, state=offline',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneIngressInsight !== 'undefined') {
            item.zoneIngressInsight.subscriptions.forEach((item: any) => {
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
          if (typeof item.zoneIngressInsight !== 'undefined') {
            item.zoneIngressInsight.subscriptions.forEach((item: any, i: number, arr: any[]) => {
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
  describe('availableServices', () => {
    test(
      'absent availableServices, availableServices=[]',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          delete item.zoneIngress.availableServices
          return item
        })
        expect(Array.isArray(actual.zoneIngress.availableServices)).toStrictEqual(true)
        expect(actual.zoneIngress.availableServices.length).toStrictEqual(0)
      },
    )

    test(
      'null availableServices, availableServices=[]',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          // @ts-ignore
          item.zoneIngress.availableServices = null
          return item
        })
        expect(Array.isArray(actual.zoneIngress.availableServices)).toStrictEqual(true)
        expect(actual.zoneIngress.availableServices.length).toStrictEqual(0)
      },
    )

    test(
      '[] availableServices, availableServices=[]',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          item.zoneIngress.availableServices = []
          return item
        })
        expect(Array.isArray(actual.zoneIngress.availableServices)).toStrictEqual(true)
        expect(actual.zoneIngress.availableServices.length).toStrictEqual(0)
      },
    )

    test(
      '1 availableService',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          return item
        }, {
          env: {
            KUMA_SERVICE_COUNT: '1',
          },
        })
        expect(Array.isArray(actual.zoneIngress.availableServices)).toStrictEqual(true)
        expect(actual.zoneIngress.availableServices.length).toStrictEqual(1)
      },
    )
  })
  describe('addresses', () => {
    test(
      'absent addresses, socketAddress = "" advertisedSocketAddress = ""',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneIngress.networking === 'undefined') {
            item.zoneIngress.networking = {}
          }
          delete item.zoneIngress.networking?.address
          item.zoneIngress.networking.port = 80
          delete item.zoneIngress.networking?.advertisedAddress
          item.zoneIngress.networking.advertisedPort = 80
          return item
        })
        expect(actual.zoneIngress.socketAddress).toStrictEqual('')
        expect(actual.zoneIngress.advertisedSocketAddress).toStrictEqual('')
      },
    )

    test(
      'absent ports, socketAddress = "" advertisedSocketAddress = ""',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneIngress.networking === 'undefined') {
            item.zoneIngress.networking = {}
          }
          item.zoneIngress.networking.address = '127.0.0.1'
          delete item.zoneIngress.networking.port
          item.zoneIngress.networking.advertisedAddress = '127.0.0.1'
          delete item.zoneIngress.networking.advertisedPort
          return item
        })
        expect(actual.zoneIngress.socketAddress).toStrictEqual('')
        expect(actual.zoneIngress.advertisedSocketAddress).toStrictEqual('')
      },
    )

    test(
      'numbered ports, socketAddress is correct advertisedSocketAddress is correct',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneIngress.networking === 'undefined') {
            item.zoneIngress.networking = {}
          }
          item.zoneIngress.networking.address = '127.0.0.1'
          // @ts-ignore
          item.zoneIngress.networking.port = 80
          item.zoneIngress.networking.advertisedAddress = '127.0.0.2'
          // @ts-ignore
          item.zoneIngress.networking.advertisedPort = 81
          return item
        })
        expect(actual.zoneIngress.socketAddress).toStrictEqual('127.0.0.1:80')
        expect(actual.zoneIngress.advertisedSocketAddress).toStrictEqual('127.0.0.2:81')
      },
    )

    test(
      'string ports, socketAddress is correct advertisedSocketAddress is correct',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneIngress.networking === 'undefined') {
            item.zoneIngress.networking = {}
          }
          item.zoneIngress.networking.address = '127.0.0.1'
          item.zoneIngress.networking.port = 80
          item.zoneIngress.networking.advertisedAddress = '127.0.0.2'
          item.zoneIngress.networking.advertisedPort = 81
          return item
        })
        expect(actual.zoneIngress.socketAddress).toStrictEqual('127.0.0.1:80')
        expect(actual.zoneIngress.advertisedSocketAddress).toStrictEqual('127.0.0.2:81')
      },
    )
  })
  describe('zoneIngressOverview.config', () => {
    test('config is derived from name, timestamps, mesh and zoneIngress of item', async ({ fixture }) => {
      const expected = {
        type: 'ZoneIngress',
        name: 'zone-ingress-name.zone-ingress-namespace',
        mesh: 'mesh-0',
        zone: 'zone-0',
        creationTime: '2021-07-13T08:40:59Z',
        modificationTime: '2021-07-13T08:40:59Z',
        availableServices: [{
          instances: 50,
          mesh: 'mesh-0',
          tags: {
            app: 'programm-app',
            'kuma.io/zone': 'zone-0',
            'kuma.io/service': 'program-app_alarm_svc_36676',
          },
        }],
        networking: {
          address: '486f:d1db:efde:c143:94a5:cb9f:271a:c1a7',
          advertisedAddress: '190.26.201.59',
          advertisedPort: 58329,
          port: 58936,
        },
      }
      const actual = await fixture.setup((item) => {
        item.name = expected.name
        item.mesh = expected.mesh
        item.creationTime = expected.creationTime
        item.modificationTime = expected.modificationTime
        item.zoneIngress = {
          availableServices: expected.availableServices,
          networking: expected.networking,
          zone: expected.zone,
        }

        return item
      })
      expect(actual.config).toStrictEqual(expected)
    })
  })
})
