import { mount } from '@vue/test-utils'

import CodeBlock from './CodeBlock.vue'

function renderComponent(props = {}) {
  return mount(CodeBlock, {
    attachTo: document.body,
    props: {
      id: 'code-block',
      ...props,
    },
  })
}

describe('CodeBlock', () => {
  beforeEach(() => {
    // The code block component uses debouncing which involves running timers.
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    // Clears `document.body` because we mount the component using `attachTo: document.body`.
    document.body.innerHTML = ''
  })

  test('matches snapshot', () => {
    const wrapper = renderComponent({
      language: 'json',
      code: `
        {
          "key": "value"
        }
      `.trim(),
    })

    // Run debounce timers associated to highlighting
    jest.runAllTimers()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders code as plaintext for unknown language', () => {
    jest.spyOn(console, 'warn').mockImplementation()

    const wrapper = renderComponent({
      language: 'python',
      code: 'print("Hello, world!")',
    })

    // Run debounce timers associated to highlighting
    jest.runAllTimers()

    expect(console.warn).toHaveBeenCalled()

    const highlightedCodeBlock = wrapper.find('[data-testid="highlighted-code-block"]')
    expect(highlightedCodeBlock.html()).toContain('print("Hello, world!")')
  })

  describe('search & filter features', () => {
    test('allows searching to highlight matching lines', async () => {
      const wrapper = renderComponent({
        isSearchable: true,
        language: 'json',
        code: `
          {
            "key1": "string value",
            "key2": 5681,
            "key3": [1, 2, 3]
          }
        `.trim(),
      })

      // Searches in normal mode.
      const expectedLineNumbers = [2, 3, 4]

      const searchInput = wrapper.findComponent({ name: 'KInput' })
      await searchInput.vm.$emit('input', 'key')

      // Checks that the processing icon is shown while the actual search handler is being debounced.
      expect(wrapper.find('[data-testid="search-is-processing-icon"]').exists()).toBe(true)

      // Run debounce timers associated to search input
      jest.runAllTimers()
      // Reason: The rendering of the processing icon is controlled by a computed property which needs one Vue tick to recompute.
      await Promise.resolve()
      expect(wrapper.find('[data-testid="search-is-processing-icon"]').exists()).toBe(false)

      // Run debounce timers associated to highlighting
      jest.runAllTimers()

      // Checks if the correct line numbers are highlighted now that processing is done.
      for (const lineHighlight of wrapper.findAll('[data-range]')) {
        const lineNumber = parseInt(lineHighlight.element.getAttribute('data-range') as string)
        expect(expectedLineNumbers.includes(lineNumber)).toBe(true)
      }

      expect(wrapper.find('.is-current-highlight').exists()).toBe(false)

      // Jumps to the next (i.e. first) match using F3 and checks that the highlighted line numbers are jumped to in order.
      for (const lineNumber of expectedLineNumbers) {
        wrapper.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'F3', bubbles: true }))
        expect(wrapper.find('.is-current-highlight').element.getAttribute('data-range')).toBe(String(lineNumber))
      }

      // Searches again in regular expression mode.
      const expectedLineNumbersForRegExp = [2, 3]

      const regExpModeButton = wrapper.findComponent('[data-testid="regexp-mode-button"]')
      await regExpModeButton.trigger('click')
      await searchInput.vm.$emit('input', 'key[12]')
      // Run debounce timers associated to search input
      jest.runAllTimers()

      await Promise.resolve()
      // Run debounce timers associated to highlighting
      jest.runAllTimers()

      // Checks if the correct line numbers are highlighted now that processing is done.
      for (const lineHighlight of wrapper.findAll('[data-range]')) {
        const lineNumber = parseInt(lineHighlight.element.getAttribute('data-range') as string)
        expect(expectedLineNumbersForRegExp.includes(lineNumber)).toBe(true)
      }
    })

    test('allows filtering of matching lines', async () => {
      const wrapper = renderComponent({
        isSearchable: true,
        language: 'json',
        code: `
          {
            "key1": "string value",
            "key2": 5681,
            "key3": [1, 2, 3]
          }
        `.trim(),
      })

      // Searches in normal mode.
      const expectedMatchedTerms = ['key']
      const expectedNumberOfMatches = 3

      const filterModeButton = wrapper.findComponent('[data-testid="filter-mode-button"]')
      await filterModeButton.trigger('click')

      const searchInput = wrapper.findComponent({ name: 'KInput' })
      await searchInput.vm.$emit('input', 'key')
      // Run debounce timers associated to search input
      jest.runAllTimers()

      await Promise.resolve()

      let matchedTerms = wrapper.findAll('.matched-term')
      expect(matchedTerms.length).toBe(expectedNumberOfMatches)

      for (const matchedTerm of matchedTerms) {
        expect(expectedMatchedTerms.includes(matchedTerm.element.textContent as string))
      }

      // Searches again in regular expression mode.
      const expectedMatchedTermsForRegExp = ['key1', 'key2']
      const expectedNumberOfMatchesForRegExp = 2

      const regExpModeButton = wrapper.findComponent('[data-testid="regexp-mode-button"]')
      await regExpModeButton.trigger('click')
      await searchInput.vm.$emit('input', 'key[12]')
      // Run debounce timers associated to search input
      jest.runAllTimers()

      await Promise.resolve()

      matchedTerms = wrapper.findAll('.matched-term')
      expect(matchedTerms.length).toBe(expectedNumberOfMatchesForRegExp)

      for (const matchedTerm of matchedTerms) {
        expect(expectedMatchedTermsForRegExp.includes(matchedTerm.element.textContent as string))
      }
    })
  })
})
