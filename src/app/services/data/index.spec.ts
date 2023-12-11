import { describe, expect, test } from 'vitest'

import { ExternalService, ServiceInsight } from './index'

type TestCase<T extends (...args: any) => any> = {
  message: string
  parameters: Parameters<T>
  expected: ReturnType<T>
}

describe('services data transformations', () => {
  describe('ExternalService', () => {
    test.each<TestCase<typeof ExternalService.fromObject>>([
      {
        message: 'minimal',
        parameters: [{
          type: 'ExternalService',
          mesh: 'default',
          name: 'service',
          creationTime: '2021-02-02T10:59:26.640498+01:00',
          modificationTime: '2021-02-02T10:59:26.640498+01:00',
          networking: {
            address: 'service.mesh:26986',
          },
          tags: {
            'kuma.io/service': 'service',
          },
        }],
        expected: {
          type: 'ExternalService',
          mesh: 'default',
          name: 'service',
          creationTime: '2021-02-02T10:59:26.640498+01:00',
          modificationTime: '2021-02-02T10:59:26.640498+01:00',
          networking: {
            address: 'service.mesh:26986',
          },
          tags: {
            'kuma.io/service': 'service',
          },
        },
      },
    ])('.fromObject: $message', ({ parameters, expected }) => {
      expect(ExternalService.fromObject(...parameters)).toStrictEqual(expected)
    })
  })

  describe('ServiceInsight', () => {
    test.each<TestCase<typeof ServiceInsight.fromObject>>([
      {
        message: 'minimal',
        parameters: [{
          type: 'ServiceInsight',
          mesh: 'default',
          name: 'service',
          creationTime: '2021-02-19T08:06:15.14624+01:00',
          modificationTime: '2021-02-19T08:07:37.539229+01:00',
        }],
        expected: {
          type: 'ServiceInsight',
          serviceType: 'internal',
          mesh: 'default',
          name: 'service',
          creationTime: '2021-02-19T08:06:15.14624+01:00',
          modificationTime: '2021-02-19T08:07:37.539229+01:00',
          status: 'not_available',
        },
      },
    ])('.fromObject: $message', ({ parameters, expected }) => {
      expect(ServiceInsight.fromObject(...parameters)).toStrictEqual(expected)
    })
  })
})
