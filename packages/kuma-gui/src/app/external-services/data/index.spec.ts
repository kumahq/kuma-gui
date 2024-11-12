import { describe, expect, test } from 'vitest'

import { ExternalService } from './index'

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
          config: {
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
      },
    ])('.fromObject: $message', ({ parameters, expected }) => {
      expect(ExternalService.fromObject(...parameters)).toStrictEqual(expected)
    })
  })
})
