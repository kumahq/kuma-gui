import { describe, expect, jest, test } from '@jest/globals'

import { RestClient } from './RestClient'
import * as MakeRequestModule from './makeRequest'

describe('RestClient', () => {
  test('has expected initial base URL', () => {
    const restClient = new RestClient('http://localhost:5681')

    expect(restClient.baseUrl).toBe('http://localhost:5681')
  })

  test.each([
    ['api', 'http://localhost:5681/api'],
    ['/api', 'http://localhost:5681/api'],
    ['/api/', 'http://localhost:5681/api'],
    ['test/api', 'http://localhost:5681/test/api'],
    ['/test/api', 'http://localhost:5681/test/api'],
    ['/test/api/', 'http://localhost:5681/test/api'],
    ['http://localhost:1234/api', 'http://localhost:1234/api'],
    ['http://localhost:1234/api/', 'http://localhost:1234/api'],
  ])('sets expected base URL for “%s”', (newBaseUrl, expectedBaseUrl) => {
    const restClient = new RestClient('http://localhost:5681')

    restClient.baseUrl = newBaseUrl

    expect(restClient.baseUrl).toBe(expectedBaseUrl)
  })

  test.each([
    [
      undefined,
      {},
    ],
    [
      {
        tag: 'kuma.io/service:backend',
      },
      {
        params: [['tag', 'kuma.io/service:backend']],
      },
    ],
    [
      {
        tag: ['kuma.io/service:backend', 'version:v1'],
      },
      {
        params: [
          ['tag', 'kuma.io/service:backend'],
          ['tag', 'version:v1'],
        ],
      },
    ],
    [
      {
        gateway: true,
        tag: ['kuma.io/service:backend', 'version:v1'],
      },
      {
        params: [
          ['gateway', true],
          ['tag', 'kuma.io/service:backend'],
          ['tag', 'version:v1'],
        ],
      },
    ],
    [
      [
        ['gateway', true],
        ['tag', 'kuma.io/service:backend'],
        ['tag', 'version:v1'],
      ],
      {
        params: [
          ['gateway', true],
          ['tag', 'kuma.io/service:backend'],
          ['tag', 'version:v1'],
        ],
      },
    ],
  ])('processes query parameters correctly', (params, expectedOptions) => {
    jest.spyOn(MakeRequestModule, 'makeRequest').mockImplementation(() => Promise.resolve({
      response: new Response(),
      data: null,
    }))

    const restClient = new RestClient('http://localhost:5681')
    restClient.raw('path', { params })

    expect(MakeRequestModule.makeRequest).toHaveBeenCalledWith('http://localhost:5681/path', expectedOptions)
  })
})
