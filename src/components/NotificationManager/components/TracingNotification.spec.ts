import renderWithVuex from '@/testUtils/renderWithVuex'
import TracingNotification from './TracingNotification.vue'

describe('TracingNotification.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(TracingNotification, {
      store: { modules: { config: { state: { kumaDocsVersion: '1.2.0' } } } },
    })

    expect(container).toMatchSnapshot()
  })
})
