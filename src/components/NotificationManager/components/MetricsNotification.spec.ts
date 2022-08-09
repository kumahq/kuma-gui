import renderWithVuex from '@/testUtils/renderWithVuex'
import MetricsNotification from './MetricsNotification.vue'

describe('MetricsNotification.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(MetricsNotification, {
      store: { modules: { config: { state: { kumaDocsVersion: '1.2.0' } } } },
    })

    expect(container).toMatchSnapshot()
  })
})
