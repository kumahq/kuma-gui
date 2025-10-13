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
    if(error instanceof Error) {
      error.message = `${error.message} (${completeUrl})`
    }
    throw error
  }

  const contentType = response.headers.get('content-type')
  const isJson = contentType !== null ? contentType.startsWith('application/json') || contentType.startsWith('application/problem+json') : false
  const data = isJson ? await response.json() : await response.text()

  if (response.ok) {
    return { response, data }
  } else {
    const error = typeof data === 'object' ? { ...data, status: data.status ?? response.status } : { title: data, status: response.status }
    throw new ApiError(error)
  }
}
