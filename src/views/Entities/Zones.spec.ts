import { screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import renderWithVuex from '@/testUtils/renderWithVuex'
import Zones from './Zones.vue'

jest.mock('@/helpers', () => {
  const originalModule = jest.requireActual('@/helpers')

  return {
    __esModule: true,
    ...originalModule,
    humanReadableDate: (data: string) => data,
    rawReadableDate: (data: string) => data,
  }
})

describe('Zones.vue', () => {
  it('renders snapshot when no multizone', () => {
    const { container } = renderWithVuex(Zones)

    expect(container).toMatchSnapshot()
  })

  it('renders snapshot when multizone', async () => {
    const { container } = renderWithVuex(Zones, {
      routes: [],
      store: { modules: { config: { state: { clientConfig: { mode: 'global' } } } } },
    })

    await screen.findByText(/cluster-1/)
    await screen.findByText(/dpToken/)

    expect(container).toMatchSnapshot()
  })

  it('renders config of multizone', async () => {
    renderWithVuex(Zones, {
      routes: [],
      store: { modules: { config: { state: { clientConfig: { mode: 'global' } } } } },
    })

    await screen.findByText(/dpToken/)

    await userEvent.click(screen.getByText('Config'))
    expect(await screen.findByText(/adminAccessLogPath/)).toBeInTheDocument()
  })

  it('renders zone insights', async () => {
    renderWithVuex(Zones, {
      routes: [],
      store: { modules: { config: { state: { clientConfig: { mode: 'global' } } } } },
    })

    await screen.findByText(/dpToken/)

    await userEvent.click(screen.getByText(/Zone Insights/))
    expect(screen.getByTestId('tab-container')).toMatchSnapshot()
  })
})
