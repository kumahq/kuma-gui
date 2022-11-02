import { render, screen } from '@testing-library/vue'

import DonutChart from './DonutChart.vue'
import { createRouter } from '@/router/router'

const router = createRouter()

describe('DonutChart.vue', () => {
  it('renders chart', async () => {
    render(DonutChart, {
      global: {
        plugins: [router],
      },
      props: {
        data: [
          {
            value: 1,
            category: 'ca-1',
          },
        ],
        title: 'DonutChart',
      },
    })

    expect(await screen.findByLabelText('ca-1')).toBeInTheDocument()
  })
})
