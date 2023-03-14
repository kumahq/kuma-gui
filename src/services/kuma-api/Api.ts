import { RestClient } from './RestClient'
import type Env from '@/services/env/Env'

/**
 * Minimal base API class for all API instances to inherit from.
 *
 * Its sole purpose is to provide access to `client` and `Env` and to not make each API instance create a constructor for just setting them.
 */
export class Api {
  client: RestClient
  Env: Env

  constructor(client: RestClient, Env: Env) {
    this.client = client
    this.Env = Env
  }
}
