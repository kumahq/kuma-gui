import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/vue'
import Mesh from './Mesh.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

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
    const { container } = renderWithVuex(Mesh, {
      store: {
        modules: {
          config: { state: { tagline: 'Kuma', clientConfig: { environment: 'universal' } } },
        },
      },
      routes: [],
    })

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

    await screen.findByText(/kumactl apply -f/)

    expect(container).toMatchSnapshot()
  })
})
