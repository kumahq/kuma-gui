import { RestHandler } from 'msw'

import { makeRequest } from './makeRequest'
import { Mocks } from '@/api/mocks'
import { setupMockWorker } from '@/api/setupMockWorker'
import type Env from '@/services/env/Env'

const DEFAULT_OPTIONS: RequestInit = {
  credentials: 'include',
}

export class RestClient {
  /**
   * The API base URL.
   */
  _baseUrl: string

  _Env: Env

  /**
   * The default options to be used for [the fetch API’s `options` parameter][1].
   *
   * [1]: https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters
   */
  _options: RequestInit = DEFAULT_OPTIONS

  constructor(Env: Env) {
    this._baseUrl = Env.var('KUMA_API_URL')
    this._Env = Env
  }

  /**
   * The API base URL for all network requests.
   *
   * URLs for requests will be constructed in the form `${baseUrl}/${path}`.
   */
  get baseUrl() {
    return this._baseUrl
  }

  set baseUrl(baseUrl: string) {
    this._baseUrl = baseUrl
  }

  /**
   * The default options to be used for [the fetch API’s `options` parameter][1].
   *
   * [1]: https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters
   */
  get options() {
    return this._options
  }

  set options(options: RequestInit) {
    this._options = options
  }

  /**
   * Performs a network request using the GET method.
   *
   * @returns the response’s de-serialized data.
   */
  async get(path: string, options?: RequestInit & { params?: any }): Promise<any> {
    const normalizedOptions = normalizeParameters(options)
    normalizedOptions.method = 'GET'

    const { data } = await this.raw(path, normalizedOptions)

    return data
  }

  /**
   * Performs a network request.
   *
   * @returns the response’s de-serialized data (when applicable) and the raw `Response` object.
   */
  async raw(urlOrPath: string, options?: RequestInit & { params?: any }): Promise<{ response: Response, data: any }> {
    // Normalizes URL and, for URL paths, concatenates the base URL and the URL path.
    let url

    if (urlOrPath.startsWith('http')) {
      url = urlOrPath
    } else {
      url = [this.baseUrl, urlOrPath]
        .map((pathSegment) => pathSegment.replace(/\/+$/, '').replace(/^\/+/, ''))
        .join('/')
        .replace(/\/+$/, '')
    }

    // Merges headers from stored options and override headers.
    const headers = new Headers(this.options.headers)

    if (options !== undefined && 'headers' in options) {
      // Ensures that we deal with a `Headers` object.
      const overrideHeaders = options.headers instanceof Headers ? options.headers : new Headers(options.headers)

      // Sets override headers.
      for (const [key, value] of overrideHeaders) {
        headers.set(key, value)
      }
    }

    // Merges initial default options, stored options, and override options. Including the initial default options here insures that the options include default options like `credentials: 'include'` unless they’re explicitly overridden.
    const mergedOptions = { ...DEFAULT_OPTIONS, ...this.options, ...options }

    if (Object.keys(headers).length > 0) {
      mergedOptions.headers = headers
    }

    const normalizedOptions = normalizeParameters(mergedOptions)

    return makeRequest(url, normalizedOptions)
  }
}

function normalizeParameters(options?: RequestInit & { params?: any }): RequestInit & { params?: any } {
  const normalizedOptions: RequestInit & { params?: any } = options ?? {}

  // Turns parameter records (e.g. `{ tag: ['a', 'b'] }`) into parameter entries (e.g. `[['tag', 'a'], ['tag', 'b']]`) so they can be used to construct an appropriate `URLSearchParams` object. Without this normalization, the record form would produce `'tag=a%2Cb'` (i.e. comma-separated list of values) when we want `'tag=a&tag=b'` (i.e. one query parameter per value).
  if (normalizedOptions.params && !Array.isArray(normalizedOptions.params)) {
    const params = []

    for (const [param, value] of Object.entries(normalizedOptions.params)) {
      // Ignores `undefined` parameters. To represent an empty or absent value, a query parameter should either be the empty string (i.e. resulting in `param=`) or `null` (i.e. resulting in `param=null`) depending on use case.
      if (value === undefined) {
        continue
      }

      if (Array.isArray(value)) {
        for (const singleValue of value) {
          params.push([param, singleValue])
        }
      } else {
        params.push([param, value])
      }
    }

    normalizedOptions.params = params
  }

  return normalizedOptions
}

export function createMockedRestClient(mocks: Mocks, setupHandlers: (baseUrl: string, mocks: Mocks) => RestHandler[]) {
  return class MockedRestClient extends RestClient {
    get baseUrl() {
      return super.baseUrl
    }

    set baseUrl(baseUrl: string) {
      super.baseUrl = baseUrl

      if (this._Env.var('KUMA_MOCK_API_ENABLED') === 'true') {
        setupMockWorker('KumaApi', setupHandlers(baseUrl, mocks))
      }
    }
  }
}
