import { createStore } from 'vuex'
import { RouterLinkStub } from '@vue/test-utils'
import { rest } from 'msw'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { KBadge, KCard, KEmptyState, KIcon, KPop } from '@kong/kongponents'

import DataplanePolicies from './DataplanePolicies.vue'
import Kuma from '@/services/kuma'
import { server } from '@/jest-setup'

async function renderComponent(props = {}) {
  const { policies } = await Kuma.getPolicyDefinitions()

  const policiesByType = policies.reduce((obj, policy) => Object.assign(obj, { [policy.name]: policy }), {})
  const store = createStore({
    state: {
      policiesByType,
    },
  })

  return render(DataplanePolicies, {
    global: {
      plugins: [store],
      components: {
        KBadge,
        KCard,
        KEmptyState,
        KIcon,
        KPop,
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
    },
    props,
  })
}

describe('DataplanePolicies.vue', () => {
  it('renders snapshot', async () => {
    const { container } = await renderComponent({
      mesh: 'foo',
      dppName: 'dataplane-test-456',
    })

    await userEvent.click(await screen.findByText('web'))

    expect(container).toMatchSnapshot()
  })

  it('renders loading', async () => {
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + 'meshes/:mesh/dataplanes/:dataplaneName/policies', (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ total: 0, items: [] })),
      ),
    )

    await renderComponent({
      mesh: 'foo',
      dppName: 'dataplane-test-456',
    })

    expect(screen.getByTestId('loading-block')).toBeInTheDocument()
  })

  it('renders error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => { }) // silence console errors

    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + 'meshes/:mesh/dataplanes/:dataplaneName/policies', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({})),
      ),
    )

    await renderComponent({
      mesh: 'default',
      dppName: 'dataplane-test-456',
    })

    expect((await screen.findAllByText(/An error has occurred while trying to load this data./))[0]).toBeInTheDocument()
  })

  it('renders no item', async () => {
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + 'meshes/:mesh/dataplanes/:dataplaneName/policies', (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ total: 0, items: [] })),
      ),
    )

    await renderComponent({
      mesh: 'default',
      dppName: 'dataplane-test-456',
    })

    expect(await screen.findByText(/There is no data to display./)).toBeInTheDocument()
  })
})
