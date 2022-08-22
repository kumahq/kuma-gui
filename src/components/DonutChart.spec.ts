import { render, screen } from '@testing-library/vue'
import DonutChart from './DonutChart.vue'

describe('DonutChart.vue', () => {
  it('renders chart', async () => {
    render(DonutChart, {
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
