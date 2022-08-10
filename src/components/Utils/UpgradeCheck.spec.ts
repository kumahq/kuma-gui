import UpgradeCheck from './UpgradeCheck.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

describe('UpgradeCheck.vue', () => {
  it('renders snapshot', async () => {
    const { container, findByText } = renderWithVuex(UpgradeCheck, {
      store: { modules: { config: { state: { kumaDocsVersion: '1.2.0', tagline: 'Kuma' } } } },
    })

    await findByText('Update')
    expect(container).toMatchSnapshot()
  })
})
