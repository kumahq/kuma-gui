import { RestClient } from './RestClient'
import type Env from '@/services/env/Env'

export class Api {
  client: RestClient
  env: Env

  constructor(env: Env) {
    this.client = new RestClient(env.var('KUMA_API_URL'))
    this.env = env
  }

  get baseUrl() {
    return this.client.baseUrl
  }

  /**
   * Sets the API base URL for all network requests.
   *
   * URLs for requests will be constructed in the form `${baseUrl}/${path}`.
   */
  setBaseUrl(baseUrl: string): void {
    this.client.baseUrl = baseUrl
  }

  /**
   * Sets the default options to be used for [the fetch API’s `options` parameter][1].
   *
   * [1]: https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters
   */
  setOptions(options: RequestInit): void {
    this.client.options = options
  }
}
