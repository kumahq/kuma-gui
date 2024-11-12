import Env from './Env'
import { htmlVars } from '../../../../../vite.plugins'

export default class CliEnv extends Env {
  protected getConfig() {
    return htmlVars
  }
}
