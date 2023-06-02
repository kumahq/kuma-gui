import Logger from '@/services/logger/Logger'

export default () => {
  class DisabledLogger extends Logger {
    constructor() {
      super()
      this.isEnabled = false
    }

    setup() {
      // Overrides the base loggers setup class to prevent any initialization code to run.
      console.warn('Logging is disabled')
    }
  }

  return new DisabledLogger()
}
