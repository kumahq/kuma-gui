import { readFileSync as read } from 'node:fs'

import Env from './Env'

const pack = JSON.parse(read('./package.json').toString())
export default class CliEnv extends Env {
  protected getConfig() {
    return {
      ...pack.kuma,
      version: pack.version,
    }
  }
}
