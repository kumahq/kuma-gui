import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'

import Mesh from './Mesh.vue'
import { createRouter } from '@/router/router'
import { store, storeKey } from '@/store/store'
import { ClientConfigInterface } from '@/store/modules/config/config.types'
import * as config from '@/api/mock-data/config.json'

const router = createRouter()

function renderComponent(mode = 'standalone') {
  store.state.config.tagline = import.meta.env.VITE_NAMESPACE
  store.state.config.kumaDocsVersion = '1.2.0'
  const clientConfig: ClientConfigInterface = { ...config, mode }
  store.state.config.clientConfig = clientConfig

  return render(Mesh, {
    global: {
      plugins: [router, [store, storeKey]],
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
    const { container } = renderComponent('global')

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
