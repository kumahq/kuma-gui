// This file should not be part of the barrel file as it depends on node utilities via import '@kumahq/config/vite' defaultKumaHtmlVars
import { defaultKumaHtmlVars as htmlVars } from '@kumahq/config/vite'

import { Env } from './Env'

export class CliEnv extends Env {
  protected getConfig() {
    return htmlVars
  }
}
