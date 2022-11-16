import { DOMWrapper, flushPromises, mount, VueWrapper } from '@vue/test-utils'

import Mesh from './Mesh.vue'
import { store } from '@/store/store'
import { ClientConfigInterface } from '@/store/modules/config/config.types'
import * as config from '@/api/mock-data/config.json'

function renderComponent(mode = 'standalone') {
  store.state.config.tagline = import.meta.env.VITE_NAMESPACE
  store.state.config.kumaDocsVersion = '1.2.0'
  const clientConfig: ClientConfigInterface = { ...config, mode }
  store.state.config.clientConfig = clientConfig

  return mount(Mesh)
}

async function doStep(wrapper: VueWrapper<any>, nextButton: DOMWrapper<any>, enabledTestId: string, testIds: string[]): Promise<void> {
  expect(nextButton.attributes('disabled')).toBe(undefined)

  const enabledRadioButton = wrapper.find<HTMLInputElement>(`[data-testid="${enabledTestId}"]`)
  enabledRadioButton.element.checked = true
  await enabledRadioButton.trigger('change')
  await flushPromises()

  expect(nextButton.attributes('disabled')).toBe('')

  for (const testId of testIds) {
    await wrapper.find(`[data-testid="${testId}"]`).setValue('fake-name')
  }

  expect(nextButton.attributes('disabled')).toBe(undefined)

  await nextButton.trigger('click')
}

describe('Mesh.vue', () => {
  it('passes whole wizzard and render yaml', async () => {
    const wrapper = renderComponent('global')

    const nextButton = wrapper.find('[data-testid="next-step-button"]')
    expect(nextButton.attributes('disabled')).toBe('')

    await wrapper.find('[data-testid="mesh-name"]').setValue('default')

    // 1 step
    await doStep(wrapper, nextButton, 'mesh-mtls-enabled', ['mesh-certificate-name'])

    // 2 Step
    await doStep(wrapper, nextButton, 'mesh-logging-enabled', ['mesh-logging-backend-name'])

    // 3 Step
    await doStep(wrapper, nextButton, 'mesh-tracing-enabled', ['mesh-tracing-backend-name', 'mesh-tracing-url'])

    // 4 Step
    await doStep(wrapper, nextButton, 'mesh-metrics-enabled', ['mesh-metrics-backend-name'])

    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()

    // test that the cli command is correct depending
    // on which tab you clicked
    const kubeTab = wrapper.find('#kubernetes-tab a')
    const uniCode = wrapper.find('[data-testid="universal"]')
    expect(uniCode.html()).toContain('kumactl')

    await kubeTab.trigger('click')

    const kubeCode = wrapper.find('[data-testid="kubernetes"]')
    expect(kubeCode.html()).toContain('kubectl')
  })
})
