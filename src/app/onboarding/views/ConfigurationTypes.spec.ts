import { render, screen } from '@testing-library/vue'

import ConfigurationTypes from './ConfigurationTypes.vue'
import { store, storeKey } from '@/store/store'
import { ClientConfigInterface } from '@/store/modules/config/config.types'
import * as config from '@/api/mock-data/config.json'

function renderComponent(mode = 'standalone') {
  const clientConfig: ClientConfigInterface = { ...config, mode }
  store.state.config.clientConfig = clientConfig

  return render(ConfigurationTypes, {
    global: {
      plugins: [[store, storeKey]],
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
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('renders multizone previous step', () => {
    renderComponent('global')

    expect(screen.getByText('onboarding-multi-zone')).toBeInTheDocument()
  })
})
