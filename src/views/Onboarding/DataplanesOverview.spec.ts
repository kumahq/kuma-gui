import renderWithVuex from '@/testUtils/renderWithVuex'
import { screen } from '@testing-library/vue'
import DataplanesOverview from './DataplanesOverview.vue'

describe('DataplanesOverview.vue', () => {
  // TODO before merge remove skip
  xit('renders snapshot', async () => {
    const { container } = renderWithVuex(DataplanesOverview, { routes: [] })

    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.getByText(/Waiting for DPPs/)).toBeInTheDocument()
    expect(screen.queryByText(/Next/)).not.toBeInTheDocument()

    await screen.findByText(/dataplane-test-456/)

    expect(container).toMatchSnapshot()
  })
})
