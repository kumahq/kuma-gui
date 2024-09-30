import { readFileSync as read } from 'node:fs'

import Env from './Env'
const version = JSON.parse(read('./package.json').toString()).version
export default class CliEnv extends Env {
  protected getConfig() {
    return {
      baseGuiPath: '/gui',
      apiUrl: 'http://localhost:5681',
      version,
      product: 'Kuma',
      mode: 'global',
      environment: 'universal',
      storeType: 'postgres',
      apiReadOnly: false,
    }
  }
}
