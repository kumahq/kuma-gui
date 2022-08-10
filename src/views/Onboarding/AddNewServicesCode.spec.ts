import { screen } from '@testing-library/vue'

import AddNewServicesCode from './AddNewServicesCode.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'
import Kuma from '@/services/kuma'

describe('AddNewServicesCode.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(AddNewServicesCode)

    expect(container).toMatchSnapshot()
  })

  it('detects resources on call and allow to proceed', async () => {
    renderWithVuex(AddNewServicesCode, {
      routes: [],
    })

    expect(await screen.findByTestId('dpps-connected')).toBeInTheDocument()
    expect(screen.queryByText(/Next/)).toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  it('refetch resources if any not available', async () => {
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

    renderWithVuex(AddNewServicesCode, {
      routes: [],
    })

    expect(screen.queryByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByTestId('dpps-disconnected')).toBeInTheDocument()

    // Advance asynchronous routines by making sure the queue of micro tasks is processed.
    // TODO: In @vue/test-utils@2, use `flushPromises` instead.
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(await screen.findByTestId('dpps-connected')).toBeInTheDocument()
    expect(Kuma.getAllDataplanes).toHaveBeenCalledTimes(2)
  })
})
