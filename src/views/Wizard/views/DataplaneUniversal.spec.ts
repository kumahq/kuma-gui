import userEvent from '@testing-library/user-event'

import DataplaneUniversal from './DataplaneUniversal.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

describe('DataplaneUniversal.vue', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789)
  })

  it('passes whole wizzard and render yaml', async () => {
    const { container, getByText, getByDisplayValue, getByLabelText, findByText } = renderWithVuex(DataplaneUniversal, {
      store: {
        state: { meshes: { items: [{ name: 'testMesh' }, { name: 'testMesh2' }] } },
      },
      routes: [],
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
