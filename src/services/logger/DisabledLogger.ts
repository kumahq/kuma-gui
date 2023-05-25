import type Logger from '@/services/logger/DatadogLogger'
// eslint-disable-next-line no-useless-constructor
const c = class {constructor(..._args: any[]) {}}
type Parent = typeof c;
export default (
  logger: Logger,
) => {
  class DisabledLogger extends (logger.constructor as Parent) {
    setup() {
      console.warn('Logging is disabled')
    }
  }
  return new DisabledLogger(logger.env)
}
