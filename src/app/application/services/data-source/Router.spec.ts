import { describe, expect, test } from 'vitest'

import Router from './Router'

describe('Router', () => {
  test('params/arguments are passed through correctly', async () => {
    const router = new Router({
      '/uri/:param/:arg': async (params: any) => {
        return params
      },
    })

    const expected = {
      arg: 'arg',
      param: 'param',
    }

    const found = router.match('/uri/param/arg')
    const response = await found.route(found.params)
    expect(response).toStrictEqual(expected)
  })

  test('a uri with no params defined receives an empty object as params', async () => {
    const router = new Router({
      '/uri/': async (params: any) => {
        return params
      },
    })

    const expected = {}
    const found = router.match('/uri/')
    const response = await found.route(found.params)
    expect(response).toStrictEqual(expected)
  })

  test('an undefined route throws an error', async () => {
    const router = new Router({
      '/uri/': async (params: any) => {
        return params
      },
    })

    expect(() => router.match('/kuma-not-found-view/')).toThrow(Error)
  })
})
