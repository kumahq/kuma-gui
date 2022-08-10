import OverviewView from './OverviewView.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

describe('OverviewView.vue', () => {
  it('renders basic snapshot', () => {
    const { container } = renderWithVuex(OverviewView, {
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
