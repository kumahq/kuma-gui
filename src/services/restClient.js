import axios from 'axios'
import Mock from '@/services/mock'

export default class RestClient {
  constructor (options) {
    const opts = options || {}

    this.host = opts.url

    // leave this blank!
    this.headers = {}

    RestClient.setupMocks(opts.injectMocks)

    this.client = axios.create({
      baseURL: this.host,
      headers: this.headers,
      ...opts.axiosConfig
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

  get (path, options) {
    const opts = options || {}
    const url = this.buildUrl(path)

    const promise = this.client
      .get(url, opts)
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.error(error)
      })

    return promise
  }
}
