import { createStore } from 'vuex'
import { render } from '@testing-library/vue'
import { KAlert, KButton } from '@kong/kongponents'

import UpgradeCheck from './UpgradeCheck.vue'

describe('UpgradeCheck.vue', () => {
  it('renders snapshot', async () => {
    const store = createStore({
      modules: {
        config: {
          namespaced: true,
          state: {
            kumaDocsVersion: '1.2.0',
            tagline: 'Kuma',
          },
          getters: {
            getTagline: (state) => state.tagline,
            getVersion: () => undefined,
          },
        },
      },
    })

    const { container, findByText } = render(UpgradeCheck, {
      global: {
        plugins: [store],
        components: {
          KAlert,
          KButton,
        },
      },
    })

    await findByText('Update')
    expect(container).toMatchSnapshot()
  })
})
