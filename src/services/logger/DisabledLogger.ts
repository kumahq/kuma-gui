import type { ClientConfigInterface } from '@/store/modules/config/config.types'
const c = class {
  // eslint-disable-next-line no-useless-constructor
  constructor(..._args: any[]) {
  }
}
export const disabledLogger = function (parent: typeof c) {
  const name = `Disabled${parent.name}`
  const disabled = {
    [name]: class extends parent {
      setup(_config: ClientConfigInterface) {
        console.log('Logging disabled')
      }
    },
  }
  return disabled[name]
}
