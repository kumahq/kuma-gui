import { makeRequest } from './makeRequest'

describe('makeRequest', () => {
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
  ])('works', async (fetchMock, expectedData, expectedPartialResponse) => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock)

    const { data, response } = await makeRequest('/')

    expect(data).toEqual(expectedData)
    expect(response).toEqual(expect.objectContaining(expectedPartialResponse))
  })
})
