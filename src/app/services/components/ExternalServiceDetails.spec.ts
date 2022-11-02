import { shallowMount } from '@vue/test-utils'

import ExternalServiceDetails from './ExternalServiceDetails.vue'
import { createRouter } from '@/router/router'
import { store, storeKey } from '@/store/store'
import { createExternalService } from '@/test-data/createExternalService'

const externalService = createExternalService()

const router = createRouter()

function renderComponent(props = {}) {
  return shallowMount(ExternalServiceDetails, {
    props: {
      externalService,
      ...props,
    },
    global: {
      plugins: [router, [store, storeKey]],
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
