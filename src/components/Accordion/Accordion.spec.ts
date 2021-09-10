import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import Accordion from './Accordion.vue'
import AccordionItem from './AccordionItem.vue'

const options = {
  slots: {
    default: [
      `
    <AccordionItem>
      <template slot="accordion-header">
        Header 1
      </template>

      <template slot="accordion-content">
        Content 1
      </template>

    </AccordionItem>
    `,
      `
    <AccordionItem>
      <template slot="accordion-header">
        Header 2
      </template>

      <template slot="accordion-content">
        Content 2
      </template>

    </AccordionItem>
    `,
    ],
  },
  stubs: {
    // used to register custom components
    AccordionItem,
  },
}

describe('Accordion.vue', () => {
  it('renders snapshot at the beginning', () => {
    const { container } = render(Accordion, options)

    expect(container).toMatchSnapshot()
  })

  it('renders with opened second panel and switch opened panel on click', async () => {
    render(Accordion, { ...options, props: { initiallyOpen: 1 } })

    expect(screen.getByText(/Content 1/).parentNode).toHaveStyle('display: none')
    expect(screen.getByText(/Content 2/).parentNode).toHaveStyle('display: block')

    await userEvent.click(screen.getByText(/Header 1/))

    expect(screen.getByText(/Content 1/).parentNode).toHaveStyle('display: block')
    expect(screen.getByText(/Content 2/).parentNode).toHaveStyle('display: none')
  })
})
