import { createStore } from 'vuex'
import { render, screen } from '@testing-library/vue'
import { KButton, KPop, KRadio } from '@kong/kongponents'

import ConfigurationTypes from './ConfigurationTypes.vue'

function renderComponent(multizoneStatus: boolean) {
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
          getMulticlusterStatus: () => multizoneStatus,
        },
      },
    },
  })

  return render(ConfigurationTypes, {
    global: {
      plugins: [store],
      components: {
        KButton,
        KPop,
        KRadio,
      },
      stubs: {
        'router-link': {
          props: ['to'],
          template: '<a>{{ to.name }}</a>',
        },
      },
    },
  })
}

describe('ConfigurationTypes.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderComponent(false)

    expect(container).toMatchSnapshot()
  })

  it('renders multizone previous step', () => {
    renderComponent(true)

    expect(screen.getByText('onboarding-multi-zone')).toBeInTheDocument()
  })
})
