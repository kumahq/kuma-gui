import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import ZoneIngresses from './ZoneIngresses.vue'
import { useStore } from '@/utilities'
import { ClientConfigInterface } from '@/store/modules/config/config.types'
import * as config from '@/api/mock-data/config.json'

const store = useStore()
function renderComponent(mode = 'standalone') {
  const clientConfig: ClientConfigInterface = { ...config, mode }
  store.state.config.clientConfig = clientConfig

  return mount(ZoneIngresses)
}

describe('ZoneIngresses.vue', () => {
  test('renders snapshot when no multizone', async () => {
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders snapshot when multizone', async () => {
    const wrapper = renderComponent('global')

    await flushPromises()

    expect(wrapper.html()).toContain('ZoneIngressOverview')

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders zoneingress insights', async () => {
    const wrapper = renderComponent('global')

    await flushPromises()

    expect(wrapper.html()).toContain('ZoneIngressOverview')

    await wrapper.find('#insights-tab').trigger('click')
    expect(wrapper.find('[data-testid="tab-container"]').element).toMatchSnapshot()
  })
})
