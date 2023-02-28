import { makeRequest } from './makeRequest'

export class RestClient {
  /**
   * The API base URL. **Will always be stored without a trailing slash**.
   */
  _baseUrl: string
  _defaultBaseUrl: string
  _options: RequestInit = {}

  constructor(defaultBaseUrl: string) {
    this._baseUrl = defaultBaseUrl
    this._defaultBaseUrl = defaultBaseUrl
  }

  /**
   * The absolute API base URL used in all requests. Includes its base path segment if one is set.
   */
  get baseUrl() {
    return this._baseUrl
  }

  /**
   * @param baseUrlOrPath the API base URL or the API base path
   */
  set baseUrl(baseUrlOrPath: string) {
    if (baseUrlOrPath.startsWith('http')) {
      this._baseUrl = trimTrailingSlashes(baseUrlOrPath)
    } else {
      const basePath = trimSlashes(baseUrlOrPath)
      this._baseUrl = [this._defaultBaseUrl, basePath].filter((segment) => segment !== '').join('/')
    }
  }

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
    const url = urlOrPath.startsWith('http') ? urlOrPath : [this.baseUrl, urlOrPath].join('/')

    const headers = new Headers(this.options.headers)

    if (options !== undefined && 'headers' in options) {
      // Ensures that we deal with a `Headers` object.
      const overrideHeaders = options.headers instanceof Headers ? options.headers : new Headers(options.headers)

      // Sets override headers.
      for (const [key, value] of overrideHeaders) {
        headers.set(key, value)
      }
    }

    // Merges default options and override options.
    const mergedOptions = { ...this.options, ...options }

    if (Object.keys(headers).length > 0) {
      mergedOptions.headers = headers
    }

    const normalizedOptions = normalizeParameters(mergedOptions)

    return makeRequest(url, normalizedOptions)
  }
}

function trimTrailingSlashes(str: string): string {
  return str.replace(/\/+$/, '')
}

function trimLeadingSlashes(str: string): string {
  return str.replace(/^\/+/, '')
}

function trimSlashes(str: string): string {
  return trimTrailingSlashes(trimLeadingSlashes(str))
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
