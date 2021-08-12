import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { RestRequest } from 'msw'
export default class RestClient {
  public client: AxiosInstance

  public url: string

  public constructor() {
    this.url = this.setupUrl()
    this.client = this.axiosInit()
    RestClient.setupMocks()
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
    let url
    if (process.env.NODE_ENV === 'development') {
      url = process.env.VUE_APP_KUMA_CONFIG?.replace('/config', '/') || ''
    } else {
      const href = window.location.href

      url = `${href.substring(0, href.indexOf('/gui'))}/`
    }

    localStorage.setItem('kumaApiUrl', url)

    return url
  }

  public async get(path: string, options?: AxiosRequestConfig) {
    const { data } = await this.client.get(path, options)

    return data
  }

  public async raw(path: string, options?: AxiosRequestConfig) {
    return await this.client.get(path, options)
  }
}
