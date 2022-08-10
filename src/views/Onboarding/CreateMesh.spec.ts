import { screen } from '@testing-library/vue'
import CreateMesh from './CreateMesh.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

describe('CreateMesh.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(CreateMesh)

    expect(container).toMatchSnapshot()
  })

  it('renders multizone next step', () => {
    renderWithVuex(CreateMesh, {
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
