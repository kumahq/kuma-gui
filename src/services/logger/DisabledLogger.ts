import Logger from '@/services/logger/Logger'

export default () => {
  class DisabledLogger extends Logger {
    setup() {
      // Overrides the base loggers setup class to prevent any initialization code to run.
      console.warn('Logging is disabled')
    }

    _log() {
      // Overrides primary log method.
    }
  }

  return new DisabledLogger()
}
