import KumaApi from './KumaApi'
import { setupHandlers, Mocks } from '@/api/mocks'
import { setupMockWorker } from '@/api/setupMockWorker'
import Env from '@/services/env/Env'

export const mockApi = function (parent: typeof KumaApi) {
  return class MockApi extends parent {
    mocks: Mocks
    constructor(env: Env, mocks: Mocks) {
      super(env)
      this.mocks = mocks
    }

    setBaseUrl(baseUrl: string): void {
      super.setBaseUrl(baseUrl)
      if (this.env.var('KUMA_MOCK_API_ENABLED') === 'true') {
        setupMockWorker(setupHandlers(this.env.var('KUMA_API_URL'), this.mocks))
      }
    }
  }
}
