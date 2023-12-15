import { describe, expect, test as _test } from 'vitest'

import { ZoneOverview } from './'
import { plugin, server } from '@/test-support/data'
import mock from '@/test-support/mocks/src/zones/_/_overview'

describe('ZoneOverview', () => {
  const test = _test.extend(plugin<typeof ZoneOverview>(
    ZoneOverview,
    server(mock, {
      params: {
        name: 'zone',
      },
    }),
  ))
  //
  describe('zoneInsight.config', () => {
    test(
      'absent enabled, a connected subscription, config has properties',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          delete item.zone.enabled
          if (typeof item.zoneInsight !== 'undefined' && item.zoneInsight.subscriptions.length === 1) {
            delete item.zoneInsight.subscriptions[0].disconnectTime
          }
          return item
        }, {
          env: {
            KUMA_SUBSCRIPTION_COUNT: '1',
          },
        })
        expect(Object.keys(actual.zoneInsight?.config || {}).length > 0).toStrictEqual(true)
      },
    )
  })
  describe('zone.enabled', () => {
    test(
      'absent means enabled=true',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          delete item.zone.enabled
          return item
        })
        expect(actual.zone.enabled).toStrictEqual(true)
      },
    )

    test(
      'true means enabled=true',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          item.zone.enabled = true
          return item
        })
        expect(actual.zone.enabled).toStrictEqual(true)
      },
    )

    test(
      'false means enabled=false',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          item.zone.enabled = false
          return item
        })
        expect(actual.zone.enabled).toStrictEqual(false)
      },
    )

    test(
      'null means enabled=true',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          // @ts-ignore
          item.zone.enabled = null
          return item
        })
        expect(actual.zone.enabled).toStrictEqual(true)
      },
    )

    test(
      '"" means enabled=true',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          // @ts-ignore
          item.zone.enabled = ''
          return item
        })
        expect(actual.zone.enabled).toStrictEqual(true)
      },
    )

    test(
      '0 means enabled=true',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          // @ts-ignore
          item.zone.enabled = 0
          return item
        })
        expect(actual.zone.enabled).toStrictEqual(true)
      },
    )
  })
  describe('zoneInsight.subscriptions', () => {
    test(
      'absent zoneInsight remains undefined',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          delete item.zoneInsight
          return item
        })
        expect(actual.zoneInsight).toBeUndefined()
      },
    )

    test(
      'no subscriptions, connectedSubscription remains undefined, config={}',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneInsight !== 'undefined') {
            item.zoneInsight.subscriptions = []
          }
          return item
        })
        expect(actual.zoneInsight).toBeDefined()
        expect(actual.zoneInsight?.subscriptions.length).toStrictEqual(0)
        expect(actual.zoneInsight?.connectedSubscription).toBeUndefined()
        expect(actual.zoneInsight?.config).toStrictEqual({})
      },
    )

    test(
      'all disconnected subscriptions, connectedSubscription remains undefined, config={}',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          if (typeof item.zoneInsight !== 'undefined') {
            item.zoneInsight.subscriptions.forEach((item) => {
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
        expect(actual.zoneInsight).toBeDefined()
        expect(actual.zoneInsight?.subscriptions.length).toStrictEqual(10)
        expect(actual.zoneInsight?.connectedSubscription).toBeUndefined()
        expect(actual.zoneInsight?.config).toStrictEqual({})
      },
    )
  })
  describe('state', () => {
    test(
      'enabled=false, all disconnected subscriptions, state=disabled',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          item.zone.enabled = false
          if (typeof item.zoneInsight !== 'undefined') {
            item.zoneInsight.subscriptions.forEach((item) => {
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
        expect(actual.state).toStrictEqual('disabled')
      },
    )

    test(
      'absent enabled, all disconnected subscriptions, state=offline',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          delete item.zone.enabled
          if (typeof item.zoneInsight !== 'undefined') {
            item.zoneInsight.subscriptions.forEach((item) => {
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
      'absent enabled, all disconnected subscriptions, state=offline',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          delete item.zone.enabled
          if (typeof item.zoneInsight !== 'undefined') {
            item.zoneInsight.subscriptions.forEach((item, i, arr) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              if (i === arr.length - 1) {
                delete item.disconnectTime
              } else {
                item.disconnectTime = '2021-03-19T07:06:16.384057Z'
              }
            })
          }
          return item
        })
        expect(actual.state).toStrictEqual('online')
      },
    )
  })
})
