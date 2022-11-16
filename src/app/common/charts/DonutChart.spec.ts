import { afterEach, describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import DonutChart from './DonutChart.vue'

function renderComponent() {
  return mount(DonutChart, {
    // This is necessary to correctly suppress the amcharts “Chart was not disposed” warning. Its detection logic relies on finding an elements root node which is only possible if the element is actually in the DOM.
    attachTo: document.body,
    props: {
      data: [
        {
          value: 1,
          category: 'ca-1',
        },
      ],
      title: 'DonutChart',
    },
  })
}

describe('DonutChart.vue', () => {
  afterEach(() => {
    // Clears `document.body` because we mount the component using `attachTo: document.body`.
    document.body.innerHTML = ''
  })

  test('renders chart', async () => {
    const wrapper = renderComponent()

    await flushPromises()
    await flushPromises()

    expect(wrapper.html()).toContain('ca-1')
  })
})
