import Logger from './DatadogLogger'
import type { ClientConfigInterface } from '@/store/modules/config/config.types'

export default class DisabledLogger extends Logger {
  setup(_config: ClientConfigInterface) {
    console.log('Logging disabled')
  }
}
