import { createRouter, createWebHashHistory } from 'vue-router'
import { render, screen } from '@testing-library/vue'
import DonutChart from './DonutChart.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: { template: 'TestComponent' },
    },
  ],
})

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
