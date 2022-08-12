import { screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

import DataplanesView from './DataplanesView.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'
import Kuma from '@/services/kuma'

describe('DataplanesView.vue', () => {
  it('renders snapshot', async () => {
    const { policies } = await Kuma.getPolicies()
    const policiesByType = policies.reduce((obj, policy) => Object.assign(obj, { [policy.name]: policy }), {})

    const { container } = renderWithVuex(DataplanesView, {
      mocks: {
        $route: {
          params: {
            mesh: 'all',
          },
          query: {},
        },
      },
      stubs: ['router-link'],
      store: {
        state: {
          policiesByType,
        },
      },
    })

    await screen.findByText(/DataplaneOverview/)

    expect(container).toMatchSnapshot()
  })

  it('calls getDataplanePolicies only when select the tab', async () => {
    jest.spyOn(Kuma, 'getDataplanePolicies')

    const { policies } = await Kuma.getPolicies()
    const policiesByType = policies.reduce((obj, policy) => Object.assign(obj, { [policy.name]: policy }), {})

    renderWithVuex(DataplanesView, {
      mocks: {
        $route: {
          params: {
            mesh: 'all',
          },
          query: {},
        },
      },
      stubs: ['router-link'],
      store: {
        state: {
          policiesByType,
        },
      },
    })

    await screen.findByText(/DPP: backend/)

    expect(Kuma.getDataplanePolicies).not.toHaveBeenCalled()

    await userEvent.click(screen.getByText(/Policies/))

    await screen.findByText(/192.168.0.1:80:81/)

    expect(Kuma.getDataplanePolicies).toHaveBeenCalledWith({
      mesh: 'default',
      dppName: 'backend',
    })

    await userEvent.click(await screen.findByText(/cluster-1.backend-03/))

    await screen.findByText(/DPP: cluster-1.backend-03/)

    expect(Kuma.getDataplanePolicies).toHaveBeenCalledWith({
      mesh: 'default',
      dppName: 'cluster-1.backend-03',
    })
  })
})
