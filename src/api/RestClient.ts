import { makeRequest } from './makeRequest'

const DEFAULT_BASE_URL = import.meta.env.PROD ? window.location.origin : import.meta.env.VITE_KUMA_API_SERVER_URL

export class RestClient {
  /**
   * The API base URL. **Will always be stored without a trailing slash**.
   */
  _baseUrl: string = DEFAULT_BASE_URL

  /**
   * The absolute API base URL used in all requests. Includes its base path segment if one is set.
   */
  get baseUrl() {
    return this._baseUrl
  }

  /**
   * @param baseUrlOrPath the API base URL or the API base path
   */
  set baseUrl(baseUrlOrPath: string) {
    if (baseUrlOrPath.startsWith('http')) {
      this._baseUrl = trimTrailingSlashes(baseUrlOrPath)
    } else {
      const basePath = trimSlashes(baseUrlOrPath)
      this._baseUrl = [DEFAULT_BASE_URL, basePath].filter((segment) => segment !== '').join('/')
    }
  }

  /**
   * Performs a network request using the GET method.
   *
   * @returns the response’s de-serialized data.
   */
  async get(path: string, options?: RequestInit & { params?: any }): Promise<any> {
    const processedOptions: RequestInit & { params?: any } = options ?? {}
    processedOptions.method = 'GET'

    const { data } = await this.raw(path, processedOptions)

    return data
  }

  /**
   * Performs a network request.
   *
   * @returns the response’s de-serialized data (when applicable) and the raw `Response` object.
   */
  async raw(urlOrPath: string, options?: RequestInit & { params?: any }): Promise<{ response: Response, data: any }> {
    const url = urlOrPath.startsWith('http') ? urlOrPath : [this.baseUrl, urlOrPath].join('/')

    return makeRequest(url, options)
  }
}

function trimTrailingSlashes(str: string): string {
  return str.replace(/\/+$/, '')
}

function trimLeadingSlashes(str: string): string {
  return str.replace(/^\/+/, '')
}

function trimSlashes(str: string): string {
  return trimTrailingSlashes(trimLeadingSlashes(str))
}
