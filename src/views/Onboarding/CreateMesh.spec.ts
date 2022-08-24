import { createStore } from 'vuex'
import { render, screen } from '@testing-library/vue'
import { KButton, KTable } from '@kong/kongponents'

import { flushPromises } from '@vue/test-utils'
import CreateMesh from './CreateMesh.vue'

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

  return render(CreateMesh, {
    global: {
      plugins: [store],
      components: {
        KButton,
        KTable,
      },
      stubs: {
        routerLink: {
          props: ['to'],
          template: '<a>{{ to.name }}</a>',
        },
      },
    },
  })
}

describe('CreateMesh.vue', () => {
  it('renders snapshot', async () => {
    const { container } = renderComponent()

    await flushPromises()

    expect(container).toMatchSnapshot()
  })

  it('renders multizone next step', () => {
    renderComponent()

    expect(screen.getByText('onboarding-multi-zone')).toBeInTheDocument()
  })
})
