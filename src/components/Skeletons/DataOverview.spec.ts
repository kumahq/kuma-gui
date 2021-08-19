import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import DataOverview from './DataOverview.vue'

jest.mock('@datadog/browser-logs')

describe('DataOverview.vue', () => {
  it('renders basic snapshot', () => {
    const { container } = render(DataOverview, {
      propsData: {
        displayDataTable: true,
        tableData: {
          headers: [],
          data: [],
        },
      },
    })

    expect(container).toMatchSnapshot()
  })

  it('renders pagination and react on click', async () => {
    render(DataOverview, {
      propsData: {
        next: true,
        displayDataTable: true,
        tableData: {
          headers: [],
          data: [],
        },
      },
    })

    const next = screen.getByText(/Next/)

    expect(next).toBeInTheDocument()
    expect(screen.queryByText(/Previous/)).not.toBeInTheDocument()

    await userEvent.click(next)

    const back = screen.queryByText(/Previous/)

    expect(next).toBeInTheDocument()
    expect(back).toBeInTheDocument()

    await userEvent.click(back as HTMLElement)

    expect(next).toBeInTheDocument()
    expect(back).not.toBeInTheDocument()
  })
})
