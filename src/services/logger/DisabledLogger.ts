import Logger from './Logger'
export default class DisabledLogger extends Logger {
  async setup() {
    console.log('Logging disabled')
  }
}
