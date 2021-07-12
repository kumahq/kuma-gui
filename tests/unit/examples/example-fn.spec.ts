import example from './example-fn'

describe('example-fn', () => {
  it('test fn', () => {
    expect(example()).toBe(2)
  })
})
