import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import AccordionItem from './AccordionItem.vue'
import AccordionList from './AccordionList.vue'

function renderComponent(props = {}) {
  return mount(AccordionList as any, {
    global: {
      stubs: {
        AccordionItem,
      },
    },
    slots: {
      default: [
        `
          <AccordionItem>
            <template #accordion-header>
              Header 1
            </template>

            <template #accordion-content>
              Content 1
            </template>
          </AccordionItem>
        `,
        `
          <AccordionItem>
            <template #accordion-header>
              Header 2
            </template>

            <template #accordion-content>
              Content 2
            </template>
          </AccordionItem>
        `,
      ],
    },
    props,
  })
}

describe('AccordionList.vue', () => {
  test('renders snapshot at the beginning', () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders with opened second panel and switch opened panel on click', async () => {
    const wrapper = renderComponent({ initiallyOpen: 1 })

    expect(wrapper.find('[data-testid="accordion-item-content"]').html()).toContain('Content 2')

    const button = wrapper.find('[data-testid="accordion-item-button"]')
    expect(button.html()).toContain('Header 1')
    await button.trigger('click')

    expect(wrapper.find('[data-testid="accordion-item-content"]').html()).toContain('Content 1')
  })

  test('renders initally two opened accordion', async () => {
    const wrapper = renderComponent({
      initiallyOpen: [0, 1],
      multipleOpen: true,
    })

    expect(wrapper.findAll('[data-testid="accordion-item-content"]').length).toBe(2)
  })

  test('renders initally two closed accordions and open it', async () => {
    const wrapper = renderComponent({ multipleOpen: true })

    expect(wrapper.findAll('[data-testid="accordion-item-content"]').length).toBe(0)
    const buttons = wrapper.findAll('[data-testid="accordion-item-button"]')
    for (const button of buttons) {
      await button.trigger('click')
    }

    expect(wrapper.findAll('[data-testid="accordion-item-content"]').length).toBe(2)
  })
})
