import { ApiError } from './ApiError'

export async function makeRequest(url: string, options: RequestInit & { params?: any } = {}, payload?: any) {
  const init = options
  const method = init.method ?? 'GET'

  // Streamlines the headers data structure for simplified use throughout this function.
  init.headers = init.headers instanceof Headers ? init.headers : new Headers(init.headers)

  // Sets the Content-Type if not already set explicitly. Not necessary for requests without a body.
  if (!init.headers.has('content-type') && ['POST', 'PUT', 'PATCH'].includes(method)) {
    init.headers.set('content-type', 'application/json')
  }

  let completeUrl = url

  if ('params' in options && options.params !== undefined && method === 'GET') {
    // Turns `params` into query parameters for GET requests.
    completeUrl += `?${new URLSearchParams(options.params).toString()}`
  }

  if (payload !== undefined) {
    if (init.headers.get('content-type')?.startsWith('application/json')) {
      // Sets the request body to the JSON representation of `payload`.
      init.body = JSON.stringify(payload)
    } else {
      init.body = payload
    }
  }

  let response

  try {
    response = await fetch(completeUrl, init)
  } catch (error) {
    throw createNetworkError(error)
  }

  const contentType = response.headers.get('content-type')
  const isJson = contentType !== null ? contentType.startsWith('application/json') || contentType.startsWith('application/problem+json') : false
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

function createApiError(response: Response, data: unknown): ApiError {
  const status = response.status
  let type
  let title
  let detail
  let instance
  let invalidParameters

  if (typeof data === 'string' && data.length > 0) {
    title = data
  } else if (data !== null && typeof data === 'object') {
    if ('type' in data && typeof data.type === 'string') {
      type = data.type
    }

    if ('title' in data && typeof data.title === 'string') {
      title = data.title
    }

    if ('detail' in data && typeof data.detail === 'string') {
      detail = data.detail
    }

    if ('instance' in data && typeof data.instance === 'string') {
      instance = data.instance
    }

    if ('invalid_parameters' in data && Array.isArray(data.invalid_parameters)) {
      invalidParameters = data.invalid_parameters
    }
  }

  // TODO: Sets the error message for 403 errors until we implement better errors in the backend.
  if (status === 403) {
    title = 'You currently don’t have access to this data.'
  }

  if (title === undefined) {
    title = 'An error has occurred while trying to load this data.'
  }

  return new ApiError({ status, type, title, detail, instance, invalidParameters })
}
