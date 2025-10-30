import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import DataSource from './DataSource.vue'

describe('DataSource', () => {
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
    // change
    const wrapper = mount(DataSource, {
      props: {
        src: 'data:application/json,"one"',
      },
    })

    await flushPromises()
    expect(wrapper.emitted('change')?.[0][0]).toEqual('one')

    wrapper.setProps({
      src: 'data:application/json,"two"',
    })

    await flushPromises()
    expect(wrapper.emitted('change')?.[1][0]).toEqual('two')

    wrapper.setProps({
      src: 'data:application/json,"one"',
    })

    await flushPromises()
    // this time we get two
    // the first one comes from the cache
    expect(wrapper.emitted('change')?.[2][0]).toEqual('one')
    //  and this is the fresh uncached call
    expect(wrapper.emitted('change')?.[3][0]).toEqual('one')

    wrapper.setProps({
      src: 'data:application/json,try with unparsable json',
    })

    await flushPromises()
    const error = wrapper.emitted('error')?.[0][0]
    expect(error instanceof Error && error.message).toContain('is not valid JSON')
  })
})
