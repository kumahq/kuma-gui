import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import ZoneIngressListView from './ZoneIngressListView.vue'
import { useMock } from '@/../jest/jest-setup-after-env'
import { useStore } from '@/utilities'

function renderComponent() {
  return mount(ZoneIngressListView)
}

describe('ZoneIngressListView', () => {
  const mock = useMock()
  const store = useStore()
  test('renders snapshot when no multizone', async () => {
    mock('/zoneingresses+insights', {
      KUMA_ZONEINGRESS_COUNT: '1',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'zone-ingress-1',
            },
          ],
        },
      })
    })
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders snapshot when multizone', async () => {
    mock('/zoneingresses+insights', {
      KUMA_ZONEINGRESS_COUNT: '1',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'zone-ingress-1',
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

    expect(wrapper.html()).toContain('ZoneIngressOverview')

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders zoneingress insights', async () => {
    mock('/zoneingresses+insights', {
      KUMA_ZONEINGRESS_COUNT: '1',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'zone-ingress-1',
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
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.html()).toContain('ZoneIngressOverview')

    await wrapper.find('#insights-tab').trigger('click')
    expect(wrapper.find('[data-testid="tab-container"]').element).toMatchSnapshot()
  })
})
