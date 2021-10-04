import renderWithVuex from '@/testUtils/renderWithVuex'
import MtlsNotification from './MtlsNotification.vue'

describe('MtlsNotification.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(MtlsNotification, {
      store: { modules: { config: { state: { version: '1.2.0' } } } },
    })

    expect(container).toMatchSnapshot()
  })
})
