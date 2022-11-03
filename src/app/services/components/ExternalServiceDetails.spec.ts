import { shallowMount } from '@vue/test-utils'

import ExternalServiceDetails from './ExternalServiceDetails.vue'
import { store, storeKey } from '@/store/store'
import { createExternalService } from '@/test-data/createExternalService'

const externalService = createExternalService()

function renderComponent(props = {}) {
  return shallowMount(ExternalServiceDetails, {
    props: {
      externalService,
      ...props,
    },
    global: {
      plugins: [[store, storeKey]],
    },
  })
}

describe('ExternalServiceDetails', () => {
  test('shows correct content', async () => {
    const wrapper = renderComponent()

    const html = wrapper.html()
    expect(html).toContain('httpbin.org:80')
    expect(html).toContain('Enabled')
  })
})
