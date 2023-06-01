import { datadogLogs } from '@datadog/browser-logs'

import type Env from '@/services/env/Env'
import type { ClientConfigInterface } from '@/store/modules/config/config.types'

export default class DatadogLogger {
  env: Env['var']

  constructor(env: Env['var']) {
    this.env = env
  }

  setup(config: ClientConfigInterface) {
    if (config.reports.enabled) {
      const service = this.env('KUMA_PRODUCT_NAME').toLowerCase().replaceAll(' ', '-') + '-ui'

      datadogLogs.init({
        // The current client token is called “kuma-ui” in the Datadog UI.
        // Previous versions of the application used a different client token attached to a different Datadog instance. This client token was called “kuma-gui” in the Datadog UI.
        clientToken: 'pub1aadd2cab84c05bf9959e00a35b213a1',
        site: 'datadoghq.com',
        forwardErrorsToLogs: true,
        sampleRate: 100,
        service,
        env: import.meta.env.MODE,
      })
    }
  }
}
