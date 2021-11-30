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

    const demoRadio = screen.getAllByTestId('box')[0]
    const manuallyRadio = screen.getAllByTestId('box')[1]

    expect(demoRadio.className).toMatch('box--active')
    expect(manuallyRadio.className).not.toMatch('box--active')

    await userEvent.click(screen.getByText(/After this wizzard/))

    expect(demoRadio.className).not.toMatch('box--active')

    expect(manuallyRadio.className).toMatch('box--active')
  })
})
