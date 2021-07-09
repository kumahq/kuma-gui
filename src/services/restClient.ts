import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { RestRequest } from 'msw'
export default class RestClient {
  headers: Record<string, string>

  client: AxiosInstance

  clientConfig: AxiosInstance

  host: string

  constructor () {
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
  static axiosInit (): AxiosInstance {
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
  static kumaClientConfig (): AxiosInstance {
    const configUrl = `${localStorage.getItem('kumaApiUrl')}config`

    return axios.create({
      baseURL: configUrl
    })
  }

  static setupMocks () {
    if (process.env.VUE_APP_MOCK_API_ENABLED === 'true') {
      const { worker } = require('./mock')

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

  buildUrl (path: string) {
    return `${this.host}${path}`
  }

  /** fetch the status information of Kuma */
  async status (path: string, options?: AxiosRequestConfig) {
    const opts = await options || {}
    const url = await path
    const client = await this.client
    const { status } = await client.get(url, opts)

    return status === 200 ? 'OK' : null
  }

  /** fetch all Kuma API endpoints */
  async get (path: string, options?: AxiosRequestConfig) {
    const opts = await options || {}
    // const url = this.buildUrl(path)
    const url = await path
    const client = await this.client
    const { data } = await client.get(url, opts)

    return data
  }

  /** fetch all Kuma API endpoints */
  async getConfig () {
    const client = await this.clientConfig
    const { data } = await client.get('')

    return data
  }
}
