
import { fs } from '@kumahq/kuma-http-api/mocks'
import { describe, expect, test as _test } from 'vitest'

import { ServiceInsight } from './'
import { plugin, server } from '@/test-support/data'

const insightMock = fs['/meshes/:mesh/service-insights']


describe('ServiceInsight', () => {
  const test = _test.extend(plugin<typeof ServiceInsight>(
    ServiceInsight,
    server(insightMock, {
      params: {
        name: 'zone',
      },
    }),
  ))
  //
  describe('service.serviceType', () => {
    test(
      'serviceType has a default',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          delete item.serviceType
          return item
        })
        expect(actual.serviceType).toStrictEqual('internal')
      },
    )
  })
  describe('service.status', () => {
    test(
      'status has a default',
      async ({ fixture }) => {
        const actual = await fixture.setup((item) => {
          delete item.status
          return item
        })
        expect(actual.status).toStrictEqual('not_available')
      },
    )
  })
})