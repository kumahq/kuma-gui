import { describe, expect, test } from 'vitest'

import { ApiError } from './ApiError'

describe('ApiError', () => {
  test.each([
    [
      new ApiError({
        status: 200,
        title: 'Error message',
      }),
      {
        status: 200,
        type: null,
        title: 'Error message',
        detail: null,
        instance: null,
        invalidParameters: [],
      },
    ],
    [
      new ApiError({
        status: 400,
        type: 'https://kongapi.info/konnect/invalid-request',
        title: 'Invalid Request',
        detail: 'Some of the fields provided were invalid',
        instance: 'kong:trace:6c1ef33ae5bce33634d7d7d695c7f203',
        invalidParameters: [
          {
            field: 'name',
            reason: 'is a required field',
          },
        ],
      }),
      {
        status: 400,
        type: 'https://kongapi.info/konnect/invalid-request',
        title: 'Invalid Request',
        detail: 'Some of the fields provided were invalid',
        instance: 'kong:trace:6c1ef33ae5bce33634d7d7d695c7f203',
        invalidParameters: [
          {
            field: 'name',
            reason: 'is a required field',
          },
        ],
      },
    ],
  ])('toJSON produces expected result', (apiError, expectedToJsonObject) => {
    expect(apiError.toJSON()).toEqual(expectedToJsonObject)
  })
})
