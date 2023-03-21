import { RestHandler } from 'msw'

import { Api } from './Api'
import { Mocks } from '@/api/mocks'
import { setupMockWorker } from '@/api/setupMockWorker'
import type Env from '@/services/env/Env'

export const mockApi = function (parent: typeof Api, mocks: Mocks, setupHandlers: (url: string, mocks: Mocks) => RestHandler[]) {
  return class MockApi extends parent {
    constructor(Env: Env) {
      super(Env)
      this.setupMockWorker()
    }

    setBaseUrl(baseUrl: string): void {
      super.setBaseUrl(baseUrl)
      this.setupMockWorker()
    }

    setupMockWorker() {
      if (this.env.var('KUMA_MOCK_API_ENABLED') === 'true') {
        const handlers = setupHandlers(super.baseUrl, mocks)
        setupMockWorker(parent.name, handlers)
      }
    }
  }
}
