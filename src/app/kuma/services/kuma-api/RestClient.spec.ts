import { beforeEach, describe, expect, test, vi } from 'vitest'

import * as MakeRequestModule from './makeRequest'
import { RestClient } from './RestClient'

describe('RestClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
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
    vi.spyOn(MakeRequestModule, 'makeRequest').mockImplementation(() => Promise.resolve({
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
    vi.spyOn(MakeRequestModule, 'makeRequest').mockImplementation(() => Promise.resolve({
      response: new Response(),
      data: null,
    }))

    const restClient = new RestClient(() => baseUrlOrPath)
    restClient.raw(requestPath)

    expect(MakeRequestModule.makeRequest).toHaveBeenCalledWith(expectedRequestUrl, { method: 'GET' }, undefined)
  })
})
