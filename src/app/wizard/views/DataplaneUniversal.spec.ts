import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'
import { rest } from 'msw'

import DataplaneUniversal from './DataplaneUniversal.vue'
import { store } from '@/store/store'
import { server } from '@/../jest/jest-setup-after-env'

function renderComponent() {
  return mount(DataplaneUniversal)
}

describe('DataplaneUniversal.vue', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789)
  })

  test('passes whole wizzard and render yaml', async () => {
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + 'meshes/:mesh/dataplanes/:dataplaneName', (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ name: 'hi' })),
      ),
    )

    store.state.config.tagline = import.meta.env.VITE_NAMESPACE
    store.state.meshes.items = [
      {
        name: 'testMesh',
        creationTime: '0001-01-01T00:00:00Z',
        modificationTime: '0001-01-01T00:00:00Z',
        type: 'Mesh',
      },
      {
        name: 'testMesh2',
        creationTime: '0001-01-01T00:00:00Z',
        modificationTime: '0001-01-01T00:00:00Z',
        type: 'Mesh',
      },
    ]

    const wrapper = renderComponent()

    const meshSelect = wrapper.find<HTMLSelectElement>('[data-testid="mesh-select"]')
    const nextButton = wrapper.find('[data-testid="next-step-button"]')

    expect(meshSelect.element.value).toBe('')
    expect(nextButton.attributes('disabled')).toBe('')

    await meshSelect.setValue('testMesh')
    await nextButton.trigger('click')
    await flushPromises()

    expect(nextButton.attributes('disabled')).toBe('')

    await wrapper.find('[data-testid="service-name"]').setValue('testMesh')

    await wrapper.find('[data-testid="edit-button"]').trigger('click')
    await wrapper.find('[data-testid="dataplane-id"]').setValue('testMesh')

    await nextButton.trigger('click')
    await flushPromises()

    expect(nextButton.attributes('disabled')).toBe('')

    await wrapper.find('[data-testid="service-port"]').setValue('1')
    await wrapper.find('[data-testid="network-address"]').setValue('12')
    await wrapper.find('[data-testid="network-dataplane-port"]').setValue('1')
    await nextButton.trigger('click')
    await flushPromises()

    expect(wrapper.html()).toContain('Auto-Inject DPP')
    expect(wrapper.html()).toContain('kumactl')
    expect(wrapper.html()).toContain('kuma-dp')

    expect(wrapper.element).toMatchSnapshot()
  })
})
