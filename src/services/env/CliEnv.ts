import Env, { getPathConfigDefault } from './Env'
export default class CliEnv extends Env {
  protected getConfig() {
    return getPathConfigDefault(import.meta.env.VITE_KUMA_API_SERVER_URL)
  }
}
