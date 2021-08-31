import { DISABLED } from '@/consts'
import { getZoneDpServerAuthType } from '@/helpers'
import { ZoneOverview } from '@/types'

describe('helpers', () => {
  describe('getZoneDpServerAuthType', () => {
    it(`returns ${DISABLED} when no subscriptions`, () => {
      expect(getZoneDpServerAuthType(({ zoneInsight: { subscriptions: [] } } as unknown) as ZoneOverview)).toBe(
        DISABLED,
      )
    })

    it(`returns ${DISABLED} when subscription does not have auth in config`, () => {
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

    it('returns dp auth type when subscriptions available', () => {
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
  })
})
