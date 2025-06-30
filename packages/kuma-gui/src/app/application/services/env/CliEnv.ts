import { defaultKumaHtmlVars as htmlVars } from '@kumahq/config/vite'

import Env from './Env'

export default class CliEnv extends Env {
  protected getConfig() {
    return htmlVars
  }
}
