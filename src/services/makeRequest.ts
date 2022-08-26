export async function makeRequest(url: string, options: RequestInit & { params?: any } = {}) {
  const init: RequestInit = options

  init.headers = init.headers instanceof Headers ? init.headers : new Headers(init.headers)
  if (!init.headers.has('content-type')) {
    init.headers.set('content-type', 'application/json')
  }

  const method = init.method ?? 'GET'
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

  let response: Response

  try {
    response = await fetch(completeUrl, init)
  } catch (error) {
    const requestErrorMessage = error instanceof Error ? error.message : 'An unknown request error occurred.'

    throw new Error(requestErrorMessage)
  }

  const contentType = response.headers.get('content-type')
  const isJson = contentType !== null ? contentType.startsWith('application/json') : false
  const data = isJson ? await response.json() : await response.text()

  if (response.ok) {
    return { response, data }
  } else {
    throw new Error('An unknown response error occurred.')
  }
}
