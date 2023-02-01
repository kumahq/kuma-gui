import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import PolicyTypeEntryList from './PolicyTypeEntryList.vue'
import { store } from '@/store/store'
import { createPolicyTypeEntries } from '@/test-data/createPolicyTypeEntries'

const policyTypeEntries = createPolicyTypeEntries()

async function renderComponent(props = {}) {
  await store.dispatch('fetchPolicyTypes')
  return mount(PolicyTypeEntryList, {
    props: {
      policyTypeEntries,
      ...props,
    },
  })
}

describe('PolicyTypeEntryList', () => {
  test('works', async () => {
    const wrapper = await renderComponent()

    const expectedStrings = ['MeshAccessLog', 'MeshTrace', 'MeshTrafficPermission']

    const html = wrapper.html()
    for (const string of expectedStrings) {
      expect(html).toContain(string)
    }

    await wrapper.findAll('[data-testid="accordion-item-button"]')[2].trigger('click')

    const expectedTableStrings = ['backend', '192.168.0.1:80', 'mtp-1', 'mtp-2']

    const policyTypeEntry = wrapper.find('[data-testid="accordion-item-content"]')
    const policyTypeEntryHtml = policyTypeEntry.html()
    for (const string of expectedTableStrings) {
      expect(policyTypeEntryHtml).toContain(string)
    }
  })
})
