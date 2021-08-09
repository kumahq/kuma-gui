import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { RestRequest } from 'msw'
export default class RestClient {
  public headers: Record<string, string>

  public client: AxiosInstance

  public clientConfig: AxiosInstance

  public host: string

  public constructor () {
    // this.host = opts.url
    this.host = ''

    // leave this blank!
    this.headers = {}

    RestClient.setupMocks()
    this.client = RestClient.axiosInit()
    this.clientConfig = RestClient.kumaClientConfig()
  }

  /**
   * axiosInit
   *
   * This function creates the Axios endpoint with the
   * value from localStorage
   */
  public static axiosInit (): AxiosInstance {
    const apiUrlFromLS: string = localStorage.getItem('kumaApiUrl') || ''
    const kumaEnvFromLS: string = localStorage.getItem('kumaEnv') || ''

    return axios.create({
      baseURL: apiUrlFromLS
    })
  }

  /**
   * kumaClientConfig
   *
   * This function creates the Axios instance for
   * fetching data from the Kuma api. It contains
   * information that goes beyond simply providing
   * our app with the API URL endpoint and simple info.
   */
  public static kumaClientConfig (): AxiosInstance {
    const kumaApiUrl = localStorage.getItem('kumaApiUrl') || ''
    const configUrl = `${kumaApiUrl}config`

    return axios.create({
      baseURL: configUrl
    })
  }

  public static setupMocks () {
    if (process.env.VUE_APP_MOCK_API_ENABLED === 'true') {
      const apiURL = localStorage.getItem('kumaApiUrl')

      const { worker: setupWorker } = require('./mocks')

      const worker = setupWorker(apiURL)

      console.warn(
        '%c ✨You are mocking api requests.',
        'background: gray; color: white; display: block; padding: 0.25rem;'
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

          console.info(
            'Found an unhandled %s request to %s',
            req.method,
            req.url.href,
          )
        }
      })
    }
  }

  public buildUrl (path: string) {
    return `${this.host}${path}`
  }

  /** fetch the status information of Kuma */
  public async status (path: string, options?: AxiosRequestConfig) {
    const opts = await options || {}
    const url = await path
    const client = await this.client
    let statusCode

    try {
      const { status } = await client.get(url, opts)

      statusCode = status
    } catch (e) {}

    return statusCode === 200 ? 'OK' : null
  }

  /** fetch all Kuma API endpoints */
  public async get (path: string, options?: AxiosRequestConfig) {
    const opts = await options || {}
    // const url = this.buildUrl(path)
    const url = await path
    const client = await this.client
    const { data } = await client.get(url, opts)

    return data
  }

  /** fetch all Kuma API endpoints */
  public async getConfig () {
    const client = await this.clientConfig
    const { data } = await client.get('')

    return data
  }
}
