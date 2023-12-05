import { describe, expect, test } from 'vitest'

import { ZoneIngressOverview } from './'
import { useResponder } from '@/test-support'
import mock from '@/test-support/mocks/src/zone-ingresses/_/_overview'
import { ZoneIngressOverview as PartialZoneIngressOverview } from '@/types/index'

type Writeable<T> = { -readonly [P in keyof T]: Writeable<T[P]> };

type Assert = (actual: ZoneIngressOverview, item: PartialZoneIngressOverview) => void
type Context = {
  message: string
  assert: Assert
  get: () => Promise<PartialZoneIngressOverview>
}
type Test = {
  env?: Record<string, string>
  message: string
  assert: Assert
  setup: (item: PartialZoneIngressOverview) => Promise<PartialZoneIngressOverview>
}

const freeze = (obj: any) => {
  Object.keys(obj).forEach(prop => {
    if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
      freeze(obj[prop])
    }
  })
  return Object.freeze(obj)
}

const get = async (env: Record<string, string>) => {
  const responder = useResponder({
    _: mock,
  }, (key: string, d = '') => env[key] ?? d)
  const request = responder('_')
  return (await request(
    {
      method: 'GET',
      body: {},
      url: {
        searchParams: new URLSearchParams(),
      },
      params: {
        name: 'zone',
      },
    },
  )).body
}

