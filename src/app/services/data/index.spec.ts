import { describe, expect, test as _test } from 'vitest'

import { ExternalService, ServiceInsight } from './'
import { plugin, server } from '@/test-support/data'
import externalMock from '@/test-support/mocks/src/meshes/_/external-services'
import insightMock from '@/test-support/mocks/src/meshes/_/service-insights'

describe('ExternalService', () => {
  const test = _test.extend(plugin<typeof ExternalService>(
    ExternalService,
    server(externalMock, {
      params: {
        name: 'zone',
      },
    }),
  ))
  //
  describe('externalService.config', () => {
    test(
      'config is the same as the original API object',
      async ({ fixture }) => {
        let expected
        const actual = await fixture.setup((item) => {
          expected = item
          return item
        })
        expect(actual.config).toStrictEqual(expected)
      },
    )
  })
})
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
