import type { ClientConfigInterface } from '@/store/modules/config/config.types'
const c = class {
  // eslint-disable-next-line no-useless-constructor
  constructor(..._args: any[]) {
  }
}
export const disabledLogger = function (parent: typeof c) {
  return class DisabledLogger extends parent {
    setup(_config: ClientConfigInterface) {
      console.log('Logging disabled')
    }
  }
}
