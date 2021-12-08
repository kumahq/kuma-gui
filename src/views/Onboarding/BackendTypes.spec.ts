import renderWithVuex from '@/testUtils/renderWithVuex'
import { screen } from '@testing-library/vue'
import BackendTypes from './BackendTypes.vue'

describe('BackendTypes.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(BackendTypes)

    expect(container).toMatchSnapshot()
  })

  it('renders multizone previous step', () => {
    renderWithVuex(BackendTypes, {
      store: { modules: { config: { state: { clientConfig: { mode: 'global' } } } } },
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
