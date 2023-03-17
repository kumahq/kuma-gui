import { makeRequest } from './makeRequest'

const DEFAULT_OPTIONS: RequestInit = {
  credentials: 'include',
}

export class RestClient {
  /**
   * The API base URL.
   */
  _baseUrl: string

  /**
   * The default options to be used for [the fetch API’s `options` parameter][1].
   *
   * [1]: https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters
   */
  _options: RequestInit = DEFAULT_OPTIONS

  /**
   * @param baseUrl an absolute API base URL. **Must not have trailing slashes**.
   */
  constructor(baseUrl: string) {
    this._baseUrl = baseUrl
  }

  /**
   * The absolute API base URL used in all requests. Includes its base path segment if one is set.
   */
  get baseUrl() {
    return this._baseUrl
  }

  /**
   * @param baseUrl the absolute API base URL. **Must not have trailing slashes**.
   */
  set baseUrl(baseUrl: string) {
    this._baseUrl = baseUrl
  }

  get options() {
    return this._options
  }

  set options(options: RequestInit) {
    this._options = options
  }

  async get(path: string, options?: RequestInit & { params?: any }): Promise<any> {
    const { data } = await this.raw(path, undefined, options, 'GET')

    return data
  }

  async delete(path: string, options?: RequestInit & { params?: any }): Promise<void> {
    await this.raw(path, undefined, options, 'DELETE')
  }

  async post(path: string, payload?: any, options?: RequestInit & { params?: any }): Promise<any> {
    const { data } = await this.raw(path, payload, options, 'POST')

    return data
  }

  async put(path: string, payload?: any, options?: RequestInit & { params?: any }): Promise<any> {
    const { data } = await this.raw(path, payload, options, 'PUT')

    return data
  }

  async patch(path: string, payload?: any, options?: RequestInit & { params?: any }): Promise<any> {
    const { data } = await this.raw(path, payload, options, 'PATCH')

    return data
  }

  /**
   * Performs a network request.
   *
   * @returns the response’s de-serialized data (when applicable) and the raw `Response` object.
   */
  async raw(urlOrPath: string, payload?: any, rawOptions: RequestInit & { params?: any } = {}, method: string = 'GET'): Promise<{ response: Response, data: any }> {
    const options = normalizeParameters(rawOptions)
    options.method = method

    // Normalizes URL and, for URL paths, concatenates the base URL and the URL path.
    let url

    if (urlOrPath.startsWith('http')) {
      url = urlOrPath
    } else {
      url = [this.baseUrl, urlOrPath]
        .map((pathSegment) => pathSegment.replace(/\/+$/, '').replace(/^\/+/, ''))
        .join('/')
    }

    url = url === '/' ? url : url.replace(/\/+$/, '')

    // Merges headers from stored options and override headers.
    const headers = new Headers(this.options.headers)

    if ('headers' in options) {
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

    return makeRequest(url, normalizedOptions, payload)
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
