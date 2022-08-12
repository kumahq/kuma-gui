import AppShell from './AppShell.vue'
import TestComponent from '@/testUtils/TestComponent.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

describe('AppShell.vue', () => {
  it('renders component with route', () => {
    const { container } = renderWithVuex(AppShell, {
      routes: [
        {
          path: '/',
          name: 'default',
          component: TestComponent,
        },
      ],
    })

    expect(container).toMatchSnapshot()
  })
})
