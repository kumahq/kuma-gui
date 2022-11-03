import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

import ZonesView from './ZonesView.vue'
import { store, storeKey } from '@/store/store'
import { ClientConfigInterface } from '@/store/modules/config/config.types'
import * as config from '@/api/mock-data/config.json'

jest.mock('@/utilities/helpers', () => {
  const originalModule = jest.requireActual('@/utilities/helpers')

  return {
    __esModule: true,
    ...originalModule,
    humanReadableDate: (data: string) => data,
    rawReadableDate: (data: string) => data,
  }
})

function renderComponent(mode = 'standalone') {
  const clientConfig: ClientConfigInterface = { ...config, mode }
  store.state.config.clientConfig = clientConfig

  return render(ZonesView, {
    global: {
      plugins: [[store, storeKey]],
    },
  })
}

describe('ZonesView.vue', () => {
  it('renders snapshot when no multizone', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('renders snapshot when multizone', async () => {
    const { container } = renderComponent('global')

    await screen.findByText(/cluster-1/)
    await screen.findByText(/dpToken/)

    expect(container).toMatchSnapshot()
  })

  it('renders config of multizone', async () => {
    renderComponent('global')

    await screen.findByText(/dpToken/)

    await userEvent.click(screen.getByText('Config'))
    expect(await screen.findByText(/adminAccessLogPath/)).toBeInTheDocument()
  })

  it('renders zone insights', async () => {
    renderComponent('global')

    await screen.findByText(/dpToken/)

    await userEvent.click(screen.getByText(/Zone Insights/))
    expect(screen.getByTestId('tab-container')).toMatchSnapshot()
  })
})
