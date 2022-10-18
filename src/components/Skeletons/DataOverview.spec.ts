import { flushPromises, RouterLinkStub } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'
import { datadogLogs } from '@datadog/browser-logs'
import userEvent from '@testing-library/user-event'
import { KButton, KEmptyState, KIcon, KTable } from '@kong/kongponents'

import DataOverview from './DataOverview.vue'

jest.mock('@datadog/browser-logs')

function renderComponent(props = {}) {
  return render(DataOverview, {
    global: {
      components: {
        KButton,
        KEmptyState,
        KIcon,
        KTable,
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
    },
    props,
    slots: {
      custom: `
        <ul>
          <li>test</li>
        </ul>
      `,
    },
  })
}

describe('DataOverview.vue', () => {
  beforeEach(() => {
    (datadogLogs.logger.info as jest.MockedFunction<any>).mockClear()
  })

  it('renders basic snapshot', () => {
    const { container } = renderComponent({
      tableData: {
        headers: [],
        data: [],
      },
    })

    expect(container).toMatchSnapshot()
  })

  it('renders additional scoped slot', async () => {
    renderComponent({
      tableData: {
        headers: [
          { key: 'custom', hideLabel: true },
        ],
        data: [
          {
            custom: ['custom', 'values', 'in', 'an', 'array'],
          },
        ],
      },
    })

    await flushPromises()

    expect(screen.getByRole('table')).toMatchSnapshot()
  })

  it('renders pagination and react on click', async () => {
    renderComponent({
      next: true,
      tableData: {
        headers: [],
        data: [],
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
    renderComponent({
      next: true,
      tableData: {
        headers: [],
        data: [],
      },
    })

    const next = screen.getByText(/Next/)
    const refresh = screen.getByText(/Refresh/)

    expect(next).toBeInTheDocument()

    await userEvent.click(next)
    await userEvent.click(refresh)

    expect(datadogLogs.logger.info).toMatchSnapshot()
  })

  it('renders all custom templates for data', async () => {
    const { container } = renderComponent({
      showWarnings: true,
      tableData: {
        headers: [
          { key: 'actions', hideLabel: true },
          { label: 'Status', key: 'status' },
          { label: 'Total Updates', key: 'totalUpdates' },
          { label: 'Kuma DP version', key: 'dpVersion' },
          { label: 'Envoy version', key: 'envoyVersion' },
          { key: 'warnings', hideLabel: true },
        ],
        data: [
          {
            status: 'offline',
            totalUpdates: 1,
            dpVersion: 'foo',
            envoyVersion: '1.2',
            withWarnings: true,
          },
        ],
      },
    })

    await flushPromises()

    expect(container).toMatchSnapshot()
  })
})
