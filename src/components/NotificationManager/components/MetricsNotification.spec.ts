import { createStore } from 'vuex'
import { render } from '@testing-library/vue'

import MetricsNotification from './MetricsNotification.vue'

describe('MetricsNotification.vue', () => {
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

    const { container } = render(MetricsNotification, {
      global: {
        plugins: [store],
      },
    })

    expect(container).toMatchSnapshot()
  })
})
