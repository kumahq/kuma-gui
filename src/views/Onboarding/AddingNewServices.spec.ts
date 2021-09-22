import { screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import renderWithVuex from '@/testUtils/renderWithVuex'
import AddingNewServices from './AddingNewServices.vue'

describe('AddingNewServices.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(AddingNewServices)

    expect(container).toMatchSnapshot()
  })

  it('changes selected box', async () => {
    renderWithVuex(AddingNewServices)

    const demoRadio = <HTMLInputElement>screen.getByLabelText(/Demo/)
    const manuallyRadio = <HTMLInputElement>screen.getByLabelText(/Manually/)

    expect(demoRadio.checked).toBe(true)
    expect(manuallyRadio.checked).toBe(false)

    await userEvent.click(screen.getByText(/Custom Config/))

    expect(demoRadio.checked).toBe(false)
    expect(manuallyRadio.checked).toBe(true)
  })
})
