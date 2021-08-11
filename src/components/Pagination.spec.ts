import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { datadogLogs } from '@datadog/browser-logs'
import Pagination from './Pagination.vue'

jest.mock('@datadog/browser-logs')

describe('Pagination.vue', () => {
  it('renders nothing if no next or prev props provided', () => {
    const { container } = render(Pagination)

    expect(container).toMatchSnapshot()
  })

  it('renders pagination', () => {
    const { container } = render(Pagination, {
      props: {
        hasPrevious: true,
        hasNext: true,
      },
    })

    expect(container).toMatchSnapshot()
  })

  it('calls buttons', () => {
    const { emitted } = render(Pagination, {
      props: {
        hasPrevious: true,
        hasNext: true,
      },
    })

    userEvent.click(screen.getByText(/Previous/))
    userEvent.click(screen.getByText(/Next/))
    expect(emitted()).toMatchSnapshot()
    expect(datadogLogs.logger.info).toMatchSnapshot()
  })
})
