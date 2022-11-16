import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import TabsWidget from './TabsWidget.vue'

function renderComponent(props: any) {
  return mount(TabsWidget, {
    props,
    slots: {
      universal: '<div>Universal</div>',
      kubernetes: '<div>Kubernetes</div>',
    },
  })
}

describe('TabsWidget.vue', () => {
  test('renders basic snapshot', () => {
    const wrapper = renderComponent({
      tabs: [
        {
          hash: '#universal',
          title: 'Universal',
        },
        {
          hash: '#kubernetes',
          title: 'Kubernetes',
        },
      ],
    })

    expect(wrapper.find('#panel-0').html()).toContain('Universal')
    expect(wrapper.find('#panel-1').html()).not.toContain('Kubernetes')
    expect(wrapper.element).toMatchSnapshot()
  })

  test('switches tabs on click', async () => {
    const wrapper = renderComponent({
      tabs: [
        {
          hash: '#universal',
          title: 'Universal',
        },
        {
          hash: '#kubernetes',
          title: 'Kubernetes',
        },
      ],
    })

    await wrapper.find('#kubernetes-tab').trigger('click')

    expect(wrapper.find('#panel-0').html()).not.toContain('Universal')
    expect(wrapper.find('#panel-1').html()).toContain('Kubernetes')
  })

  test('renders with initally selected tab', () => {
    const wrapper = renderComponent({
      tabs: [
        {
          hash: '#universal',
          title: 'Universal',
        },
        {
          hash: '#kubernetes',
          title: 'Kubernetes',
        },
      ],
      initialTabOverride: 'kubernetes',
    })

    expect(wrapper.find('#panel-0').html()).not.toContain('Universal')
    expect(wrapper.find('#panel-1').html()).toContain('Kubernetes')
  })
})
