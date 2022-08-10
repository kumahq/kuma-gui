import TracingNotification from './TracingNotification.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

describe('TracingNotification.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(TracingNotification, {
      store: { modules: { config: { state: { kumaDocsVersion: '1.2.0' } } } },
    })

    expect(container).toMatchSnapshot()
  })
})
