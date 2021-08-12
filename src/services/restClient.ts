import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { RestRequest } from 'msw'
export default class RestClient {
  public client: AxiosInstance

  public constructor() {
    this.client = RestClient.axiosInit()
    RestClient.setupMocks()
  }

  /**
   * axiosInit
   *
   * This function creates the Axios endpoint with the
   * value from localStorage
   */
  public static axiosInit(): AxiosInstance {
    const apiUrlFromLS: string = localStorage.getItem('kumaApiUrl') || ''

    return axios.create({
      baseURL: apiUrlFromLS,
    })
  }

  public static setupMocks() {
    if (process.env.VUE_APP_MOCK_API_ENABLED === 'true') {
      const apiURL = localStorage.getItem('kumaApiUrl')

      const { worker: setupWorker } = require('./mocks')

      const worker = setupWorker(apiURL)

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

  public async get(path: string, options?: AxiosRequestConfig) {
    const { data } = await this.client.get(path, options)

    return data
  }

  public async raw(path: string, options?: AxiosRequestConfig) {
    return await this.client.get(path, options)
  }
}
