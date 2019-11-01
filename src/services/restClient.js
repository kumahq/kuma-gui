import axios from 'axios';
import Mock from '@/services/mock';

export default class restClient {
  constructor (options) {
    const opts = options || {}

    this.headers = { 'Cache-Control': 'no-cache' }
    this.host = opts.url

    this.client = axios.create({
      baseURL: process.env.VUE_APP_KUMA_API,
      headers: this.headers,
      ...opts.axiosConfig
    })
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
