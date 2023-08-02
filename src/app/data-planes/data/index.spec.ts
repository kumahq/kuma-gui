import { describe, test, expect } from '@jest/globals'

import { DataplaneOverview } from './index'

type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

describe('DataplaneOverview.fromJSON', () => {
  test('the things we need have safe default values', () => {
    // Note: We only currently use/depend on the following
    // Other properties such as dataplane.gateway etc should
    // should also be given safe defaults at some point

    const item = DataplaneOverview.fromJSON({})

    // DataplaneOverview
    expect(item.lastUpdated.toString()).toEqual(new Date(0).toString())
    expect(item.status).toEqual('online')
    expect(item.version).toEqual('')
    expect(item.compatible).toEqual(true)

    // DataplaneOverview.dataplane
    expect(item.dataplane.networking.inbound.length).toEqual(0)
    expect(item.dataplane.tags.length).toEqual(0)
    expect(item.dataplane.service).toEqual('')
    expect(item.dataplane.protocol).toEqual('')
    expect(item.dataplane.zone).toEqual('')

    // DataplaneOverview.dataplaneInsight
    expect(item.dataplaneInsight.subscriptions.length).toEqual(0)

    type Actual = Expect<Equal<typeof item, DataplaneOverview>>
    // @TODO Find a better way to do this with Jest (or vitest)
    expect(true).toBe(true as Actual)
  })

  test('common entity properties are set', () => {
    const item = DataplaneOverview.fromJSON({
      name: 'dataplane',
      type: 'DataplaneOverview',
      creationTime: '2021-02-17T08:33:36.442044+01:00',
      modificationTime: '2021-03-17T08:33:36.442044+01:00',
    })
    expect(item.name).toEqual('dataplane')
    expect(item.type).toEqual('DataplaneOverview')
    expect(item.creationTime).toEqual('2021-02-17T08:33:36.442044+01:00')
    expect(item.modificationTime).toEqual('2021-03-17T08:33:36.442044+01:00')
  })

  test('tagging a sidecar proxy with a service works', () => {
    const item = DataplaneOverview.fromJSON({
      dataplane: {
        networking: {
          inbound: [{
            tags: {
              'kuma.io/service': 'service-name',
            },
          }],
        },
      },
    })
    expect(item.dataplane.tags).toEqual([
      {
        label: 'kuma.io/service',
        value: 'service-name',
      },
    ])
    expect(item.dataplane.service).toEqual('service-name')
  })

  test('tagging a gateway proxy with a service works', () => {
    const item = DataplaneOverview.fromJSON({
      dataplane: {
        networking: {
          gateway: {
            tags: {
              'kuma.io/service': 'service-name',
            },
          },
        },
      },
    })
    expect(item.dataplane.tags).toEqual([
      {
        label: 'kuma.io/service',
        value: 'service-name',
      },
    ])
    expect(item.dataplane.service).toEqual('service-name')
  })

  test('tagging a sidecar proxy with a protocol works', () => {
    const item = DataplaneOverview.fromJSON({
      dataplane: {
        networking: {
          inbound: [{
            tags: {
              'kuma.io/protocol': 'http',
            },
          }],
        },
      },
    })
    expect(item.dataplane.tags).toEqual([
      {
        label: 'kuma.io/protocol',
        value: 'http',
      },
    ])
    expect(item.dataplane.protocol).toEqual('http')
  })

  test('tagging a gateway proxy with a protocol works', () => {
    const item = DataplaneOverview.fromJSON({
      dataplane: {
        networking: {
          gateway: {
            tags: {
              'kuma.io/protocol': 'http',
            },
          },
        },
      },
    })
    expect(item.dataplane.tags).toEqual([
      {
        label: 'kuma.io/protocol',
        value: 'http',
      },
    ])
    expect(item.dataplane.protocol).toEqual('http')
  })

  test('tagging dedupes any repeated tags across inbounds', () => {
    const item = DataplaneOverview.fromJSON({
      dataplane: {
        networking: {
          inbound: [{
            tags: {
              'kuma.io/protocol': 'http',
            },
          },
          {
            tags: {
              'kuma.io/protocol': 'http',
            },
          }],
        },
      },
    })
    expect(item.dataplane.tags).toEqual([
      {
        label: 'kuma.io/protocol',
        value: 'http',
      },
    ])
    expect(item.dataplane.protocol).toEqual('http')
  })

  test('finding out the status from health and connectTime', () => {
    const unhealthy = DataplaneOverview.fromJSON({
      dataplane: {
        networking: {
          inbound: [{
            health: {
              ready: false,
            },
          }],
        },
      },
    })
    expect(unhealthy.status).toEqual('offline')

    const degraded = DataplaneOverview.fromJSON({
      dataplane: {
        networking: {
          inbound: [{
            health: {
              ready: false,
            },
          },
          {},
          ],
        },
      },
    })
    expect(degraded.status).toEqual('partially_degraded')

    // undefinedHealth, but with no subscriptions to find out connectTime
    const undefinedHealth = DataplaneOverview.fromJSON({
      dataplane: {
        networking: {
          inbound: [
            {},
            {},
          ],
        },
      },

    })
    expect(undefinedHealth.status).toEqual('offline')

    const discoveryOnline = DataplaneOverview.fromJSON({
      dataplane: {
        networking: {
          inbound: [
            {},
            {},
          ],
        },
      },
      dataplaneInsight: {
        subscriptions: [{
          connectTime: new Date(0),
        }],
      },

    })
    expect(discoveryOnline.status).toEqual('online')

    const discoveryOffline = DataplaneOverview.fromJSON({
      dataplane: {
        networking: {
          inbound: [
            {},
            {},
          ],
        },
      },
      dataplaneInsight: {
        subscriptions: [{
          connectTime: new Date(0),
          disconnectTime: new Date(0),
        }],
      },

    })
    expect(discoveryOffline.status).toEqual('offline')
  })

  test('finding out the compatibility', () => {
    const compatible = DataplaneOverview.fromJSON({
      dataplaneInsight: {
        subscriptions: [
          {
            version: {
              kumaDp: {
                kumaCpCompatible: true,
              },
              envoy: {
                kumaDpCompatible: true,
              },
            },
          },
        ],
      },
    })
    expect(compatible.compatible).toEqual(true)

    const kumaIncompatible = DataplaneOverview.fromJSON({
      dataplaneInsight: {
        subscriptions: [
          {
            version: {
              kumaDp: {
                kumaCpCompatible: false,
              },
              envoy: {
                kumaDpCompatible: true,
              },
            },
          },
        ],
      },
    })
    expect(kumaIncompatible.compatible).toEqual(false)

    const envoyIncompatible = DataplaneOverview.fromJSON({
      dataplaneInsight: {
        subscriptions: [
          {
            version: {
              kumaDp: {
                kumaCpCompatible: true,
              },
              envoy: {
                kumaDpCompatible: false,
              },
            },
          },
        ],
      },
    })
    expect(envoyIncompatible.compatible).toEqual(false)

    // @TODO Confirm that undefined compatibilities (if that ever happens?)
    // should make the proxy incompatible
    const undefinedIncompatible = DataplaneOverview.fromJSON({
      dataplaneInsight: {
        subscriptions: [
          {
            version: {
              kumaDp: {
                // kumaCpCompatible: undefined,
              },
              envoy: {
                // kumaDpCompatible: undefined,
              },
            },
          },
        ],
      },
    })
    expect(undefinedIncompatible.compatible).toEqual(false)
  })
})
