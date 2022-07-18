import renderWithVuex from '@/testUtils/renderWithVuex';
import { screen } from '@testing-library/vue'
import { rest } from 'msw'
import { server } from '@/jest-setup'
import EnvoyClusters from './EnvoyClusters.vue'

describe('EnvoyClusters.vue', () => {
  it('renders snapshot', async () => {
    const { container } = renderWithVuex(EnvoyClusters, {
      props: {
        mesh: 'foo',
        dppName: 'dataplane-test-456',
      },
      routes: [],
    })

    expect(container).toMatchSnapshot()
  })

  it('renders loading', () => {
    renderWithVuex(EnvoyClusters, {
      props: {
        mesh: 'foo',
        dppName: 'dataplane-test-456',
      },
      routes: [],
    })

    expect(screen.getByText('spinner')).toBeInTheDocument()
  })

  it('renders error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // silence console errors

    server.use(
      rest.get('http://localhost/meshes/:mesh/dataplanes/:dataplaneName/clusters', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({})),
      ),
    )

    renderWithVuex(EnvoyClusters, {
      props: {
        mesh: 'default',
        dppName: 'dataplane-test-456',
      },
      routes: [],
    })

    expect(await screen.findByText(/An error has occurred while trying to load this data./)).toBeInTheDocument()
  })
})
