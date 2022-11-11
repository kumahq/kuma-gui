import { flushPromises, mount } from '@vue/test-utils'

import ZonesView from './ZonesView.vue'
import { store } from '@/store/store'
import { ClientConfigInterface } from '@/store/modules/config/config.types'
import * as config from '@/api/mock-data/config.json'

function renderComponent(mode = 'standalone') {
  const clientConfig: ClientConfigInterface = { ...config, mode }
  store.state.config.clientConfig = clientConfig

  return mount(ZonesView)
}

describe('ZonesView.vue', () => {
  it('renders snapshot when no multizone', async () => {
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders snapshot when multizone', async () => {
    const wrapper = renderComponent('global')

    await flushPromises()

    expect(wrapper.html()).toContain('cluster-1')
    expect(wrapper.html()).toContain('dpToken')

    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders config of multizone', async () => {
    const wrapper = renderComponent('global')

    await flushPromises()

    expect(wrapper.html()).toContain('dpToken')

    await wrapper.find('#config-tab').trigger('click')
    expect(wrapper.html()).toContain('adminAccessLogPath')
  })

  it('renders zone insights', async () => {
    const wrapper = renderComponent('global')

    await flushPromises()

    expect(wrapper.html()).toContain('dpToken')

    await wrapper.find('#insights-tab').trigger('click')
    expect(wrapper.find('[data-testid="tab-container"]').element).toMatchSnapshot()
  })
})
