import Env, { getPathConfigDefault } from './Env'
export default class CliEnv extends Env {
  protected getConfig() {
    return getPathConfigDefault()
  }
}
