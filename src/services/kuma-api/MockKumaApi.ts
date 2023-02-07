import Env from '@/services/env/Env'
import KumaApi from '@/services/kuma-api/KumaApi'
import { setupMockWorker } from '@/api/setupMockWorker'
import { setupHandlers, Mocks } from '@/api/mocks'

export default class MockKumaApi extends KumaApi {
  mocks: Mocks
  constructor(env: Env, mocks: Mocks) {
    super(env)
    this.mocks = mocks
  }

  setBaseUrl(baseUrl: string): void {
    super.setBaseUrl(baseUrl)
    if (import.meta.env.VITE_MOCK_API_ENABLED === 'true') {
      setupMockWorker(setupHandlers(this.baseUrl, this.mocks))
    }
  }
}
