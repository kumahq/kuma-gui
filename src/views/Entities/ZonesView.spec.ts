import { screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import ZonesView from './ZonesView.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

jest.mock('@/helpers', () => {
  const originalModule = jest.requireActual('@/helpers')

  return {
    __esModule: true,
    ...originalModule,
    humanReadableDate: (data: string) => data,
    rawReadableDate: (data: string) => data,
  }
})

describe('ZonesView.vue', () => {
  it('renders snapshot when no multizone', () => {
    const { container } = renderWithVuex(ZonesView)

    expect(container).toMatchSnapshot()
  })

  it('renders snapshot when multizone', async () => {
    const { container } = renderWithVuex(ZonesView, {
      routes: [],
      store: { modules: { config: { state: { clientConfig: { mode: 'global' } } } } },
    })

    await screen.findByText(/cluster-1/)
    await screen.findByText(/dpToken/)

    expect(container).toMatchSnapshot()
  })

  it('renders config of multizone', async () => {
    renderWithVuex(ZonesView, {
      routes: [],
      store: { modules: { config: { state: { clientConfig: { mode: 'global' } } } } },
    })

    await screen.findByText(/dpToken/)

    await userEvent.click(screen.getByText('Config'))
    expect(await screen.findByText(/adminAccessLogPath/)).toBeInTheDocument()
  })

  it('renders zone insights', async () => {
    renderWithVuex(ZonesView, {
      routes: [],
      store: { modules: { config: { state: { clientConfig: { mode: 'global' } } } } },
    })

    await screen.findByText(/dpToken/)

    await userEvent.click(screen.getByText(/Zone Insights/))
    expect(screen.getByTestId('tab-container')).toMatchSnapshot()
  })
})
