import { render } from '@testing-library/vue'
import { KAlert, KButton } from '@kong/kongponents'

import UpgradeCheck from './UpgradeCheck.vue'
import { store, storeKey } from '@/store/store'

describe('UpgradeCheck.vue', () => {
  it('renders snapshot', async () => {
    store.state.config.tagline = import.meta.env.VITE_NAMESPACE

    const { container, findByText } = render(UpgradeCheck, {
      global: {
        plugins: [[store, storeKey]],
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
