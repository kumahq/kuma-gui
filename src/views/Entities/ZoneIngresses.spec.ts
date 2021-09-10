import { screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import renderWithVuex from '@/testUtils/renderWithVuex'
import ZoneIngresses from './ZoneIngresses.vue'

jest.mock('@/helpers', () => {
  const originalModule = jest.requireActual('@/helpers')

  return {
    __esModule: true,
    ...originalModule,
    rawReadableDate: (data: string) => data,
  }
})

describe('ZoneIngresses.vue', () => {
  it('renders snapshot when no multizone', () => {
    const { container } = renderWithVuex(ZoneIngresses)

    expect(container).toMatchSnapshot()
  })

  it('renders snapshot when multizone', async () => {
    const { container } = renderWithVuex(ZoneIngresses, {
      store: { modules: { config: { state: { clientConfig: { mode: 'global' } } } } },
    })

    await screen.findByText(/zone-1/)

    expect(container).toMatchSnapshot()
  })

  it('renders zoneingress insights', async () => {
    renderWithVuex(ZoneIngresses, {
      store: { modules: { config: { state: { clientConfig: { mode: 'global' } } } } },
    })

    await screen.findByText(/ZoneIngressOverview/)

    await userEvent.click(screen.getByText(/Zone Ingress Insights/))
    expect(screen.getByTestId('tab-container')).toMatchSnapshot()
  })
})
