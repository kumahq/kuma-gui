import { flushPromises } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'

import KLoader from './KLoader.vue'

jest.useFakeTimers()

describe('KLoader.vue', () => {
  it('renders snapshot at the beginning', () => {
    const { container } = render(KLoader)

    expect(container).toMatchSnapshot()
  })

  it('checks if width is max of 100% size', async () => {
    render(KLoader)

    jest.advanceTimersByTime(2500)

    await flushPromises()

    expect(screen.getByRole('progressbar')).toHaveAttribute('style', 'width: 100%;')
  })
})
