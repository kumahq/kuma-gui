import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import { ApiError } from './ApiError'
import { MakeRequestConfig, makeRequest } from './makeRequest'

describe('makeRequest', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test.each([
    [
      function (_input: RequestInfo | URL, _init?: RequestInit) {
        const response = new Response('{"items":[{"key":"value"}]}', {
          status: 200,
          statusText: 'Super duper!',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        return Promise.resolve(response)
      },
      {
        items: [
          {
            key: 'value',
          },
        ],
      },
      {
        status: 200,
        statusText: 'Super duper!',
      },
    ],
    [
      function (_input: RequestInfo | URL, _init?: RequestInit) {
        const response = new Response('{"items":[{"key":"value"}]}', {
          status: 200,
          statusText: 'Super duper!',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        })

        return Promise.resolve(response)
      },
      {
        items: [
          {
            key: 'value',
          },
        ],
      },
      {
        status: 200,
        statusText: 'Super duper!',
      },
    ],
    [
      function (_input: RequestInfo | URL, _init?: RequestInit) {
        const response = new Response('OK', {
          status: 200,
          statusText: 'Super duper!',
          headers: {
            'Content-Type': 'plain/text',
          },
        })

        return Promise.resolve(response)
      },
      'OK',
      {
        status: 200,
        statusText: 'Super duper!',
      },
    ],
  ])('works for requests that succeed and return a success status', async (fetchMock, expectedData, expectedPartialResponse) => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock)

    const { data, response } = await makeRequest({ url: '/' })

    expect(data).toEqual(expectedData)
    expect(response).toEqual(expect.objectContaining(expectedPartialResponse))
  })

  test.each([
    [
      function (_input: RequestInfo | URL, _init?: RequestInit) {
        return Promise.reject(new Error('A most terrible error'))
      },
      new Error('A most terrible error'),
    ],
    [
      function (_input: RequestInfo | URL, _init?: RequestInit) {
        // We specifically want to test this edge case.
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('Now that’s just great')
      },
      new Error('An unknown network error occurred.'),
    ],
  ])('works for requests that fail with a network error', async (fetchMock, expectedError) => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock)

    await expect(() => makeRequest({ url: '/' })).rejects.toThrow(expectedError)
  })

  test.each([
    [
      'minimal error response format',
      function (_input: RequestInfo | URL, _init?: RequestInit) {
        const response = new Response('{"code":"great_misfortune","details":"A most terrible error"}', {
          status: 400,
          statusText: 'Oh no!',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        return Promise.resolve(response)
      },
      new ApiError({
        code: 'great_misfortune',
        statusCode: 400,
        message: 'A most terrible error',
      }),
    ],
    [
      'complete error response format',
      function (_input: RequestInfo | URL, _init?: RequestInit) {
        const response = new Response('{"code":"great_misfortune","title":"Validation error","details":"A most terrible error"}', {
          status: 400,
          statusText: 'Oh no!',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        return Promise.resolve(response)
      },
      new ApiError({
        code: 'great_misfortune',
        statusCode: 400,
        title: 'Validation error',
        message: 'A most terrible error',
      }),
    ],
    [
      'complete error response format with causes',
      function (_input: RequestInfo | URL, _init?: RequestInit) {
        const response = new Response(
          `
            {
              "code": "great_misfortune",
              "title": "Validation error",
              "details": "A most terrible error",
              "causes": [
                {
                  "field": "id",
                  "message": "This field is required."
                }
              ]
            }
          `,
          {
            status: 400,
            statusText: 'Oh no!',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        return Promise.resolve(response)
      },
      new ApiError({
        code: 'great_misfortune',
        statusCode: 400,
        title: 'Validation error',
        message: 'A most terrible error',
        causes: [
          {
            field: 'id',
            message: 'This field is required.',
          },
        ],
      }),
    ],
    [
      'unknown error response format',
      function (_input: RequestInfo | URL, _init?: RequestInit) {
        const response = new Response('{"items":[]}', {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        })

        return Promise.resolve(response)
      },
      new ApiError({
        statusCode: 400,
        message: 'An error has occurred while trying to load this data.',
      }),
    ],
    [
      'plain text response',
      function (_input: RequestInfo | URL, _init?: RequestInit) {
        const response = new Response('Not found!', { status: 404 })

        return Promise.resolve(response)
      },
      new ApiError({
        statusCode: 404,
        message: 'Not found!',
      }),
    ],
  ])('works for requests that succeed but return a failure status (%s)', async (_title, fetchMock, expectedError) => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock)

    const call = () => makeRequest({ url: '/' })

    // Note: The following assertion will only check if the thrown error is an `ApiError` and if its message is correct. Its further contents **cannot** be checked like this. For this reason, this slightly bit of heretical code below is employed. It will compare the entire error shape with the expected form.
    await expect(call).rejects.toThrowError(expectedError)

    const thrownError = await getThrownApiError(call)
    expect(thrownError.toJSON()).toEqual(expectedError.toJSON())
  })

  test.each([
    [
      {
        method: 'POST',
      },
      {
        string: 'default',
        number: 1,
        date: new Date('2023-03-14T17:34:00'),
      },
      {
        method: 'POST',
        body: '{"string":"default","number":1,"date":"2023-03-14T17:34:00.000Z"}',
      },
    ],
  ])('correctly sends JSON payloads', async (options, payload, expectedInitObject) => {
    jest.spyOn(global, 'fetch').mockImplementation((_input: RequestInfo | URL, _init?: RequestInit) => Promise.resolve(new Response('OK')))

    await makeRequest({ url: '/', options, payload })

    expect(global.fetch).toHaveBeenCalledWith('/', expect.objectContaining(expectedInitObject))
  })

  describe('response interceptors', () => {
    test.each([
      [
        {
          url: '/',
          responseInterceptor: {
            onFulfilled: (responseObj) => {
              responseObj.data = 'test'
              return Promise.resolve(responseObj)
            },
          },
        } satisfies MakeRequestConfig,
        'test',
      ],
    ])('onFulfilled handlers produce response', async (config: MakeRequestConfig, expectedData: unknown) => {
      jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve(new Response('OK')))

      const { data } = await makeRequest(config)

      expect(data).toEqual(expectedData)
    })

    test.each([
      [
        {
          url: '/',
          responseInterceptor: {
            onRejected: (error) => {
              error.code = 'altered-code'
              return Promise.reject(error)
            },
          },
        } satisfies MakeRequestConfig,
        new ApiError({
          statusCode: 401,
          message: 'Unauthorized',
          code: 'altered-code',
        }),
      ],
    ])('onRejected handlers produce error', async (config: MakeRequestConfig, expectedError: ApiError) => {
      jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve(new Response('Unauthorized', { status: 401 })))

      const call = () => makeRequest(config)

      // Note: The following assertion will only check if the thrown error is an `ApiError` and if its message is correct. Its further contents **cannot** be checked like this. For this reason, this slightly bit of heretical code below is employed. It will compare the entire error shape with the expected form.
      await expect(call).rejects.toThrowError(expectedError)

      const thrownError = await getThrownApiError(call)
      expect(thrownError.toJSON()).toEqual(expectedError.toJSON())
    })

    test.each([
      [
        {
          url: '/',
          responseInterceptor: {
            onRejected: (error) => {
              if (error.statusCode === 401) {
                return Promise.resolve(new Response('Yeah'))
              }

              return Promise.reject(error)
            },
          },
        } satisfies MakeRequestConfig,
        'Yeah',
      ],
    ])('onRejected handlers produce response', async (config: MakeRequestConfig, expectedData: unknown) => {
      jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve(new Response('Unauthorized', { status: 401 })))

      const { data } = await makeRequest(config)

      expect(data).toEqual(expectedData)
    })
  })
})

async function getThrownApiError(call: () => Promise<unknown>): Promise<ApiError> {
  let thrownError

  try {
    await call()
  } catch (error) {
    thrownError = error
  }

  return thrownError as ApiError
}
