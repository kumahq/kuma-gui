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

    expect(screen.getByText(/Content 1/)).toHaveStyle('display: none')
    expect(screen.getByText(/Content 2/)).toHaveStyle('display: block')

    await userEvent.click(screen.getByText(/Header 1/))

    expect(screen.getByText(/Content 1/)).toHaveStyle('display: block')
    expect(screen.getByText(/Content 2/)).toHaveStyle('display: none')
  })

  it('renders initally two opened accordion', async () => {
    render(Accordion, { ...options, props: { initiallyOpen: [0, 1], multipleOpen: true } })

    expect(screen.getByText(/Content 1/)).toHaveStyle('display: block')
    expect(screen.getByText(/Content 2/)).toHaveStyle('display: block')
  })

  it('renders initally two closed accordions and open it', async () => {
    render(Accordion, { ...options, props: { multipleOpen: true } })

    expect(screen.getByText(/Content 1/)).toHaveStyle('display: none')
    expect(screen.getByText(/Content 2/)).toHaveStyle('display: none')

    await userEvent.click(screen.getByText(/Header 1/))
    await userEvent.click(screen.getByText(/Header 2/))

    expect(screen.getByText(/Content 1/)).toHaveStyle('display: block')
    expect(screen.getByText(/Content 2/)).toHaveStyle('display: block')
  })
})
