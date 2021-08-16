import { render } from '@testing-library/vue'
import TestComponent from '@/testUtils/TestComponent.vue'
import ShellEmpty from './ShellEmpty.vue'

describe('ShellEmpty.vue', () => {
  it('renders component with route', () => {
    const { container } = render(ShellEmpty, {
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
