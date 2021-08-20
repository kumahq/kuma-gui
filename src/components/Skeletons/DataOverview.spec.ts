import { render, screen } from '@testing-library/vue'
import { datadogLogs } from '@datadog/browser-logs'
import userEvent from '@testing-library/user-event'
import DataOverview from './DataOverview.vue'

jest.mock('@datadog/browser-logs')

describe('DataOverview.vue', () => {
  beforeEach(() => {
    ;(datadogLogs.logger.info as jest.MockedFunction<any>).mockClear()
  })
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

  it('refresh page on second page', async () => {
    const { emitted } = render(DataOverview, {
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
    const refresh = screen.getByText(/Refresh/)

    expect(next).toBeInTheDocument()

    await userEvent.click(next)
    await userEvent.click(refresh)

    expect(emitted()).toMatchSnapshot()
    expect(datadogLogs.logger.info).toMatchSnapshot()
  })
})
