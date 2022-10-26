import { _highlightCode, highlightElement, AvailableLanguages } from './highlightElement'

const highlightCodeTestCases: Array<[{ language: AvailableLanguages, code: string }, string]> = [
  [
    {
      language: 'json',
      code: '{}',
    },
    'token punctuation',
  ],
  [
    {
      language: 'yaml',
      code: 'key: value',
    },
    'token key',
  ],
  [
    {
      language: 'bash',
      code: 'echo "hello"',
    },
    'token builtin',
  ],
  [
    {
      language: 'plaintext',
      code: 'Hello, world!',
    },
    'Hello, world!',
  ],
]

describe('_highlightCode', () => {
  test.each(highlightCodeTestCases)('handles available languages', ({ language, code }, expectedSubString) => {
    const highlightedCode = _highlightCode(code, language)

    expect(highlightedCode).toContain(expectedSubString)
  })

  test('renders plaintext on unknown language and doesn’t throw', () => {
    const code = 'print("Hello, world!")'
    // @ts-expect-error because we’re testing passing an invalid language
    const highlightedCode = _highlightCode(code, 'python')

    expect(highlightedCode).toBe(code)
  })
})

const highlightElementTextCases: Array<[{ language: AvailableLanguages, code: string }, string]> = [
  [
    {
      language: 'json',
      code: `{
        "key": "value"
      }`,
    },
    '.token.punctuation',
  ],
  [
    {
      language: 'yaml',
      code: 'key: value',
    },
    '.token.key.atrule',
  ],
  [
    {
      language: 'bash',
      code: 'echo "hello"',
    },
    '.token.builtin.class-name',
  ],
]

describe('highlightElement', () => {
  test.each(highlightElementTextCases)('handles available languages', ({ language, code }, expectedSelector) => {
    const preElement = document.createElement('pre')
    const codeElement = document.createElement('code')
    preElement.appendChild(codeElement)

    highlightElement(preElement, codeElement, code, language)

    expect(preElement.classList.contains(`language-${language}`)).toBe(true)
    expect(codeElement.classList.contains(`language-${language}`)).toBe(true)

    // Verifies that the Prism syntax highlighting is working
    const token = codeElement.querySelector(expectedSelector)
    expect(token instanceof HTMLElement).toBe(true)
  })
})
