import Logger from './DatadogLogger'
export default class DisabledLogger extends Logger {
  setup(_enabled: boolean) {
    console.log('Logging disabled')
  }
}
