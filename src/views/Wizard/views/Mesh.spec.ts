import { createStore } from 'vuex'
import { createRouter, createWebHashHistory } from 'vue-router'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import { KAlert, KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop, KTabs } from '@kong/kongponents'

import Mesh from './Mesh.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: { template: 'TestComponent' },
    },
    {
      path: '/create-mesh',
      name: 'create-mesh',
      component: { template: 'TestComponent' },
    },
  ],
})

function renderComponent() {
  const store = createStore({
    modules: {
      config: {
        namespaced: true,
        state: {
          tagline: 'Kuma',
          kumaDocsVersion: '1.2.0',
          clientConfig: {
            mode: 'global',
            environment: 'universal',
          },
        },
        getters: {
          getTagline: (state) => state.tagline,
          getKumaDocsVersion: (state) => state.kumaDocsVersion,
          getEnvironment: (state) => state.clientConfig?.environment,
          getMulticlusterStatus: () => false,
        },
      },
    },
  })

  return render(Mesh, {
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
}

describe('Mesh.vue', () => {
  const doStep = async (button: any, target: string | string[]) => {
    const targetNames = Array.isArray(target) ? target : [target]
    // Begin step

    expect(button).not.toHaveAttribute('disabled')

    // Check extended validation

    await userEvent.click(screen.getByText('Enabled'))

    expect(button).toHaveAttribute('disabled')

    for (const targetName of targetNames) {
      await userEvent.type(screen.getByLabelText(targetName), 'fake-name')
    }

    expect(button).not.toHaveAttribute('disabled')

    await userEvent.click(screen.getByText('Next ›'))
  }

  it('passes whole wizzard and render yaml', async () => {
    const { container } = renderComponent()

    const nextButton = screen.getByText(/Next ›/i).closest('button')

    // basic validation on first step
    expect(nextButton).toHaveAttribute('disabled')

    await userEvent.type(screen.getByLabelText('Mesh name:'), 'default')

    // 1 step cd.

    await doStep(nextButton, 'Certificate name:')

    // 2 Step

    await doStep(nextButton, 'Backend name:')

    // 3 Step

    await doStep(nextButton, ['Backend name:', 'URL:'])

    // 4 Step

    await doStep(nextButton, 'Backend name:')

    await screen.findByText(/kumactl apply/)

    expect(container).toMatchSnapshot()
  })
})
