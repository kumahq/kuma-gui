import { describe, expect, test } from '@jest/globals'

import { getZoneDpServerAuthType } from './helpers'
import { DISABLED } from '@/constants'
import { ZoneOverview } from '@/types/index.d'

describe('helpers', () => {
  describe('getZoneDpServerAuthType', () => {
    test(`returns ${DISABLED} when no subscriptions`, () => {
      expect(getZoneDpServerAuthType(({ zoneInsight: { subscriptions: [] } } as unknown) as ZoneOverview)).toBe(
        DISABLED,
      )
    })

    test(`returns ${DISABLED} when subscription does not have auth in config`, () => {
      expect(
        getZoneDpServerAuthType(({
          zoneInsight: {
            subscriptions: [
              {
                config: '{"dpServer":{}}',
              },
            ],
          },
        } as unknown) as ZoneOverview),
      ).toBe(DISABLED)
    })

    test('returns dp auth type when subscriptions available', () => {
      const type = 'authType'

      expect(
        getZoneDpServerAuthType(({
          zoneInsight: {
            subscriptions: [
              {
                config: `{"dpServer":{"auth":{"type":"${type}"}}}`,
              },
            ],
          },
        } as unknown) as ZoneOverview),
      ).toBe(type)
    })

    test(`returns ${DISABLED} type when subscriptions available but no config`, () => {
      const type = DISABLED

      expect(
        getZoneDpServerAuthType(({
          zoneInsight: {
            subscriptions: [{}],
          },
        } as unknown) as ZoneOverview),
      ).toBe(type)
    })
  })
})
