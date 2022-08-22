import { createStore } from 'vuex'
import { RouterLinkStub } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { KButton } from '@kong/kongponents'

import AddNewServices from './AddNewServices.vue'

function renderComponent() {
  const store = createStore({
    modules: {
      onboarding: {
        namespaced: true,
        state: {
          mode: 'demo',
        },
        getters: {
          getMode: (state) => state.mode,
        },
        mutations: {
          UPDATE_MODE: (state, mode) => {
            state.mode = mode
          },
        },
      },
    },
  })

  return render(AddNewServices, {
    global: {
      plugins: [store],
      components: {
        KButton,
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
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
