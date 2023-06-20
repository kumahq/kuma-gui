import { RestClient } from './RestClient'
import type Env from '@/services/env/Env'

export class Api {
  constructor(
    protected client: RestClient,
    protected env: Env['var'],
  ) {}

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
}
