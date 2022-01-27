import { screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import renderWithVuex from '@/testUtils/renderWithVuex'
import ZoneEgresses from './ZoneEgresses.vue'

jest.mock('@/helpers', () => {
  const originalModule = jest.requireActual('@/helpers')

  return {
    __esModule: true,
    ...originalModule,
    humanReadableDate: (data: string) => data,
    rawReadableDate: (data: string) => data,
  }
})

describe('ZoneEgresses.vue', () => {
  it('renders snapshot when no multizone', () => {
    const { container } = renderWithVuex(ZoneEgresses, { routes: [] })

    expect(container).toMatchSnapshot()
  })

  it('renders snapshot when multizone', async () => {
    const { container } = renderWithVuex(ZoneEgresses, {
      routes: [],
      store: { modules: { config: { state: { clientConfig: { mode: 'global' } } } } },
    })

    await screen.findByText(/ZoneEgressOverview/)

    expect(container).toMatchSnapshot()
  })

  it('renders zoneegress insights', async () => {
    renderWithVuex(ZoneEgresses, {
      routes: [],
      store: { modules: { config: { state: { clientConfig: { mode: 'global' } } } } },
    })

    await screen.findByText(/ZoneEgressOverview/)

    await userEvent.click(screen.getByText(/Zone Egress Insights/))
    expect(screen.getByTestId('tab-container')).toMatchSnapshot()
  })
})
