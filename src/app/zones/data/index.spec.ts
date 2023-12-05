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
  })
})