const map = (test: Test) => {
  return {
    message: test.message,
    assert: test.assert,
    get: async () => {
      const item = (await get(test.env ?? {})) as unknown as Writeable<PartialZoneIngressOverview>
      return freeze(await test.setup(item)) as Readonly<PartialZoneIngressOverview>
    },
  }
}
const run = async ({ get, assert }: Context) => {
  const item = await get()
  assert(ZoneIngressOverview.fromObject(item), item)
}
//
describe('ZoneIngressOverview', () => {
  describe('zoneInsight.subscriptions', () => {
    test.each(([
      {
        message: 'absent zoneInsight remains undefined',
        setup: async (item) => {
          delete item.zoneIngressInsight
          return item
        },
        assert: (actual) => {
          expect(actual.zoneIngressInsight).toBeUndefined()
        },
      },
      {
        message: 'no subscriptions, connectedSubscription remains undefined',
        setup: async (item) => {
          if (typeof item.zoneIngressInsight !== 'undefined') {
            item.zoneIngressInsight.subscriptions = []
          }
          return item
        },
        assert: (actual) => {
          expect(actual.zoneIngressInsight).toBeDefined()
          expect(actual.zoneIngressInsight?.subscriptions.length).toStrictEqual(0)
          expect(actual.zoneIngressInsight?.connectedSubscription).toBeUndefined()
        },
      },
      {
        message: 'all disconnected subscriptions, connectedSubscription remains undefined',
        env: {
          KUMA_SUBSCRIPTION_COUNT: '10',
        },
        setup: async (item) => {
          if (typeof item.zoneIngressInsight !== 'undefined') {
            item.zoneIngressInsight.subscriptions.forEach((item: any) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              item.disconnectTime = '2021-03-19T07:06:16.384057Z'
            })
          }
          return item
        },
        assert: (actual) => {
          expect(actual.zoneIngressInsight).toBeDefined()
          expect(actual.zoneIngressInsight?.subscriptions.length).toStrictEqual(10)
          expect(actual.zoneIngressInsight?.connectedSubscription).toBeUndefined()
        },
      },
    ] as Test[]).map(map))('$message', run)
  })

  describe('state', () => {
    test.each(([
      {
        message: 'all disconnected subscriptions, state=offline',
        env: {
          KUMA_SUBSCRIPTION_COUNT: '10',
        },
        setup: async (item) => {
          if (typeof item.zoneIngressInsight !== 'undefined') {
            item.zoneIngressInsight.subscriptions.forEach((item: any) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              item.disconnectTime = '2021-03-19T07:06:16.384057Z'
            })
          }
          return item
        },
        assert: (actual) => {
          expect(actual.state).toStrictEqual('offline')
        },
      },
      {
        message: 'a connected subscription, state=online',
        env: {
          KUMA_SUBSCRIPTION_COUNT: '10',
        },
        setup: async (item) => {
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
        },
        assert: (actual) => {
          expect(actual.state).toStrictEqual('online')
        },
      },
    ] as Test[]).map(map))('$message', run)
  })

  describe('availableServices', () => {
    test.each(([
      {
        message: 'absent availableServices, availableServices=[]',
        setup: async (item) => {
          delete item.zoneIngress.availableServices
          return item
        },
        assert: (actual) => {
          expect(Array.isArray(actual.zoneIngress.availableServices)).toStrictEqual(true)
          expect(actual.zoneIngress.availableServices.length).toStrictEqual(0)
        },
      },
      {
        message: 'null availableServices, availableServices=[]',
        setup: async (item) => {
          // @ts-ignore
          item.zoneIngress.availableServices = null
          return item
        },
        assert: (actual) => {
          expect(Array.isArray(actual.zoneIngress.availableServices)).toStrictEqual(true)
          expect(actual.zoneIngress.availableServices.length).toStrictEqual(0)
        },
      },
      {
        message: '[] availableServices, availableServices=[]',
        setup: async (item) => {
          item.zoneIngress.availableServices = []
          return item
        },
        assert: (actual) => {
          expect(Array.isArray(actual.zoneIngress.availableServices)).toStrictEqual(true)
          expect(actual.zoneIngress.availableServices.length).toStrictEqual(0)
        },
      },
      {
        env: {
          KUMA_SERVICE_COUNT: '1',
        },
        message: '1 availableService',
        setup: async (item) => {
          return item
        },
        assert: (actual) => {
          expect(Array.isArray(actual.zoneIngress.availableServices)).toStrictEqual(true)
          expect(actual.zoneIngress.availableServices.length).toStrictEqual(1)
        },
      },
    ] as Test[]).map(map))('$message', run)
  })

  describe('addresses', () => {
    test.each(([
      {
        message: 'absent addresses, socketAddress = "" advertisedSocketAddress = ""',
        setup: async (item) => {
          if (typeof item.zoneIngress.networking === 'undefined') {
            item.zoneIngress.networking = {}
          }
          delete item.zoneIngress.networking?.address
          item.zoneIngress.networking.port = '80'
          delete item.zoneIngress.networking?.advertisedAddress
          item.zoneIngress.networking.advertisedPort = '80'
          return item
        },
        assert: (actual) => {
          expect(actual.zoneIngress.socketAddress).toStrictEqual('')
          expect(actual.zoneIngress.advertisedSocketAddress).toStrictEqual('')
        },
      },
      {
        message: 'absent ports, socketAddress = "" advertisedSocketAddress = ""',
        setup: async (item) => {
          if (typeof item.zoneIngress.networking === 'undefined') {
            item.zoneIngress.networking = {}
          }
          item.zoneIngress.networking.address = '127.0.0.1'
          delete item.zoneIngress.networking.port
          item.zoneIngress.networking.advertisedAddress = '127.0.0.1'
          delete item.zoneIngress.networking.advertisedPort
          return item
        },
        assert: (actual) => {
          expect(actual.zoneIngress.socketAddress).toStrictEqual('')
          expect(actual.zoneIngress.advertisedSocketAddress).toStrictEqual('')
        },
      },
      {
        message: 'numbered ports, socketAddress is correct advertisedSocketAddress is correct',
        setup: async (item) => {
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
        },
        assert: (actual) => {
          expect(actual.zoneIngress.socketAddress).toStrictEqual('127.0.0.1:80')
          expect(actual.zoneIngress.advertisedSocketAddress).toStrictEqual('127.0.0.2:81')
        },
      },
      {
        message: 'string ports, socketAddress is correct advertisedSocketAddress is correct',
        setup: async (item) => {
          if (typeof item.zoneIngress.networking === 'undefined') {
            item.zoneIngress.networking = {}
          }
          item.zoneIngress.networking.address = '127.0.0.1'
          item.zoneIngress.networking.port = '80'
          item.zoneIngress.networking.advertisedAddress = '127.0.0.2'
          item.zoneIngress.networking.advertisedPort = '81'
          return item
        },
        assert: (actual) => {
          expect(actual.zoneIngress.socketAddress).toStrictEqual('127.0.0.1:80')
          expect(actual.zoneIngress.advertisedSocketAddress).toStrictEqual('127.0.0.2:81')
        },
      },
    ] as Test[]).map(map))('$message', run)
  })
})
