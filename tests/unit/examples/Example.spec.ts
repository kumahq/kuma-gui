import { render } from '@testing-library/vue'
import Example from '../../tests/unit/Example.vue'

describe('Example.vue', () => {
  const props = { msg: 'new message' }

  it('renders props.msg when passed', () => {
    const { getByText } = render(Example, {
      props
    })

    expect(getByText(props.msg)).toBeInTheDocument()
  })

  it('renders fetch data', async () => {
    const mock = jest.fn()
    const { findByText } = render(Example, {
      props
    })

    expect(await findByText(1)).toBeInTheDocument()
    expect(mock).not.toHaveBeenCalled()
  })
})
