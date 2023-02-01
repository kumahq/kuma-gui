import Logger from './DatadogLogger'
export default class DisabledLogger extends Logger {
  async setup() {
    console.log('Logging disabled')
  }
}
