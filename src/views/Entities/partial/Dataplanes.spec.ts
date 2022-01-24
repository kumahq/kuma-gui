import { screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import renderWithVuex from '@/testUtils/renderWithVuex'
import Kuma from '@/services/kuma'
import Dataplanes from './Dataplanes.vue'

describe('Dataplanes.vue', () => {
  it('renders snapshot', async () => {
    const { container } = renderWithVuex(Dataplanes, {
      mocks: {
        $route: {
          params: {
            mesh: 'all',
          },
          query: {},
        },
      },
      stubs: ['router-link'],
    })

    await screen.findByText(/DataplaneOverview/)

    expect(container).toMatchSnapshot()
  })

  it('calls getDataplanePolicies only when select the tab', async () => {
    jest.spyOn(Kuma, 'getDataplanePolicies')
    renderWithVuex(Dataplanes)

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
