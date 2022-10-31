import { RouterLinkStub } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'
import { KButton, KTable } from '@kong/kongponents'

import DataplanesOverview from './DataplanesOverview.vue'

describe('DataplanesOverview.vue', () => {
  it('renders snapshot', async () => {
    const { container } = render(DataplanesOverview, {
      global: {
        components: {
          KButton,
          KTable,
        },
        stubs: {
          routerLink: RouterLinkStub,
        },
      },
    })

    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.getByText(/Waiting for DPPs/)).toBeInTheDocument()
    expect(screen.getByText(/Next/).closest('a')).toHaveAttribute('disabled')

    await screen.findByText(/dataplane-test-456/)

    expect(container).toMatchSnapshot()
  })
})
