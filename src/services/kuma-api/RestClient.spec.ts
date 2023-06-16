import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import * as MakeRequestModule from './makeRequest'
import { RestClient } from './RestClient'

describe('RestClient', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('has expected initial base URL', () => {
    const restClient = new RestClient(() => 'http://localhost:5681')

    expect(restClient.baseUrl).toBe('http://localhost:5681')
  })

  test.each([
    ['http://localhost:1234/api', 'http://localhost:1234/api'],
    ['http://localhost:1234/test/api', 'http://localhost:1234/test/api'],
  ])('sets expected base URL for “%s”', (newBaseUrl: string, expectedBaseUrl: string) => {
    const restClient = new RestClient(() => 'http://localhost:5681')

    restClient.baseUrl = newBaseUrl

    expect(restClient.baseUrl).toBe(expectedBaseUrl)
  })

  test.each([
    [
      undefined,
      {
        method: 'GET',
      },
    ],
    [
      {
        tag: 'kuma.io/service:backend',
      },
      {
        method: 'GET',
        params: [['tag', 'kuma.io/service:backend']],
      },
    ],
    [
      {
        tag: ['kuma.io/service:backend', 'version:v1'],
      },
      {
        method: 'GET',
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
        method: 'GET',
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
        method: 'GET',
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

    const restClient = new RestClient(() => 'http://localhost:5681')
    restClient.raw('/path', undefined, { params })

    expect(MakeRequestModule.makeRequest).toHaveBeenCalledWith('http://localhost:5681/path', expectedOptions, undefined)
  })

  test.each([
    ['', '/path', '/path'],
    ['', '/path/', '/path/'],
    ['', '/', '/'],
    ['http://example.org', '/path', 'http://example.org/path'],
    ['http://example.org', '/path/', 'http://example.org/path/'],
    ['http://example.org', '/', 'http://example.org/'],
    ['http://example.org', 'http://konghq.tech/path', 'http://konghq.tech/path'],
  ])('sends correct request URL', (baseUrlOrPath: string, requestPath: string, expectedRequestUrl: string) => {
    jest.spyOn(MakeRequestModule, 'makeRequest').mockImplementation(() => Promise.resolve({
      response: new Response(),
      data: null,
    }))

    const restClient = new RestClient(() => baseUrlOrPath)
    restClient.raw(requestPath)

    expect(MakeRequestModule.makeRequest).toHaveBeenCalledWith(expectedRequestUrl, { method: 'GET' }, undefined)
  })
})
