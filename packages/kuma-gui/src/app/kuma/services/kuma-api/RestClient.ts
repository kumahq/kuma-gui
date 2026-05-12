import type { Env } from '@/app/application'

type FetchParams = Parameters<typeof fetch>

export const createFetch = (client: RestClient) => {
  return async (...rest: FetchParams) =>  client.raw(...rest)
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
    return fetch(...rest)
  }
}
