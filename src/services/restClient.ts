import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import Mock from '@/services/mock'

export interface RestClientOptions {
  injectMocks: any
}
export default class RestClient {
  headers: Record<string, string>

  client: AxiosInstance

  clientConfig: AxiosInstance

  host: string

  constructor (options?: RestClientOptions) {
    const opts = options || {
      injectMocks: undefined
    }

    // this.host = opts.url
    this.host = ''

    // leave this blank!
    this.headers = {}

    // RestClient.setupMocks(opts.injectMocks)

    /**
     * We no longer need to run this because the setup is done
     * at app launch before anything else happens.
     */
    // RestClient.apiConfig()

    RestClient.setupMocks(opts.injectMocks)
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

  /**
   * Setup mock endpoints that override axios calls
   * @param {Object} injectMocks - the mock endpoint functions defined by any
   * external plugins - if they exist. If not, then it passes the real (unmocked) response.
   */
  static setupMocks (injectMocks: ((mock: any) => void)[]|undefined) {
    const mock = new Mock(axios)
    if (process.env.VUE_APP_MOCK_API_ENABLED === 'true') {
      mock.setupMockEndpoints()
    } else {
      if (injectMocks && injectMocks.length) {
        injectMocks.forEach(injectedMock => {
          injectedMock(mock.mock)
        })
      }

      mock.setupPluginMocks()
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
    const { statusText } = await client.get(url, opts)

    return statusText
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
