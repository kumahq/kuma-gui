import KumaApi from './KumaApi'
import { setupHandlers } from '@/api/mocks'
import { setupMockWorker } from '@/api/setupMockWorker'
import { get, TOKENS } from '@/services/index'

export const mockApi = function (parent: typeof KumaApi) {
  return class MockApi extends parent {
    setBaseUrl(baseUrl: string): void {
      super.setBaseUrl(baseUrl)

      if (this.env.var('KUMA_MOCK_API_ENABLED') === 'true') {
        const handlers = setupHandlers(baseUrl, get(TOKENS.mocks))
        setupMockWorker('KumaApi', handlers)
      }
    }
  }
}
