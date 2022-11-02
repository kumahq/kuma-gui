import { rest } from 'msw'
import { render } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

import DataplaneUniversal from './DataplaneUniversal.vue'
import { createRouter } from '@/router/router'
import { store, storeKey } from '@/store/store'
import { server } from '@/../jest/jest-setup'

const router = createRouter()

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

    const { container, getByText, getByDisplayValue, getByLabelText, findByText } = render(DataplaneUniversal, {
      global: {
        plugins: [router, [store, storeKey]],
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
    expect(getByText('Auto-Inject DPP')).toBeInTheDocument()

    expect(await findByText(/kumactl/)).toBeInTheDocument()
    expect(await findByText(/kuma-dp/)).toBeInTheDocument()

    expect(container).toMatchSnapshot()
  })
})
