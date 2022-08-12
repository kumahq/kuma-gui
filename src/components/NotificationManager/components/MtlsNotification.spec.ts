import MtlsNotification from './MtlsNotification.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

describe('MtlsNotification.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(MtlsNotification, {
      store: { modules: { config: { state: { kumaDocsVersion: '1.2.0' } } } },
    })

    expect(container).toMatchSnapshot()
  })
})
