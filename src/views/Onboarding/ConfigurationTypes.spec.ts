import renderWithVuex from '@/testUtils/renderWithVuex'
import { screen } from '@testing-library/vue'
import ConfigurationTypes from './ConfigurationTypes.vue'

describe('ConfigurationTypes.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(ConfigurationTypes, {
      store: { modules: { config: { state: { clientConfig: { store: { type: 'memory' } } } } } },
      routes: [],
    })

    expect(container).toMatchSnapshot()
  })

  it('renders multizone previous step', () => {
    renderWithVuex(ConfigurationTypes, {
      store: { modules: { config: { state: { clientConfig: { mode: 'global', store: { type: 'memory' } } } } } },
      stubs: {
        routerLink: {
          props: ['to'],
          template: '<span>{{to.name}}</span>',
        },
      },
    })

    expect(screen.getByText('onboarding-multi-zone')).toBeInTheDocument()
  })
})
