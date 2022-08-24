import { createStore } from 'vuex'
import { RouterLinkStub } from '@vue/test-utils'
import { render } from '@testing-library/vue'
import { KButton, KIcon } from '@kong/kongponents'

import WelcomeView from './WelcomeView.vue'

function renderComponent(environment: string) {
  const store = createStore({
    modules: {
      config: {
        namespaced: true,
        state: {
          tagline: 'Kuma',
          clientConfig: {
            mode: 'global',
            environment,
          },
        },
        getters: {
          getTagline: (state) => state.tagline,
          getEnvironment: (state) => state.clientConfig?.environment,
          getMulticlusterStatus: () => false,
        },
      },
    },
  })

  return render(WelcomeView, {
    global: {
      plugins: [store],
      components: {
        KButton,
        KIcon,
      },
      stubs: {
        routerLink: RouterLinkStub,
      },
    }
  })
}

describe('WelcomeView.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderComponent('universal')

    expect(container).toMatchSnapshot()
  })

  it('renders Kubernetess', () => {
    const { getByText } = renderComponent('kubernetess')

    expect(getByText(/Kubernetess/)).toBeInTheDocument()
  })
})
