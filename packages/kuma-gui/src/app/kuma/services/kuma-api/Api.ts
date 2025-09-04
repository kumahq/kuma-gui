import { RestClient } from './RestClient'
import type { Env } from '@/app/application'

export class Api {
  constructor(
    public client: RestClient,
    protected env: Env,
  ) { }

  get baseUrl() {
    return this.client.baseUrl
  }
}
