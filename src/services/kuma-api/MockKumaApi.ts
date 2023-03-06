import KumaApi from './KumaApi'
import { setupHandlers, Mocks } from '@/api/mocks'
import { setupMockWorker } from '@/api/setupMockWorker'
import Env from '@/services/env/Env'

export default class MockKumaApi extends KumaApi {
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
export const mockApi = function (parent: typeof KumaApi) {
  const name = `Mock${parent.name}`
  const mocked = {
    [name]: class extends parent {
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
    },
  }
  return mocked[name]
}
