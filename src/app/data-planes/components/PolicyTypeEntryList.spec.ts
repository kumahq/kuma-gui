import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import PolicyTypeEntryList from './PolicyTypeEntryList.vue'
import { createPolicyTypeEntries } from '@/test-data/createPolicyTypeEntries'

const policyTypeEntries = createPolicyTypeEntries()

function renderComponent(props = {}) {
  return mount(PolicyTypeEntryList, {
    props: {
      policyTypeEntries,
      ...props,
    },
  })
}

describe('PolicyTypeEntryList', () => {
  test('works', async () => {
    const wrapper = renderComponent()

    const expectedStrings = ['MeshAccessLog', 'MeshTrace', 'MeshTrafficPermission']

    const html = wrapper.html()
    for (const string of expectedStrings) {
      expect(html).toContain(string)
    }

    await wrapper.findAll('[data-testid="accordion-item-button"]')[2].trigger('click')
    await flushPromises()

    const expectedTableStrings = ['backend', '192.168.0.1:80', 'mtp-1', 'mtp-2']

    const policyTypeEntry = wrapper.find('[data-testid="accordion-item-content"]')
    const policyTypeEntryHtml = policyTypeEntry.html()
    for (const string of expectedTableStrings) {
      expect(policyTypeEntryHtml).toContain(string)
    }
  })
})
