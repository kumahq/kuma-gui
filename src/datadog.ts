import { datadogLogs } from '@datadog/browser-logs'
import Kuma from '@/services/kuma'

/** Initiate Datadog */

async function setupDatadog() {
  const config = await Kuma.getConfig()

  if (config.reports.enabled) {
    datadogLogs.init({
      clientToken: 'pub94a0029259f79f29a5d881a06d1e9653',
      site: 'datadoghq.com',
      forwardErrorsToLogs: true,
      service: process.env.VUE_APP_NAMESPACE,
      sampleRate: 100,
      env: process.env.NODE_ENV,
    })
  }
}

export default setupDatadog
