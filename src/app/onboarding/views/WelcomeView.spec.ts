import { RouterLinkStub } from '@vue/test-utils'
import { render } from '@testing-library/vue'

import WelcomeView from './WelcomeView.vue'
import { store, storeKey } from '@/store/store'
import { ClientConfigInterface } from '@/store/modules/config/config.types'
import * as config from '@/api/mock-data/config.json'

function renderComponent(environment: string) {
  const clientConfig: ClientConfigInterface = { ...config, environment }
  store.state.config.clientConfig = clientConfig

  return render(WelcomeView, {
    global: {
      plugins: [[store, storeKey]],
      stubs: {
        routerLink: RouterLinkStub,
      },
    },
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
