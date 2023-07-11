import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import DataSource from './DataSource.vue'
import { withSources } from '@/../jest/jest-setup-after-env'

describe('DataSourcePool', () => {
  test("passing an empty uri doesn't fire change", async () => {
    const wrapper = mount(DataSource, {
      props: {
        src: '',
      },
    })

    await flushPromises()

    expect(wrapper.emitted('change')).toBeFalsy()
  })
  test('cached responses and errors work', async () => {
    const err = new Error('error')
    const SUCCESS = 'one'
    const REFRESHED = 'two'
    let res = SUCCESS
    withSources(() => {
      return {
        '/success': (_params: any, source: any) => {
          source.close()
          return Promise.resolve(res)
        },
        '/error': (_params: any, source: any) => {
          source.close()
          throw err
        },
      }
    })

    // change
    const wrapper = mount(DataSource, {
      props: {
        src: '/success',
      },
    })

    await flushPromises()
    expect(wrapper.emitted('change')?.[0]).toEqual([SUCCESS])

    // error
    wrapper.setProps({
      src: '/error',
    })

    await flushPromises()
    expect(wrapper.emitted('error')?.[0]).toEqual([err])

    // refresh the data so we can test we get the previous cached response
    // first
    res = REFRESHED
    wrapper.setProps({
      src: '/success',
    })

    await flushPromises()
    // cached
    expect(wrapper.emitted('change')?.[1]).toEqual([SUCCESS])
    // refreshed
    expect(wrapper.emitted('change')?.[2]).toEqual([REFRESHED])
  })
})
