import { createStore } from 'vuex'
import { render } from '@testing-library/vue'
import { KAlert, KButton } from '@kong/kongponents'

import OnboardingNotification from './OnboardingNotification.vue'

describe('OnboardingNotification.vue', () => {
  it('renders snapshot', () => {
    const store = createStore({
      modules: {
        config: {
          namespaced: true,
          state: {
            kumaDocsVersion: '1.2.0',
          },
          getters: {
            getKumaDocsVersion: (state) => state.kumaDocsVersion,
          },
        },
      },
    })

    const { container } = render(OnboardingNotification, {
      global: {
        plugins: [store],
        components: {
          KAlert,
          KButton,
        },
      },
    })

    expect(container).toMatchSnapshot()
  })
})
