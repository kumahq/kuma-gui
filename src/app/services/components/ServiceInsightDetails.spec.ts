import { createRouter, createWebHashHistory } from 'vue-router'
import { mount, RouterLinkStub } from '@vue/test-utils'

import ServiceInsightDetails from './ServiceInsightDetails.vue'
import { store, storeKey } from '@/store/store'
import { createServiceInsight } from '@/test-data/createServiceInsight'

const serviceInsight = createServiceInsight()

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

function renderComponent(props = {}) {
  return mount(ServiceInsightDetails, {
    attachTo: document.body,
    props: {
      serviceInsight,
      ...props,
    },
    global: {
      plugins: [router, [store, storeKey]],
      stubs: {
        'router-link': RouterLinkStub,
      },
    },
  })
}

describe('ServiceInsightDetails', () => {
  beforeEach(() => {
    // The code block component uses debouncing which involves running timers.
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    // Clears `document.body` because we mount the component using `attachTo: document.body`.
    document.body.innerHTML = ''
  })

  test('shows correct content', async () => {
    const wrapper = renderComponent()

    jest.runAllTimers()

    const html = wrapper.html()
    expect(html).toContain('partially degraded')
    expect(html).toContain('Data planes (online / total)')
    expect(html).toContain('1 / 2')
    expect(html).toContain('status')
  })
})
