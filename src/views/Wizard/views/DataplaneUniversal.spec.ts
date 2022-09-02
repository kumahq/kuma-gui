import { createStore } from 'vuex'
import { createRouter, createWebHashHistory } from 'vue-router'
import { rest } from 'msw'
import { render } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { KAlert, KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop, KTabs } from '@kong/kongponents'

import DataplaneUniversal from './DataplaneUniversal.vue'
import TestComponent from '@/testUtils/TestComponent.vue'
import { server } from '@/jest-setup'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TestComponent,
    },
    {
      path: '/create-mesh',
      name: 'create-mesh',
      component: TestComponent,
    },
  ],
})

describe('DataplaneUniversal.vue', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789)
  })

  it('passes whole wizzard and render yaml', async () => {
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + 'meshes/:mesh/dataplanes/:dataplaneName', (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ name: 'hi' })),
      ),
    )

    const store = createStore({
      modules: {
        config: {
          namespaced: true,
          state: {
            kumaDocsVersion: '1.2.0',
            tagline: 'Kuma',
          },
          getters: {
            getTagline: (state) => state.tagline,
            getVersion: () => undefined,
            getEnvironment: () => undefined,
          },
        },
      },
      state: {
        meshes: {
          items: [
            { name: 'testMesh' },
            { name: 'testMesh2' },
          ],
        },
      },
      getters: {
        getMeshList: (state) => state.meshes,
      },
    })

    const { container, getByText, getByDisplayValue, getByLabelText, findByText } = render(DataplaneUniversal, {
      global: {
        plugins: [router, store],
        components: {
          KAlert,
          KButton,
          KCard,
          KClipboardProvider,
          KEmptyState,
          KIcon,
          KPop,
          KTabs,
        },
      },
    })

    const select = <HTMLInputElement>getByDisplayValue('Select an existing Mesh…')
    const nextButton = getByText(/Next ›/i).closest('button')

    expect(select.value).toBe('')
    expect(nextButton).toHaveAttribute('disabled')

    await userEvent.selectOptions(select, 'testMesh')
    await userEvent.click(getByText('Next ›'))

    expect(nextButton).toHaveAttribute('disabled')

    await userEvent.type(getByLabelText('Service name:'), 'testMesh')

    await userEvent.click(getByText(/Edit/))
    const dataplaneId = <HTMLInputElement>getByLabelText('Dataplane ID:')

    dataplaneId.setSelectionRange(0, dataplaneId.value.length)
    await userEvent.type(dataplaneId, 'testMesh')

    await userEvent.click(getByText('Next ›'))

    expect(nextButton).toHaveAttribute('disabled')

    await userEvent.type(getByLabelText('Service Port:'), '1')
    await userEvent.type(getByLabelText('Data Plane IP Address:'), '12')
    await userEvent.type(getByLabelText('Data Plane Port:'), '1')
    await userEvent.click(getByText('Next ›'))

    await findByText(/kumactl/)

    expect(container).toMatchSnapshot()
  })
})
