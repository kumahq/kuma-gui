import { describe, expect, test } from '@jest/globals'

import { RestClient } from './RestClient'

describe('RestClient', () => {
  test('has expected initial base URL', () => {
    const restClient = new RestClient()

    expect(restClient.baseUrl).toBe('http://localhost:5681')
  })

  test.each([
    ['api', 'http://localhost:5681/api'],
    ['/api', 'http://localhost:5681/api'],
    ['/api/', 'http://localhost:5681/api'],
    ['test/api', 'http://localhost:5681/test/api'],
    ['/test/api', 'http://localhost:5681/test/api'],
    ['/test/api/', 'http://localhost:5681/test/api'],
    ['http://localhost:1234/api', 'http://localhost:1234/api'],
    ['http://localhost:1234/api/', 'http://localhost:1234/api'],
  ])('sets expected base URL for “%s”', (newBaseUrl, expectedBaseUrl) => {
    const restClient = new RestClient()

    restClient.baseUrl = newBaseUrl

    expect(restClient.baseUrl).toBe(expectedBaseUrl)
  })
})
