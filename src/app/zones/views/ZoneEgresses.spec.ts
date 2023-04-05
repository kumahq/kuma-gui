import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import ZoneEgresses from './ZoneEgresses.vue'
import { useMock } from '@/../jest/jest-setup-after-env'
import { useStore } from '@/utilities'

function renderComponent() {
  return mount(ZoneEgresses)
}

describe('ZoneEgresses.vue', () => {
  const mock = useMock()
  const store = useStore()
  test('renders snapshot when no multizone', async () => {
    mock('/zoneegressoverviews', {
      FAKE_SEED: '1',
      KUMA_ZONEEGRESS_COUNT: '1',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'zoneegress-1',
            },
          ],
        },
      })
    })
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.html()).toContain('ZoneEgressOverview')

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders snapshot when multizone', async () => {
    mock('/zoneegressoverviews', {
      FAKE_SEED: '1',
      KUMA_ZONEEGRESS_COUNT: '1',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'zoneegress-1',
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

    expect(wrapper.html()).toContain('ZoneEgressOverview')

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders zoneegress insights', async () => {
    mock('/zoneegressoverviews', {
      FAKE_SEED: '1',
      KUMA_ZONEEGRESS_COUNT: '1',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'zoneegress-1',
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

    expect(wrapper.html()).toContain('ZoneEgressOverview')

    await wrapper.find('#insights-tab').trigger('click')
    expect(wrapper.find('[data-testid="tab-container"]').element).toMatchSnapshot()
  })
})
