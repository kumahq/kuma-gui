import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

import AddNewServices from './AddNewServices.vue'
import { createRouter } from '@/router/router'
import { store, storeKey } from '@/store/store'

const router = createRouter()

function renderComponent() {
  return render(AddNewServices, {
    global: {
      plugins: [router, [store, storeKey]],
    },
  })
}

describe('AddNewServices.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('changes selected box', async () => {
    renderComponent()

    const demoRadio = screen.getAllByTestId('box')[0]
    const manuallyRadio = screen.getAllByTestId('box')[1]

    expect(demoRadio.className).toMatch('box--active')
    expect(manuallyRadio.className).not.toMatch('box--active')

    await userEvent.click(screen.getByText(/After this wizard/))

    expect(demoRadio.className).not.toMatch('box--active')

    expect(manuallyRadio.className).toMatch('box--active')
  })
})
