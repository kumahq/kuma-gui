import { createStore } from 'vuex'
import { RouterLinkStub } from '@vue/test-utils'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import { KButton, KPop, KRadio } from '@kong/kongponents'

import DeploymentTypes from './DeploymentTypes.vue'

function renderComponent() {
  const store = createStore({
    modules: {
      config: {
        namespaced: true,
        state: {
          clientConfig: {
            mode: 'global',
            store: {
              type: 'memory',
            },
          },
        },
        getters: {
          getConfigurationType: (state) => state.clientConfig?.store?.type,
          getMulticlusterStatus: () => true,
        },
      },
    },
  })

  return render(DeploymentTypes, {
    global: {
      plugins: [store],
      components: {
        KButton,
        KPop,
        KRadio,
      },
      stubs: {
        routerLink: RouterLinkStub,
      },
    },
  })
}

describe('DeploymentTypes.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('changes selected graph', async () => {
    renderComponent()

    await userEvent.click(screen.getByText(/Multi-zone deployment/))

    expect(screen.getByTestId('multizone-graph')).toBeInTheDocument()
  })
})
