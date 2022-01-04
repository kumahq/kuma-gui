import renderWithVuex from '@/testUtils/renderWithVuex'
import { screen } from '@testing-library/vue'

import Kuma from '@/services/kuma'
import AddingNewServicesCode from './AddingNewServicesCode.vue'

describe('AddingNewServicesCode.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(AddingNewServicesCode)

    expect(container).toMatchSnapshot()
  })

  it('detects resources on call and allow to proceed', async () => {
    renderWithVuex(AddingNewServicesCode, {
      routes: [],
    })

    expect(await screen.findByTestId('dpps-connected')).toBeInTheDocument()
    expect(screen.queryByText(/Next/)).toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  it('refetch resources if any not available', async () => {
    jest.useFakeTimers()
    jest
      .spyOn(Kuma, 'getAllDataplanes')
      .mockReturnValueOnce({
        // @ts-ignore
        total: 0,
      })
      .mockReturnValueOnce({
        // @ts-ignore
        total: 1,
      })

    renderWithVuex(AddingNewServicesCode, {
      routes: [],
    })

    expect(screen.queryByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByTestId('dpps-disconnected')).toBeInTheDocument()

    jest.runAllTimers()

    expect(await screen.findByTestId('dpps-connected')).toBeInTheDocument()
    expect(Kuma.getAllDataplanes).toHaveBeenCalledTimes(2)
  })
})
