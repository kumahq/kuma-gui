import { datadogLogs } from '@datadog/browser-logs'

import { kumaApi } from '@/api/kumaApi'
import type Env from '@/services/env/Env'

export default class Logger {
  env: Env
  constructor(env: Env) {
    this.env = env
  }

  async setup() {
    const config = await kumaApi.getConfig()

    if (config.reports.enabled) {
      datadogLogs.init({
        clientToken: 'pub94a0029259f79f29a5d881a06d1e9653',
        site: 'datadoghq.com',
        forwardErrorsToLogs: true,
        service: this.env.var('KUMA_PRODUCT_NAME'),
        sampleRate: 100,
        env: import.meta.env.MODE,
      })
    }
  }
}
