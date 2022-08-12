import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/vue'
import DeploymentTypes from './DeploymentTypes.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

describe('DeploymentTypes.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(DeploymentTypes, {
      routes: [],
    })

    expect(container).toMatchSnapshot()
  })

  it('changes selected graph', async () => {
    renderWithVuex(DeploymentTypes, { routes: [] })

    await userEvent.click(screen.getByText(/Multi-zone deployment/))

    expect(screen.getByTestId('multizone-graph')).toBeInTheDocument()
  })
})
