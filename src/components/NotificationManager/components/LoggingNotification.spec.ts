import { createStore } from 'vuex'
import { render } from '@testing-library/vue'

import LoggingNotification from './LoggingNotification.vue'

describe('LoggingNotification.vue', () => {
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

    const { container } = render(LoggingNotification, {
      global: {
        plugins: [store],
      },
    })

    expect(container).toMatchSnapshot()
  })
})
