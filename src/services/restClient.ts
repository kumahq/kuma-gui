import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { getKumaCpServerUrl } from '@/configUrl'

export default class RestClient {
  public client: AxiosInstance

  public url: string

  public constructor() {
    this.url = this.setupUrl()
    this.client = this.axiosInit()
  }

  public async get(path: string, options?: AxiosRequestConfig) {
    const { data } = await this.client.get(path, options)

    return data
  }

  public async raw(path: string, options?: AxiosRequestConfig) {
    return await this.client.get(path, options)
  }

  /**
   * axiosInit
   *
   * This function creates the Axios endpoint with the
   * value from localStorage
   */
  private axiosInit(): AxiosInstance {
    return axios.create({
      baseURL: this.url,
    })
  }

  private setupUrl(): string {
    return getKumaCpServerUrl()
  }
}
