import { DISABLED } from '@/consts'
import { getZoneDpServerAuthType, fetchAllResources } from '@/helpers'
import { ZoneOverview, AllResourceResponse } from '@/types'

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

  describe('fetchAllResources', () => {
    it('throws an error when broken call', () => {
      const brokenRequest = jest.fn().mockImplementation(() => {
        throw new Error()
      })

      expect(() => fetchAllResources({ callEndpoint: brokenRequest })).rejects.toThrow(Error)
    })

    it('returns aggregared data', async () => {
      const request = jest
        .fn()
        .mockResolvedValueOnce({
          next: true,
          items: new Array(500).fill(''),
          total: 501,
        })
        .mockResolvedValueOnce({
          next: false,
          items: [''],
          total: 501,
        })

      const response = (await fetchAllResources({ callEndpoint: request })) as AllResourceResponse

      expect(response.data.length).toBe(501)
      expect(response.data[0]).toBe('')
      expect(response.total).toBe(501)
      expect(request).toHaveBeenCalledTimes(2)
      expect(request).toHaveBeenNthCalledWith(1, { offset: 0, size: 500 })
      expect(request).toHaveBeenNthCalledWith(2, { offset: 500, size: 500 })
    })
  })
})
