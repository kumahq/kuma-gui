import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import AccordionList from './AccordionList.vue'
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

describe('AccordionList.vue', () => {
  it('renders snapshot at the beginning', () => {
    const { container } = render(AccordionList, options)

    expect(container).toMatchSnapshot()
  })

  it('renders with opened second panel and switch opened panel on click', async () => {
    render(AccordionList, { ...options, props: { initiallyOpen: 1 } })

    expect(screen.queryByText(/Content 1/)).not.toBeInTheDocument()
    expect(screen.getByText(/Content 2/)).toHaveStyle('display: block')

    await userEvent.click(screen.getByText(/Header 1/))

    expect(await screen.findByText(/Content 1/)).toHaveStyle('display: block')
    expect(screen.queryByText(/Content 2/)).not.toBeInTheDocument()
  })

  it('renders initally two opened accordion', async () => {
    render(AccordionList, { ...options, props: { initiallyOpen: [0, 1], multipleOpen: true } })

    expect(screen.getByText(/Content 1/)).toHaveStyle('display: block')
    expect(screen.getByText(/Content 2/)).toHaveStyle('display: block')
  })

  it('renders initally two closed accordions and open it', async () => {
    render(AccordionList, { ...options, props: { multipleOpen: true } })

    expect(screen.queryByText(/Content 1/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Content 2/)).not.toBeInTheDocument()

    await userEvent.click(screen.getByText(/Header 1/))
    await userEvent.click(screen.getByText(/Header 2/))

    expect(await screen.findByText(/Content 1/)).toHaveStyle('display: block')
    expect(await screen.findByText(/Content 2/)).toHaveStyle('display: block')
  })

  it('checks keyboard accessebility', async () => {
    render(AccordionList, { ...options, props: { multipleOpen: true } })

    expect(screen.queryByText(/Content 1/)).not.toBeInTheDocument()

    userEvent.tab()
    expect(screen.queryByText(/Header 1/)).toHaveFocus()

    userEvent.keyboard('[Enter]')

    expect(await screen.findByText(/Content 1/)).toHaveStyle('display: block')
  })
})
