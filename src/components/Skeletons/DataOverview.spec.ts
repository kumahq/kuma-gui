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
        tableData: {
          headers: [],
          data: [],
        },
      },
    })

    expect(container).toMatchSnapshot()
  })

  it('renders additional scoped slot', () => {
    render(DataOverview, {
      propsData: {
        tableData: {
          headers: [{ key: 'custom', hideLabel: true }],
          data: [
            {
              custom: ['custom', 'vaues', 'in', 'an', 'array'],
            },
          ],
        },
      },
      scopedSlots: {
        custom: `
        <ul>
          <li v-for="item in props.rowValue" :key="item">{{item}}</li>
        </ul>
        `,
      },
    })

    expect(screen.getByRole('table')).toMatchSnapshot()
  })

  it('renders pagination and react on click', async () => {
    render(DataOverview, {
      propsData: {
        next: true,
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

  it('renders all custom templates for data', async () => {
    const { container } = render(DataOverview, {
      propsData: {
        showWarnings: true,
        tableData: {
          headers: [
            { key: 'actions', hideLabel: true },
            { label: 'Status', key: 'status' },
            { label: 'Tags', key: 'tags' },
            { label: 'Total Updates', key: 'totalUpdates' },
            { label: 'Kuma DP version', key: 'dpVersion' },
            { label: 'Envoy version', key: 'envoyVersion' },
            { key: 'warnings', hideLabel: true },
          ],
          data: [
            {
              status: 'offline',
              tags: [
                {
                  label: 'env',
                  value: 'dev',
                },
                {
                  label: 'kuma.io/service',
                  value: 'kuma-example-backend',
                },
                {
                  label: 'tag01',
                  value: 'value01',
                },
                {
                  label: 'reallyLongTagLabelHere',
                  value: 'a-really-long-tag-value-here',
                },
              ],
              totalUpdates: 1,
              dpVersion: 'foo',
              envoyVersion: '1.2',
              withWarnings: true,
            },
          ],
        },
      },
    })

    expect(container).toMatchSnapshot()
  })
})
