import { ApiError } from './ApiError'

type FetchParams = [url: string, init: RequestInit]
export type MakeRequestResponseObject = { response: Response, data: any }

export type ResponseInterceptor = {
  onFulfilled?: (responseObj: MakeRequestResponseObject) => MakeRequestResponseObject | Promise<MakeRequestResponseObject>

  onRejected?: (error: ApiError, responseObj: MakeRequestResponseObject, ...fetchParams: FetchParams) => Promise<Response>
}

export interface MakeRequestConfig {
  url: string,
  options?: RequestInit & { params?: any },
  payload?: any,
  responseInterceptor?: ResponseInterceptor,
}

/**
 * ## Interceptors
 *
 * ### Response interceptors
 *
 * Allows intercepting responses with an error code (i.e. status code is not between 200 and 299).
 *
 * The return value of `onRejected` is awaited. A rejected promise is treated as yielding the (possibly altered) error. A fulfilled promise is treated as correcting the error and the promise’s value is expected to be a new `Response` object (e.g. `return Promise.resolve(fetch(url, init))`).
 *
 * **Interceptor for yielding error**:
 *
 * ```js
 * (error, responseObj) => {
 *   error.traceId = responseObj.response.headers.get('x-datadog-trace-id')
 *   return Promise.reject(error)
 * }
 * ```
 *
 * **Interceptor for correcting error**:
 *
 * ```js
 * (error, responseObj, url, init) => {
 *   // Do something to correct the failing fetch call.
 *   return Promise.resolve(fetch(url, init))
 * }
 * ```
 */
export async function makeRequest(config: MakeRequestConfig): Promise<MakeRequestResponseObject> {
  const init = { ...config.options }
  const method = init.method ?? 'GET'

  // Streamlines the headers data structure for simplified use throughout this function.
  init.headers = init.headers instanceof Headers ? init.headers : new Headers(init.headers)

  // Sets the Content-Type if not already set explicitly. Not necessary for requests without a body.
  if (!init.headers.has('content-type') && ['POST', 'PUT', 'PATCH'].includes(method)) {
    init.headers.set('content-type', 'application/json')
  }

  let completeUrl = config.url

  if ('params' in init && init.params !== undefined && method === 'GET') {
    // Turns `params` into query parameters for GET requests.
    completeUrl += `?${new URLSearchParams(init.params).toString()}`
    delete init.params
  }

  if (config.payload !== undefined) {
    if (init.headers.get('content-type')?.startsWith('application/json')) {
      // Sets the request body to the JSON representation of `payload`.
      init.body = JSON.stringify(config.payload)
    } else {
      init.body = config.payload
    }
  }

  const fetchParams: FetchParams = [completeUrl, init]
  let response: Response

  try {
    response = await fetch(...fetchParams)
  } catch (error) {
    throw createNetworkError(error)
  }

  let responseObject = await createResponseObject(response)

  if (responseObject.response.ok) {
    if (config.responseInterceptor?.onFulfilled) {
      responseObject = await config.responseInterceptor.onFulfilled(responseObject)
    }

    return responseObject
  }

  let responseError = createApiError(responseObject.response, responseObject.data)

  if (config.responseInterceptor?.onRejected) {
    try {
      const newResponse = await config.responseInterceptor.onRejected(responseError, responseObject, ...fetchParams)

      return createResponseObject(newResponse)
    } catch (error) {
      if (error instanceof ApiError) {
        responseError = error
      } else {
        throw new Error('Response interceptor raised unknown error (should be ApiError)')
      }
    }
  }

  throw responseError
}

function createNetworkError(error: unknown): Error {
  const requestErrorMessage = error instanceof Error ? error.message : 'An unknown network error occurred.'

  return new Error(requestErrorMessage)
}

async function createResponseObject(response: Response): Promise<MakeRequestResponseObject> {
  const contentType = response.headers.get('content-type')
  const isJsonResponse = contentType !== null ? contentType.startsWith('application/json') || contentType.startsWith('application/problem+json') : false
  const data = isJsonResponse ? await response.json() : await response.text()

  return { response, data }
}

/**
 * Creates an appropriate `ApiError` object. It handles the API’s standard error format (e.g. `{ "title": "Error", "code": "error_code" }`).
 */
function createApiError(response: Response, data: any): ApiError {
  let title = null
  let message = 'An error has occurred while trying to load this data.'
  let code = null
  let causes = []

  if (typeof data === 'string' && data.length > 0) {
    message = data
  } else if (data) {
    if (Object.prototype.hasOwnProperty.call(data, 'title')) {
      title = data.title
    }

    if (Object.prototype.hasOwnProperty.call(data, 'details')) {
      message = data.details
    }

    if (Object.prototype.hasOwnProperty.call(data, 'code')) {
      code = data.code
    }

    if (Object.prototype.hasOwnProperty.call(data, 'causes') && Array.isArray(data.causes)) {
      causes = data.causes
    }
  }

  // TODO: Temporarily sets the error message for 403 errors until we implement better errors in the backend.
  // See: https://github.com/kumahq/kuma-gui/issues/362
  if (response.status === 403) {
    message = 'You currently don’t have access to this data.'
  }

  return new ApiError({ title, message, code, causes, statusCode: response.status })
}
