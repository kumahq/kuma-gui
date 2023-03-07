import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import { Api } from './Api'
import * as MakeRequestModule from './makeRequest'
import Env from '@/services/env/Env'

function getEnv(kumaApiUrl: string) {
  return new Env({
    KUMA_PRODUCT_NAME: '',
    KUMA_FEEDBACK_URL: '',
    KUMA_CHAT_URL: '',
    KUMA_INSTALL_URL: '',
    KUMA_VERSION_URL: '',
    KUMA_DOCS_URL: '',
    KUMA_MOCK_API_ENABLED: '',
    KUMA_API_URL: kumaApiUrl,
  })
}

describe('Api', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('has expected initial base URL', () => {
    const api = new Api(getEnv('http://localhost:5681'))

    expect(api.baseUrl).toBe('http://localhost:5681')
  })

  test('sets correct base URL', () => {
    const api = new Api(getEnv('http://localhost:5681'))

    api.baseUrl = 'http://localhost:1234/api'

    expect(api.baseUrl).toBe('http://localhost:1234/api')
  })

  test.each([
    [
      undefined,
      {
        credentials: 'include',
      },
    ],
    [
      {
        tag: 'kuma.io/service:backend',
      },
      {
        credentials: 'include',
        params: [['tag', 'kuma.io/service:backend']],
      },
    ],
    [
      {
        tag: ['kuma.io/service:backend', 'version:v1'],
      },
      {
        credentials: 'include',
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
        credentials: 'include',
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
        credentials: 'include',
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

    const api = new Api(getEnv('http://localhost:5681'))

    api.raw('path', { params })

    expect(MakeRequestModule.makeRequest).toHaveBeenCalledWith('http://localhost:5681/path', expectedOptions)
  })

  test.each([
    [
      {
        credentials: 'include',
      } as RequestInit,
      {
        method: 'GET',
        credentials: 'include',
      },
    ],
    [
      {
        method: 'POST',
        credentials: 'same-origin',
      } as RequestInit,
      {
        method: 'GET', // Can’t override GET method
        credentials: 'same-origin',
      },
    ],
    [
      {
        headers: {
          'Content-Type': 'text/html',
        },
      } as RequestInit,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'text/html',
        },
      },
    ],
  ])('sets fetch default options correctly', (options: RequestInit, expectedOptions) => {
    jest.spyOn(MakeRequestModule, 'makeRequest').mockImplementation(() => Promise.resolve({
      response: new Response(),
      data: null,
    }))

    const api = new Api(getEnv('http://localhost:5681'))

    api.options = options
    api.get('path')

    expect(MakeRequestModule.makeRequest).toHaveBeenCalledWith('http://localhost:5681/path', expectedOptions)
  })

  test.each([
    ['/', 'path', '/path'],
    ['/', '/path', '/path'],
    ['/', 'path/', '/path'],
    ['/', '/path/', '/path'],
    ['http://example.org', 'path', 'http://example.org/path'],
    ['http://example.org', '/path', 'http://example.org/path'],
    ['http://example.org/', 'path', 'http://example.org/path'],
    ['http://example.org/', '/path', 'http://example.org/path'],
    ['http://example.org/', 'path/', 'http://example.org/path'],
    ['http://example.org/', '/path/', 'http://example.org/path'],
    ['http://example.org/', '', 'http://example.org'],
    ['http://example.org/', '/', 'http://example.org'],
  ])('sends correct request URL', (baseUrlOrPath, requestPath, expectedRequestUrl) => {
    jest.spyOn(MakeRequestModule, 'makeRequest').mockImplementation(() => Promise.resolve({
      response: new Response(),
      data: null,
    }))

    const api = new Api(getEnv(baseUrlOrPath))

    api.raw(requestPath)

    expect(MakeRequestModule.makeRequest).toHaveBeenCalledWith(expectedRequestUrl, { credentials: 'include' })
  })
})
