import axios from 'axios'
import Mock from '@/services/mock'

export default class RestClient {
  constructor (options) {
    const opts = options || {}

    // this.host = opts.url

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
  }

  /**
   * axiosInit
   *
   * This function creates the Axios endpoint with the
   * value from localStorage
   */
  static axiosInit () {
    const apiUrlFromLS = localStorage.getItem('kumaApiUrl')
    const kumaEnvFromLS = localStorage.getItem('kumaEnv')

    return axios.create({
      baseURL: apiUrlFromLS,
      headers: this.headers,
      ...this.axiosConfig
    })
  }

  /**
   * Setup mock endpoints that override axios calls
   * @param {Object} injectMocks - the mock endpoint functions defined by any
   * external plugins - if they exist. If not, then it passes the real (unmocked) response.
   */
  static setupMocks (injectMocks) {
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

  buildUrl (path) {
    return `${this.host}${path}`
  }

  async status (path, options) {
    const url = await path
    const client = await this.client

    return client.get(url)
      .then(response => {
        return response.statusText
      })
      .catch(error => {
        console.error(error)

        return error
      })
  }

  async get (path, options) {
    const opts = await options || {}
    // const url = this.buildUrl(path)
    const url = await path
    const client = await this.client

    return client.get(url, opts)
      .then(response => {
        const data = response.data

        return data
      })
      .catch(error => {
        console.error(error)
      })
  }
}
