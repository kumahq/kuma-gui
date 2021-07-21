
import TestComponent from '@/testUtils/TestComponent.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'
import Shell from './Shell.vue'

describe('Shell.vue', () => {
  it('renders component with route', () => {
    const { container } = renderWithVuex(Shell, {
      routes: [
        {
          path: '/',
          name: 'default',
          component: TestComponent
        }
      ]
    })

    expect(container).toMatchSnapshot()
  })
})
