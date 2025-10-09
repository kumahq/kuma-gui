import { describe, expect, test } from 'vitest'

import { ApiError } from './ApiError'

describe('ApiError', () => {
  test.each([
    [
      new ApiError({
        status: 200,
        title: 'Error message',
        instance: 'kuma:trace:123',
      }),
      {
        status: 200,
        type: '',
        title: 'Error message',
        detail: '',
        instance: 'kuma:trace:123',
        invalid_parameters: [],
      },
    ],
    [
      new ApiError({
        status: 400,
        type: 'https://kongapi.info/konnect/invalid-request',
        title: 'Invalid Request',
        detail: 'Some of the fields provided were invalid',
        instance: 'kong:trace:6c1ef33ae5bce33634d7d7d695c7f203',
        invalid_parameters: [
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
        invalid_parameters: [
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
