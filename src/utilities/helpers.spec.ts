import { describe, expect, jest, test } from '@jest/globals'

import { DISABLED } from '@/constants'
import { getZoneDpServerAuthType, fetchAllResources, camelCaseToWords } from './helpers'
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

  describe('fetchAllResources', () => {
    test('throws an error when broken call', () => {
      const brokenRequest = jest.fn(() => {
        throw new Error()
      })

      expect(() => fetchAllResources(brokenRequest)).rejects.toThrow(Error)
    })

    test('returns aggregared data', async () => {
      const request = jest
        .fn()
        .mockReturnValueOnce(Promise.resolve({
          next: true,
          items: new Array(500).fill(''),
          total: 501,
        }))
        .mockReturnValueOnce(Promise.resolve({
          next: false,
          items: [''],
          total: 501,
        }))

      // @ts-expect-error
      const response = await fetchAllResources(request)

      expect(response.items.length).toBe(501)
      expect(response.items[0]).toBe('')
      expect(response.total).toBe(501)
      expect(request).toHaveBeenCalledTimes(2)
      expect(request).toHaveBeenNthCalledWith(1, { offset: 0, size: 500 })
      expect(request).toHaveBeenNthCalledWith(2, { offset: 500, size: 500 })
    })
  })

  describe('camelCaseToWords', () => {
    test.each([
      ['test', 'test'],
      ['MeshOPAPolicy', 'Mesh OPA Policy'],
      ['MeshOPA', 'Mesh OPA'],
      ['MeshCircuitBreaker', 'Mesh Circuit Breaker'],
      ['Mesh Circuit Breaker', 'Mesh Circuit Breaker'],
      ['meshCircuitBreaker', 'mesh Circuit Breaker'],
    ])('works for “%s”', (str, expectedString) => {
      expect(camelCaseToWords(str)).toBe(expectedString)
    })
  })
})
