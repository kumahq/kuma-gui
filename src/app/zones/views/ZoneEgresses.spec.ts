import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import ZoneEgresses from './ZoneEgresses.vue'
import { store } from '@/store/store'
import { ClientConfigInterface } from '@/store/modules/config/config.types'
import * as config from '@/api/mock-data/config.json'

function renderComponent(mode = 'standalone') {
  const clientConfig: ClientConfigInterface = { ...config, mode }
  store.state.config.clientConfig = clientConfig

  return mount(ZoneEgresses)
}

describe('ZoneEgresses.vue', () => {
  test('renders snapshot when no multizone', async () => {
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.html()).toContain('ZoneEgressOverview')

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders snapshot when multizone', async () => {
    const wrapper = renderComponent('global')

    await flushPromises()

    expect(wrapper.html()).toContain('ZoneEgressOverview')

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders zoneegress insights', async () => {
    const wrapper = renderComponent('global')

    await flushPromises()

    expect(wrapper.html()).toContain('ZoneEgressOverview')

    await wrapper.find('#insights-tab').trigger('click')
    expect(wrapper.find('[data-testid="tab-container"]').element).toMatchSnapshot()
  })
})
