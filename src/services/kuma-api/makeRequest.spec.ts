import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import { ApiError } from './ApiError'
import { makeRequest } from './makeRequest'

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

    const { data, response } = await makeRequest('/')

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

    await expect(() => makeRequest('/')).rejects.toThrow(expectedError)
  })

  test.each([
    [
      'minimal error response format',
      function (_input: RequestInfo | URL, _init?: RequestInit) {
        const response = new Response('{"type":"great_misfortune","detail":"A most terrible error"}', {
          status: 400,
          statusText: 'Oh no!',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        return Promise.resolve(response)
      },
      new ApiError({
        type: 'great_misfortune',
        response: new Response(undefined, { status: 400 }),
        title: 'An error has occurred while trying to load this data.',
        detail: 'A most terrible error',
      }),
    ],
    [
      'complete error response format',
      function (_input: RequestInfo | URL, _init?: RequestInit) {
        const response = new Response('{"type":"great_misfortune","title":"Validation error","detail":"A most terrible error"}', {
          status: 400,
          statusText: 'Oh no!',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        return Promise.resolve(response)
      },
      new ApiError({
        type: 'great_misfortune',
        response: new Response(undefined, { status: 400 }),
        title: 'Validation error',
        detail: 'A most terrible error',
      }),
    ],
    [
      'complete error response format with causes',
      function (_input: RequestInfo | URL, _init?: RequestInit) {
        const response = new Response(
          `
            {
              "type": "great_misfortune",
              "title": "Validation error",
              "detail": "A most terrible error",
              "invalid_parameters": [
                {
                  "field": "id",
                  "rule": "required",
                  "reason": "is a required field"
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
        type: 'great_misfortune',
        response: new Response(undefined, { status: 400 }),
        title: 'Validation error',
        detail: 'A most terrible error',
        invalidParameters: [
          {
            field: 'id',
            rule: 'required',
            reason: 'is a required field',
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
        response: new Response(undefined, { status: 400 }),
        title: 'An error has occurred while trying to load this data.',
      }),
    ],
    [
      'plain text response',
      function (_input: RequestInfo | URL, _init?: RequestInit) {
        const response = new Response('Not found!', { status: 404 })

        return Promise.resolve(response)
      },
      new ApiError({
        response: new Response(undefined, { status: 404 }),
        title: 'Not found!',
      }),
    ],
  ])('works for requests that succeed but return a failure statuses (%s)', async (title, fetchMock, expectedError) => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock)

    const call = () => makeRequest('/')

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

    await makeRequest('/', options, payload)

    expect(global.fetch).toHaveBeenCalledWith('/', expect.objectContaining(expectedInitObject))
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
