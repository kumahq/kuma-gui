import { makeRequest } from './makeRequest'

export default class RestClient {
  public url: string

  public constructor() {
    if (import.meta.env.PROD) {
      this.url = window.location.origin + '/'
    } else {
      this.url = import.meta.env.VITE_KUMA_API_SERVER_URL
    }
  }

  public async get(path: string, options?: RequestInit & { params?: any }) {
    const { data } = await this.raw(path, options)

    return data
  }

  public async raw(path: string, options?: RequestInit & { params?: any }) {
    const url = path.startsWith('http') ? path : `${this.url}${path}`

    return makeRequest(url, options)
  }
}
