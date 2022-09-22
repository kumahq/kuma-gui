import { ApiError } from './ApiError'

export async function makeRequest(url: string, options: RequestInit & { params?: any } = {}) {
  const init = options
  const method = init.method ?? 'GET'

  // Streamlines the headers data structure for simplified use throughout this function.
  init.headers = init.headers instanceof Headers ? init.headers : new Headers(init.headers)

  // Sets the Content-Type if not already set explicitly. Not necessary for requests without a body.
  if (!init.headers.has('content-type') && ['POST', 'PUT', 'PATCH'].includes(method)) {
    init.headers.set('content-type', 'application/json')
  }

  let completeUrl = url

  if ('params' in options) {
    if (method === 'GET') {
      // Turns `params` into query parameters for GET requests.
      completeUrl += `?${new URLSearchParams(options.params).toString()}`
    } else if (init.headers.get('content-type')?.startsWith('application/json')) {
      // Sets the request body to the JSON representation of `params`.
      init.body = JSON.stringify(options.params)
    }
  }

  let response

  try {
    response = await fetch(completeUrl, init)
  } catch (error) {
    throw createNetworkError(error)
  }

  const contentType = response.headers.get('content-type')
  const isJson = contentType !== null ? contentType.startsWith('application/json') : false
  const data = isJson ? await response.json() : await response.text()

  if (response.ok) {
    return { response, data }
  } else {
    throw createApiError(response, data)
  }
}

function createNetworkError(error: unknown): Error {
  const requestErrorMessage = error instanceof Error ? error.message : 'An unknown network error occurred.'

  return new Error(requestErrorMessage)
}

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
