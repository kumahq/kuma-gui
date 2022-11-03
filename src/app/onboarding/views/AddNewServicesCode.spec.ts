import { flushPromises } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'

import AddNewServicesCode from './AddNewServicesCode.vue'
import { kumaApi } from '@/api/kumaApi'
import { store, storeKey } from '@/store/store'

function renderComponent() {
  return render(AddNewServicesCode, {
    global: {
      plugins: [[store, storeKey]],
    },
  })
}

describe('AddNewServicesCode.vue', () => {
  it('renders snapshot', async () => {
    const { container } = renderComponent()

    await flushPromises()

    expect(container).toMatchSnapshot()
  })

  it('detects resources on call and allow to proceed', async () => {
    renderComponent()

    expect(await screen.findByTestId('dpps-connected')).toBeInTheDocument()
    expect(screen.queryByText(/Next/)).toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  it('refetch resources if any not available', async () => {
    jest
      .spyOn(kumaApi, 'getAllDataplanes')
      .mockResolvedValueOnce({
        total: 0,
      })
      .mockResolvedValueOnce({
        total: 1,
      })

    renderComponent()

    expect(screen.queryByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByTestId('dpps-disconnected')).toBeInTheDocument()

    await flushPromises()

    expect(await screen.findByTestId('dpps-connected')).toBeInTheDocument()
    expect(kumaApi.getAllDataplanes).toHaveBeenCalledTimes(2)
  })
})
