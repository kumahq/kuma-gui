import { makeRequest } from './makeRequest'
import { getKumaCpServerUrl } from '@/configUrl'

export default class RestClient {
  public url: string

  public constructor() {
    this.url = getKumaCpServerUrl()
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
