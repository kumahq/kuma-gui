import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { datadogLogs } from '@datadog/browser-logs'
import { KButton } from '@kong/kongponents'

import PaginationWidget from './PaginationWidget.vue'

jest.mock('@datadog/browser-logs')

function renderComponent(props = {}) {
  return render(PaginationWidget, {
    global: {
      components: {
        KButton,
      },
    },
    props,
  })
}

describe('PaginationWidget.vue', () => {
  it('renders nothing if no next or prev props provided', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('renders pagination', () => {
    const { container } = renderComponent({
      hasPrevious: true,
      hasNext: true,
    })

    expect(container).toMatchSnapshot()
  })

  it('calls buttons', async () => {
    renderComponent({
      hasPrevious: true,
      hasNext: true,
    })

    await userEvent.click(screen.getByText(/Previous/))
    await userEvent.click(screen.getByText(/Next/))
    expect(datadogLogs.logger.info).toMatchSnapshot()
  })
})
