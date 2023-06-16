import { RestClient } from './RestClient'
import type { EnvVars } from '@/services/env/Env'

type Env = (
  key: keyof Pick<EnvVars,
  'KUMA_API_URL' |
  'KUMA_VERSION_URL'
  >
) => string
export class Api {
  constructor(
    protected client: RestClient,
    protected env: Env,
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
