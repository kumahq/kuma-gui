import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import FilterBar from './FilterBar.vue'

const FIELDS = {
  name: { description: 'filter by name or parts of a name' },
  protocol: { description: 'filter by protocol' },
  tag: { description: 'filter by tags' },
}

function renderComponent(props = {}) {
  return mount(FilterBar as any, {
    props: {
      fields: FIELDS,
      ...props,
    },
  })
}

describe('FilterBar', () => {
  test('has the right default content', async () => {
    const wrapper = renderComponent({ id: 'filter-bar' })

    expect(wrapper.find('[data-testid="filter-bar-focus-filter-input-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="filter-bar-suggestion-box"]').exists()).toBe(false)

    const input = wrapper.find<HTMLInputElement>('[data-testid="filter-bar-filter-input"]')
    expect(input.attributes('placeholder')).toBe('Filter by name, protocol, tag')

    await input.trigger('focus')

    expect(wrapper.find('[data-testid="filter-bar-suggestion-box"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="filter-bar-submit-query-button"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="filter-bar-apply-suggestion-button"]').length).toBe(3)
  })

  test('emits expected “fields-change” event when submitting queries', async () => {
    const wrapper = renderComponent({ id: 'filter-bar' })

    const input = wrapper.find<HTMLInputElement>('[data-testid="filter-bar-filter-input"]')

    const expectedEventData1 = {
      fields: [['name', 'test']],
      query: 'name: test',
    }
    await input.setValue('name: test')
    await input.trigger('keydown.enter')

    const events1 = wrapper.emitted('fields-change') as any[][]
    expect(events1.length).toBe(1)
    expect(events1[events1.length - 1][0]).toEqual(expectedEventData1)

    const expectedEventData2 = {
      fields: [['name', 'quoted valued'], ['protocol', 'http']],
      query: 'name: "quoted valued" protocol: http',
    }
    await input.setValue('name: "quoted valued" protocol: http')
    await input.trigger('keydown.enter')

    const events2 = wrapper.emitted('fields-change') as any[][]
    expect(events2.length).toBe(2)
    expect(events2[events2.length - 1][0]).toEqual(expectedEventData2)

    // Assesses that no superfluous events are emitted when entering a syntactically different but semantically identical value.
    await input.setValue('protocol:http name:"quoted valued"')
    await input.trigger('keydown.enter')
    const events3 = wrapper.emitted('fields-change') as any[][]
    expect(events3.length).toBe(2)
  })
})
