import { makeRequest } from './makeRequest'
import type { Env } from '@/app/application'

export const createFetch = (client: RestClient) => {
  return async (r: Request | string) => {
    const req = typeof r === 'string' ? new Request(r) : r
    const url = new URL(req.url)
    const body = req.body ?? await req.blob?.()
    const payload = ['GET', 'DELETE'].includes(req.method) ? undefined : body ? (await new Response(body).json()) : {}
    const options = {
      ...req,
      params: url.searchParams.size > 0 ? Object.fromEntries(url.searchParams.entries()) : undefined,
    }
    const { response, data } = await client.raw(typeof r === 'string' ? r : url.pathname, payload, options, req.method)

    // we've already accessed the response via .json from within client.raw
    // so we can't call it again later (which the new client does)
    // therefore fake json until we can get rid of our old client
    response.json = () => data
    return response
  }
}
export class RestClient {
  constructor(
    protected env: Env,
  ) { }

  get fetch() {
    return createFetch(this)
  }

  /**
   * The absolute API base URL used in all requests. Includes its base path segment if one is set.
   */
  get baseUrl() {
    return this.env('KUMA_API_URL')
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
  async raw(url: string, payload?: any, rawOptions: RequestInit & { params?: any } = {}, method: string = 'GET'): Promise<{ response: Response, data: any }> {
    const options = normalizeParameters(rawOptions)
    options.method = method

    // Merges headers from stored options and override headers.
    const headers = new Headers()

    if ('headers' in options) {
      // Ensures that we deal with a `Headers` object.
      const overrideHeaders = options.headers instanceof Headers ? options.headers : new Headers(options.headers)

      // Sets override headers.
      for (const [key, value] of overrideHeaders) {
        headers.set(key, value)
      }
    }

    if (Object.keys(headers).length > 0) {
      options.headers = headers
    }

    const normalizedOptions = normalizeParameters(options)

    return makeRequest(
      `${url.startsWith('http') ? '' : this.baseUrl}${url}`,
      normalizedOptions,
      payload,
    )
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
      switch (true) {
        case Array.isArray(value):
          for (const singleValue of value) {
            params.push([param, singleValue])
          }
          break
        case value !== null && typeof value === 'object':
          Object.entries(value).forEach(([key, value]) => params.push([`${param}[${key}]`, value]))
          break
        default:
          params.push([param, value])

      }
    }

    normalizedOptions.params = params
  }

  return normalizedOptions
}
