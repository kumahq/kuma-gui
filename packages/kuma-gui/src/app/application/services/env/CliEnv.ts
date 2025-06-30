import { defaultKumaHtmlVars as htmlVars } from '@kumahq/config/vite/plugins/server'

import Env from './Env'

export default class CliEnv extends Env {
  protected getConfig() {
    return htmlVars
  }
}
