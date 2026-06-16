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

  async raw(...rest: FetchParams) {
    try {
      const response = await fetch(...rest)
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
        const completeUrl = typeof rest[0] === 'string' || rest[0] instanceof URL ? String(rest[0]) : rest[0].url
        error.message = `${error.message} (${completeUrl})`
      }
      throw error
    }
  }
}
