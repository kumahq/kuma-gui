import { fs } from '@kumahq/kuma-http-api/mocks'
import { describe, expect, test , test as _test } from 'vitest'

import { ExternalService } from './ExternalService'
import { plugin, server } from '@/test-support/data'

const externalMock = fs['/meshes/:mesh/external-services']

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
