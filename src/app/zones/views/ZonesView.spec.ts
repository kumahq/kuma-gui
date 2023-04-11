import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import ZonesView from './ZonesView.vue'
import { useMock } from '@/../jest/jest-setup-after-env'
import { useStore } from '@/utilities'

function renderComponent() {
  return mount(ZonesView)
}

describe('ZonesView.vue', () => {
  const mock = useMock()
  const store = useStore()
  test('renders snapshot when no multizone', async () => {
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders snapshot when multizone', async () => {
    mock('/zones+insights', {
      KUMA_ZONE_COUNT: '4',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'cluster-1',
            },
            {
              name: 'zone-1',
            },
            {
              name: 'zone-2',
            },
            {
              name: 'zone-3',
            },
          ],
        },
      })
    })
    mock('/config', {}, (merge) => {
      return merge({
        body: {
          mode: 'global',
        },
      })
    })
    await store.dispatch('bootstrap')
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.html()).toContain('cluster-1')
    expect(wrapper.html()).toContain('dpToken')

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders config of multizone', async () => {
    mock('/zones+insights', {
      KUMA_ZONE_COUNT: '4',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'cluster-1',
            },
            {
              name: 'zone-1',
            },
            {
              name: 'zone-2',
            },
            {
              name: 'zone-3',
            },
          ],
        },
      })
    })
    mock('/config', {}, (merge) => {
      return merge({
        body: {
          mode: 'global',
        },
      })
    })
    await store.dispatch('bootstrap')
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.html()).toContain('dpToken')

    await wrapper.find('#config-tab').trigger('click')
    expect(wrapper.html()).toContain('adminAccessLogPath')
  })

  test('renders zone insights', async () => {
    mock('/zones+insights', {
      KUMA_ZONE_COUNT: '4',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'cluster-1',
            },
            {
              name: 'zone-1',
            },
            {
              name: 'zone-2',
            },
            {
              name: 'zone-3',
            },
          ],
        },
      })
    })
    mock('/config', {}, (merge) => {
      return merge({
        body: {
          mode: 'global',
        },
      })
    })
    await store.dispatch('bootstrap')
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.html()).toContain('dpToken')

    await wrapper.find('#insights-tab').trigger('click')
    expect(wrapper.find('[data-testid="tab-container"]').element).toMatchSnapshot()
  })
})
