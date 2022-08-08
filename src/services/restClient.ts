import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { RestRequest } from 'msw'

import { getKumaCpServerUrl } from '@/configUrl'

export default class RestClient {
  public client: AxiosInstance

  public url: string

  public constructor() {
    this.url = this.setupUrl()
    this.client = this.axiosInit()
    this.setupMocks()
  }

  public setupMocks() {
    if (process.env.VUE_APP_MOCK_API_ENABLED === 'true') {
      const { worker: setupWorker } = require('./mocks')

      const worker = setupWorker(this.url)

      console.warn(
        '%c ✨You are mocking api requests.',
        'background: gray; color: white; display: block; padding: 0.25rem;',
      )

      worker.start({
        onUnhandledRequest(req: RestRequest) {
          if (
            // to do not inform us about not handled XHRs which are conneceted to resources
            req.url.pathname.startsWith('/fonts') ||
            req.url.pathname.startsWith('/img') ||
            req.url.pathname.startsWith('/js')
          ) {
            return
          }

          console.info('Found an unhandled %s request to %s', req.method, req.url.href)
        },
      })
    }
  }

  /**
   * axiosInit
   *
   * This function creates the Axios endpoint with the
   * value from localStorage
   */
  public axiosInit(): AxiosInstance {
    return axios.create({
      baseURL: this.url,
    })
  }

  public setupUrl(): string {
    return getKumaCpServerUrl()
  }

  public async get(path: string, options?: AxiosRequestConfig) {
    const { data } = await this.client.get(path, options)

    return data
  }

  public async raw(path: string, options?: AxiosRequestConfig) {
    return await this.client.get(path, options)
  }
}
