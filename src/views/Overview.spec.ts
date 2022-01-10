import renderWithVuex from '@/testUtils/renderWithVuex'
import Overview from './Overview.vue'

describe('Overview.vue', () => {
  it('renders basic snapshot', () => {
    const { container } = renderWithVuex(Overview, {
      routes: [
        {
          path: '/zones',
          name: 'zones',
        },
        {
          path: '/dataplanes',
          name: 'dataplanes',
        },
      ],
    })

    expect(container).toMatchSnapshot()
  })
})
