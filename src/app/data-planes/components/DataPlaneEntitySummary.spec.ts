import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import DataPlaneEntitySummary from './DataPlaneEntitySummary.vue'
import { createDataPlaneOverview } from '@/test-data/createDataPlaneOverview'
import { useRouter } from '@/utilities'

const dataPlaneOverview = createDataPlaneOverview()

async function renderComponent(props = {}) {
  const router = useRouter()
  await router.push({
    name: 'data-plane-detail-view',
    params: {
      mesh: 'default',
      dataPlane: dataPlaneOverview.name,
    },
  })

  return mount(DataPlaneEntitySummary, {
    props: {
      dataPlaneOverview,
      ...props,
    },
  })
}

describe('DataPlaneEntitySummary', () => {
  test('matches snapshot', async () => {
    const wrapper = await renderComponent()

    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('shows correct content', async () => {
    const wrapper = await renderComponent()

    const statusBadge = wrapper.find('[data-testid="status-badge"]')
    expect(statusBadge.html()).toContain('online')

    const connectTime = wrapper.find('[data-testid^="data-plane-connect-time-"]')
    expect(connectTime.html()).toContain('February 17, 2021 at 7:33:36')

    const subscriptionStatus = wrapper.find('[data-testid^="data-plane-subscription-status-"]')
    expect(subscriptionStatus.html()).toContain('1 / 1')
  })
})
