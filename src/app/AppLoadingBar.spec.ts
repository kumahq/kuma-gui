import { flushPromises } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'

import AppLoadingBar from './AppLoadingBar.vue'

jest.useFakeTimers()

describe('AppLoadingBar', () => {
  it('renders snapshot at the beginning', () => {
    const { container } = render(AppLoadingBar)

    expect(container).toMatchSnapshot()
  })

  it('checks if width is max of 100% size', async () => {
    render(AppLoadingBar)

    jest.advanceTimersByTime(2500)

    await flushPromises()

    expect(screen.getByRole('progressbar')).toHaveAttribute('style', 'width: 100%;')
  })
})
