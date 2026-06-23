import { ApiError } from './ApiError'
import type { Env } from '@/app/application'

type FetchParams = Parameters<typeof fetch>

export const createFetch = (client: RestClient) => {
  return async (...rest: FetchParams) => client.raw(...rest)
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

  async raw(input: FetchParams[0], init?: FetchParams[1]) {
    const isRequest = input instanceof Request
    const path = isRequest ? input.url : String(input)
    const url = `${path.startsWith('http') ? '' : this.baseUrl}${path}`
    try {
      const response = await fetch(isRequest ? new Request(url, input) : url, init)
      if (response.ok) {
        return response
      } else {
        const contentType = response.headers.get('content-type')
        const isJson = contentType !== null ? contentType.startsWith('application/json') || contentType.startsWith('application/problem+json') : false
        const data = isJson ? await response.json() : await response.text()
        const error = typeof data === 'object' ? { ...data, status: data.status ?? response.status } : { title: data, status: response.status }
        throw new ApiError(error)
      }
    } catch (error) {
      if (error instanceof Error) {
        error.message = `${error.message} (${url})`
      }
      throw error
    }
  }
}
