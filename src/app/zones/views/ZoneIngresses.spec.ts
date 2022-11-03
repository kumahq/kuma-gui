import { flushPromises } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

import ZoneIngresses from './ZoneIngresses.vue'
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

  return render(ZoneIngresses, {
    global: {
      plugins: [[store, storeKey]],
    },
  })
}

describe('ZoneIngresses.vue', () => {
  it('renders snapshot when no multizone', async () => {
    const { container } = renderComponent()

    await flushPromises()

    expect(container).toMatchSnapshot()
  })

  it('renders snapshot when multizone', async () => {
    const { container } = renderComponent('global')

    await flushPromises()

    await screen.findByText(/ZoneIngressOverview/)

    expect(container).toMatchSnapshot()
  })

  it('renders zoneingress insights', async () => {
    renderComponent('global')

    await screen.findByText(/ZoneIngressOverview/)

    await userEvent.click(screen.getByText(/Zone Ingress Insights/))
    expect(screen.getByTestId('tab-container')).toMatchSnapshot()
  })
})
