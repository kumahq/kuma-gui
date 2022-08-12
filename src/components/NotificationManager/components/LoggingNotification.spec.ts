import LoggingNotification from './LoggingNotification.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

describe('LoggingNotification.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(LoggingNotification, {
      store: { modules: { config: { state: { kumaDocsVersion: '1.2.0' } } } },
    })

    expect(container).toMatchSnapshot()
  })
})
