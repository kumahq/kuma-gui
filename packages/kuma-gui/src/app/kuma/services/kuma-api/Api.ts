import { RestClient } from './RestClient'
import type { Env } from '@kumahq/settings/env'

export class Api {
  constructor(
    public client: RestClient,
    protected env: Env['var'],
  ) { }

  get baseUrl() {
    return this.client.baseUrl
  }
}
