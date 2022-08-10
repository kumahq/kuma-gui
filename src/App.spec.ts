import { screen, waitForElementToBeRemoved } from '@testing-library/vue'
import { rest } from 'msw'
import App from './App.vue'
import { server } from '@/jest-setup'
import TestComponent from '@/testUtils/TestComponent.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

describe('App.vue', () => {
  it('renders main view when succesful', async () => {
    server.use(
      rest.get('http://localhost/', (req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            hostname: 'hostname',
            tagline: 'Kuma',
            version: '1.2.0-129-g2e3ace03',
          }),
        ),
      ),
    )
    server.use(rest.get(' http://localhost/config', (req, res, ctx) => res(ctx.status(200), ctx.json({}))))

    renderWithVuex(App, {
      routes: [
        {
          path: '/',
          name: 'default',
          component: TestComponent,
        },
      ],
    })

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

    expect(screen.getByText('TestComponent')).toBeInTheDocument()
  })

  it('fails to renders basic view', async () => {
    server.use(rest.get('http://localhost/', (req, res, ctx) => res(ctx.status(404))))

    const { container } = renderWithVuex(App)

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

    expect(container).toMatchSnapshot()
  })
})
